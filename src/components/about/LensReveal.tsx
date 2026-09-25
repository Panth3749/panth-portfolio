"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowUpRight, Maximize2, Compass } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────
   LensReveal — High-Performance Precision Optical Refraction Loupe
   Optimized Three.js WebGL Shader for Panth Mistry Portfolio.
   
   • Compact & refined lens radius (0.10) for realistic optical glass physics.
   • Zero texture reallocations: Fixed high-res GPU buffers eliminate all stutter/flicker.
   • Direct uniform updates drive 120 FPS critically-damped spring glide.
   ──────────────────────────────────────────────────────────────────────── */

interface LensRevealProps {
  onEnterFullProfile?: () => void;
  scrollProgress?: number;
}

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSurface;
  uniform sampler2D uHidden;
  uniform vec2  uLens;     // lens centre, uv (y up)
  uniform float uRadius;   // radius in height-normalised units
  uniform float uAspect;   // width / height
  uniform float uActive;   // 0..1 lens presence
  uniform float uTime;

  void main() {
    vec2 p = vUv;
    vec3 surface = texture2D(uSurface, p).rgb;

    // Aspect-corrected vector keeps lens perfectly round
    vec2 d = p - uLens;
    d.x *= uAspect;
    float dist = length(d);
    float r = uRadius;

    // Subtle natural glass breathing (calm, slow frequency)
    float rr = r * (1.0 + 0.004 * sin(uTime * 0.4));

    float feather = 0.012;
    float mask = (1.0 - smoothstep(rr - feather, rr, dist)) * uActive;

    // Soft contact shadow just outside the glass rim
    float shadow = smoothstep(rr, rr + 0.008, dist) * (1.0 - smoothstep(rr + 0.008, rr + 0.05, dist));
    surface *= 1.0 - shadow * 0.18 * uActive;

    // Subtle light-blue caustic edge glow just outside rim
    float caustic = smoothstep(rr, rr + 0.004, dist) * (1.0 - smoothstep(rr + 0.004, rr + 0.025, dist));
    vec3 causticCol = vec3(0.08, 0.60, 0.95);
    surface = mix(surface, causticCol, caustic * 0.35 * uActive);

    vec3 outc = surface;

    if (mask > 0.001) {
      float t = clamp(dist / rr, 0.0, 1.0);          // 0 centre .. 1 rim
      float z = sqrt(max(0.0, 1.0 - t * t));          // sphere surface height
      vec2 rel = p - uLens;

      // Authentic optical magnification (+16%) & subtle edge refraction
      float scale = 1.0 / (1.0 + 0.16 * z);
      float rim = 1.0 - z;
      vec2 sampUv = uLens + rel * scale + rel * (rim * 0.05);

      // Refracted surface visible through transparent glass
      vec3 refrSurface = texture2D(uSurface, sampUv).rgb;

      // Subtle chromatic aberration on edges
      vec2 caDir = rel / max(length(rel), 1e-4);
      float ca = rim * rim * 0.004;

      vec4 hid;
      hid.r = texture2D(uHidden, sampUv + caDir * ca).r;
      hid.g = texture2D(uHidden, sampUv).g;
      hid.b = texture2D(uHidden, sampUv - caDir * ca).b;
      hid.a = texture2D(uHidden, sampUv).a;

      // Light-blue optical glass body: refracted surface with luminous sky-blue wash
      vec3 lightBlueTint = vec3(0.72, 0.89, 1.0); // luminous icy light blue
      vec3 glassBody = mix(refrSurface, lightBlueTint, 0.16 + 0.10 * rim);

      // Composite hidden truth layer over transparent glass body using alpha
      vec3 inside = mix(glassBody, hid.rgb, clamp(hid.a * 0.95, 0.0, 1.0));

      // Specular reflection highlight on the glass edge
      vec2 lightDir = normalize(vec2(-0.55, 0.62));
      float facing = max(0.0, dot(d / max(dist, 1e-4), lightDir));
      float spec = smoothstep(0.85, 0.992, t) * (1.0 - smoothstep(0.992, 1.03, t)) * facing;
      
      // Precision glass meniscus bevel ring (crystalline light cyan)
      float ring = smoothstep(0.92, 0.985, t) * (1.0 - smoothstep(0.985, 1.0, t));
      vec3 specCol = vec3(0.80, 0.93, 1.0); // luminous icy light blue

      inside += spec * specCol * 0.45 + ring * specCol * 0.35;
      outc = mix(surface, inside, mask);
    }

    gl_FragColor = vec4(outc, 1.0);
  }
`;

export const LensReveal: React.FC<LensRevealProps> = ({
  onEnterFullProfile,
  scrollProgress = 0,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uSurface: { value: THREE.CanvasTexture };
    uHidden: { value: THREE.CanvasTexture };
    uLens: { value: THREE.Vector2 };
    uRadius: { value: number };
    uAspect: { value: number };
    uActive: { value: number };
    uTime: { value: number };
  } | null>(null);

  const targetRef = useRef<THREE.Vector2>(new THREE.Vector2(0.34, 0.48));
  const pointerInsideRef = useRef(false);
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // ── Fixed High-Resolution Textures (prevents reallocations and flickering) ──
    const TEX_W = 1600;
    const TEX_H = 900;

    const surfCanvas = document.createElement("canvas");
    surfCanvas.width = TEX_W;
    surfCanvas.height = TEX_H;
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.width = TEX_W;
    hiddenCanvas.height = TEX_H;

    // Draw Surface Layer (Luminous Light Sky-Blue Architectural Canvas)
    const drawSurface = () => {
      const ctx = surfCanvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, TEX_W, TEX_H);

      // Light Sky Blue & Ice Blue gradient
      const bgGrad = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
      bgGrad.addColorStop(0, "#F0F9FF");
      bgGrad.addColorStop(0.45, "#E0F2FE");
      bgGrad.addColorStop(1, "#BAE6FD");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, TEX_W, TEX_H);

      // Blueprint dot grid (delicate sky blue)
      ctx.save();
      ctx.fillStyle = "rgba(2, 132, 199, 0.22)";
      const step = 32;
      for (let x = step / 2; x < TEX_W; x += step) {
        for (let y = step / 2; y < TEX_H; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Atmospheric Scrim (subtle soft light sky frost vignette)
      const scrim = ctx.createLinearGradient(0, 0, 0, TEX_H);
      scrim.addColorStop(0, "rgba(240, 249, 255, 0.65)");
      scrim.addColorStop(0.3, "rgba(224, 242, 254, 0.20)");
      scrim.addColorStop(0.7, "rgba(186, 230, 253, 0.25)");
      scrim.addColorStop(1, "rgba(125, 211, 252, 0.40)");
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, TEX_W, TEX_H);

      // Typography
      const padX = TEX_W * 0.08;
      const fs = 76;
      const lh = 78;
      let baseY = TEX_H * 0.43;

      // Kicker
      ctx.save();
      ctx.fillStyle = "#0284C7";
      ctx.font = `700 15px "JetBrains Mono", monospace`;
      ctx.letterSpacing = "0.18em";
      ctx.fillText("01 // PANTH MISTRY · THE SURFACE", padX, baseY - fs * 0.82);
      ctx.restore();

      // Headline lines (Deep Slate-900 for high-contrast crispness on light blue)
      ctx.fillStyle = "#0F172A";
      ctx.font = `900 ${fs}px system-ui, -apple-system, sans-serif`;
      const lines = ["THE SURFACE", "IS CALM,", "CODE RUNS DEEP"];
      for (const line of lines) {
        ctx.fillText(line, padX, baseY);
        baseY += lh;
      }

      // Footnote
      ctx.save();
      ctx.fillStyle = "#0369A1";
      ctx.font = `600 14px "JetBrains Mono", monospace`;
      ctx.fillText("✦ HOVER GLASS LENS TO REVEAL ARCHITECTURAL TRUTH ↗", padX, baseY + 36);
      ctx.restore();
    };

    // Draw Hidden Layer (Luminous Light Blue & White Truth Beneath Transparent Glass)
    const drawHidden = () => {
      const ctx = hiddenCanvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, TEX_W, TEX_H);

      // Ethereal Light Sky-Blue / Ice-Cyan Translucent Radial Aura
      const bgGrad = ctx.createRadialGradient(
        TEX_W * 0.36,
        TEX_H * 0.48,
        30,
        TEX_W * 0.36,
        TEX_H * 0.48,
        Math.max(TEX_W, TEX_H) * 0.65
      );
      bgGrad.addColorStop(0, "rgba(56, 189, 248, 0.32)");    // soft sky-400 aura
      bgGrad.addColorStop(0.40, "rgba(14, 165, 233, 0.20)"); // celestial cyan-blue
      bgGrad.addColorStop(0.75, "rgba(2, 132, 199, 0.08)");  // faint light blue
      bgGrad.addColorStop(1, "rgba(2, 132, 199, 0.0)");      // 100% transparent edge
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, TEX_W, TEX_H);

      // Glowing Light Blue Neural Constellation Network
      ctx.save();
      ctx.strokeStyle = "rgba(14, 165, 233, 0.45)";
      ctx.lineWidth = 1.4;
      const pts = [
        { x: TEX_W * 0.16, y: TEX_H * 0.32 },
        { x: TEX_W * 0.36, y: TEX_H * 0.22 },
        { x: TEX_W * 0.62, y: TEX_H * 0.30 },
        { x: TEX_W * 0.84, y: TEX_H * 0.26 },
        { x: TEX_W * 0.26, y: TEX_H * 0.70 },
        { x: TEX_W * 0.48, y: TEX_H * 0.78 },
        { x: TEX_W * 0.78, y: TEX_H * 0.68 },
      ];
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (dist < TEX_W * 0.32) {
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
          }
        }
      }
      ctx.stroke();

      for (const p of pts) {
        // Glowing cyan-blue node halos
        ctx.fillStyle = "rgba(56, 189, 248, 0.40)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(2, 132, 199, 0.85)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        // Node center star
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Typography in identical metrics for seamless optical swap
      const padX = TEX_W * 0.08;
      const fs = 76;
      const lh = 78;
      let baseY = TEX_H * 0.43;

      // Soft frosted white/light sky backdrop pill directly under text for 100% legibility through transparent glass
      ctx.save();
      const textBackdrop = ctx.createLinearGradient(padX, baseY - fs, padX + TEX_W * 0.48, baseY + lh * 3);
      textBackdrop.addColorStop(0, "rgba(255, 255, 255, 0.88)");
      textBackdrop.addColorStop(1, "rgba(240, 249, 255, 0.80)");
      ctx.fillStyle = textBackdrop;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(padX - 24, baseY - fs * 0.95, TEX_W * 0.50, lh * 3 + 44, 24);
      } else {
        ctx.rect(padX - 24, baseY - fs * 0.95, TEX_W * 0.50, lh * 3 + 44);
      }
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Kicker: deep sky blue
      ctx.save();
      ctx.fillStyle = "#0284C7";
      ctx.font = `700 15px "JetBrains Mono", monospace`;
      ctx.letterSpacing = "0.18em";
      ctx.fillText("01 // WHAT RUNS BENEATH · THE ARCHITECT TRUTH", padX, baseY - fs * 0.82);
      ctx.restore();

      // Headline lines: deep slate-900 with subtle cyan glow
      ctx.save();
      ctx.fillStyle = "#0F172A";
      ctx.shadowColor = "rgba(56, 189, 248, 0.35)";
      ctx.shadowBlur = 8;
      ctx.font = `900 ${fs}px system-ui, -apple-system, sans-serif`;
      const lines = ["B.TECH IN AI,", "NEURAL LOGIC,", "SYSTEM ARCHITECT"];
      for (const line of lines) {
        ctx.fillText(line, padX, baseY);
        baseY += lh;
      }
      ctx.restore();

      // Subtitle: rich sky-800
      ctx.save();
      ctx.fillStyle = "#0369A1";
      ctx.font = `600 14px "JetBrains Mono", monospace`;
      ctx.fillText("✦ ITM SLS BARODA · GOOGLE GEMINI LABS · 120 FPS NATIVE ENGINES", padX, baseY + 36);
      ctx.restore();
    };

    drawSurface();
    drawHidden();

    // ── Three.js WebGL Setup ──────────────────────────────────────────
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 w-full h-full block";
    host.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const surfTex = new THREE.CanvasTexture(surfCanvas);
    const hiddenTex = new THREE.CanvasTexture(hiddenCanvas);
    for (const tx of [surfTex, hiddenTex]) {
      tx.minFilter = THREE.LinearFilter;
      tx.magFilter = THREE.LinearFilter;
      tx.generateMipmaps = false;
    }

    // BASE RADIUS: Balanced Medium Lens (0.23) — comfortably frames headline words with crisp clarity!
    const BASE_RADIUS = 0.23;

    const uniforms = {
      uSurface: { value: surfTex },
      uHidden: { value: hiddenTex },
      uLens: { value: new THREE.Vector2(0.34, 0.48) },
      uRadius: { value: BASE_RADIUS },
      uAspect: { value: 1.777 },
      uActive: { value: 0 },
      uTime: { value: 0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // ── Resize only updates viewport & aspect ratio (NEVER clears textures) ──
    const updateSize = () => {
      if (!host) return;
      const w = host.clientWidth || 960;
      const h = host.clientHeight || 540;
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = w / h;
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });

    // ── Pointer tracking with spring inertia ─────────────────────────
    const setTargetFromClient = (cx: number, cy: number) => {
      if (!host) return;
      const rect = host.getBoundingClientRect();
      targetRef.current.x = (cx - rect.left) / rect.width;
      targetRef.current.y = 1 - (cy - rect.top) / rect.height; // uv y up
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerInsideRef.current = true;
      setTargetFromClient(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      pointerInsideRef.current = false;
    };

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // ── High-FPS Hardware Render Loop ────────────────────────────────
    let raf = 0;
    let t0 = performance.now();
    const start = t0;
    const lens = uniforms.uLens.value;
    const vel = new THREE.Vector2(0, 0);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      const elapsed = (now - start) / 1000;
      uniforms.uTime.value = elapsed;

      // Smooth presence fade-in
      uniforms.uActive.value = Math.min(1, uniforms.uActive.value + dt * 2.5);

      // Balanced medium lens radius + cinematic bidirectional scroll expansion
      const sp = scrollProgressRef.current;
      let targetRad = BASE_RADIUS;
      if (sp < 0.20) {
        // Phase 1: Interactive balanced medium loupe (0.23 -> 0.26)
        targetRad = BASE_RADIUS + sp * 0.15;
      } else if (sp < 0.60) {
        // Phase 2: Dramatic scroll expansion / retraction (0.26 <-> 1.85)
        const expT = (sp - 0.20) / 0.40;
        const easeExp = expT * expT * (3 - 2 * expT); // smoothstep ease
        targetRad = 0.26 + easeExp * 1.59; // reaches 1.85, fully engulfing canvas
      } else {
        // Phase 3: Fully expanded state
        targetRad = 1.85;
      }
      uniforms.uRadius.value += (targetRad - uniforms.uRadius.value) * 0.15;

      // When pointer is not hovering, follow scroll-progress path gently across the headlines
      if (!pointerInsideRef.current) {
        if (sp < 0.20) {
          // Gently floats over headline words with slow, tranquil breathing
          const autoX = 0.34 + sp * 0.18 + 0.008 * Math.sin(elapsed * 0.22);
          const autoY = 0.48 + 0.008 * Math.cos(elapsed * 0.18);
          targetRef.current.set(autoX, autoY);
        } else {
          // Centers smoothly as expansion blooms outward / returns
          const centerT = Math.min(1, (sp - 0.20) / 0.25);
          const autoX = 0.38 * (1 - centerT) + 0.50 * centerT;
          const autoY = 0.48 * (1 - centerT) + 0.50 * centerT;
          targetRef.current.set(autoX, autoY);
        }
      } else if (sp >= 0.22) {
        // If pointer is hovering during expansion, gently attract toward center
        const centerT = Math.min(1, (sp - 0.22) / 0.35);
        targetRef.current.x = targetRef.current.x * (1 - centerT * 0.08) + 0.50 * (centerT * 0.08);
        targetRef.current.y = targetRef.current.y * (1 - centerT * 0.08) + 0.50 * (centerT * 0.08);
      }

      // Calm, heavy optical glass spring inertia (smooth, serene, no rapid twitching)
      const springK = pointerInsideRef.current ? 0.08 : 0.045;
      const springDamp = 0.82;
      vel.x = (vel.x + (targetRef.current.x - lens.x) * springK) * springDamp;
      vel.y = (vel.y + (targetRef.current.y - lens.y) * springK) * springDamp;
      lens.x += vel.x;
      lens.y += vel.y;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      material.dispose();
      quad.geometry.dispose();
      surfTex.dispose();
      hiddenTex.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-3xl group bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100">
      {/* Three.js Lens Canvas Container */}
      <div
        ref={hostRef}
        className="relative w-full h-full cursor-crosshair overflow-hidden rounded-3xl"
        style={{ minHeight: "380px" }}
      />

      {/* Glass Meniscus Glow Border */}
      <div
        className="absolute inset-0 rounded-3xl border border-sky-400/30 pointer-events-none transition-all group-hover:border-sky-300/60"
        style={{
          boxShadow: scrollProgress > 0.20 ? `0 0 ${Math.round(Math.min(1, (scrollProgress - 0.20) / 0.35) * 85)}px rgba(56, 189, 248, 0.45)` : undefined
        }}
      />

      {/* Expansion Portal Aura overlay as user nears full expansion */}
      {scrollProgress > 0.25 && (
        <div
          className="absolute inset-0 pointer-events-none bg-radial from-sky-400/25 via-sky-500/10 to-transparent transition-opacity duration-150 z-20"
          style={{
            opacity: Math.min(1, (scrollProgress - 0.25) / 0.25)
          }}
        />
      )}

      {/* Chrome Overlays - gracefully fades out as lens expands to full canvas */}
      <div
        className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between transition-opacity duration-200 z-10"
        style={{
          opacity: scrollProgress > 0.20 ? Math.max(0, 1 - (scrollProgress - 0.20) / 0.18) : 1
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-sky-300 text-[11px] font-mono font-bold text-blue-950 backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>PRECISION REFRACTION LENS · DRAG GLASS</span>
          </div>

          {onEnterFullProfile && (
            <button
              onClick={onEnterFullProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              title="Expand to Full Architect Profile"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand to Full Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-blue-950 pointer-events-auto bg-white/90 px-4 py-2 rounded-2xl border border-sky-300 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-sky-600 animate-spin" style={{ animationDuration: "10s" }} />
            <span>Drag glass across words to inspect architectural truth</span>
          </div>

          {onEnterFullProfile && (
            <button
              onClick={onEnterFullProfile}
              className="hidden sm:inline-flex items-center gap-1 text-blue-700 hover:text-blue-950 font-bold underline cursor-pointer"
            >
              <span>Explore Complete Roadmap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LensReveal;
