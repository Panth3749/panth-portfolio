"use client";
/* Lightfall — self-contained Kexsio background.
   Copy this file in, run `npm i` for any imports it uses, and render <Lightfall />.
   Preset that matches the Kexsio store preview is at the bottom of this file. */

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export interface LightfallProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  streakCount?: number;
  streakWidth?: number;
  streakLength?: number;
  glow?: number;
  density?: number;
  twinkle?: number;
  zoom?: number;
  backgroundGlow?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  mixBlendMode?: string;
}

type RGB = [number, number, number];

const MAX_COLORS = 8;

const hexToRGB = (hex: string): RGB => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepColors = (input?: string[]) => {
  const base = (
    input && input.length
      ? input
      : ['#FFFFFF', '#F8FAFC', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#60A5FA', '#3B82F6']
  ).slice(0, MAX_COLORS);
  const count = base.length;
  const arr: RGB[] = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg: RGB = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

// Hash functions for procedural tubes
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

void mainImage(out vec4 fragColor, vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

  // Diagonal angle matching the reference image (-42 degrees)
  float angle = -0.733;
  float cA = cos(angle);
  float sA = sin(angle);
  mat2 rot = mat2(cA, -sA, sA, cA);
  vec2 p = rot * uv;

  // Mouse interaction in screen space
  vec2 mUv = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
  float mouseDist = length(uv - mUv);
  float mouseGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    mouseGlow = exp(-mouseDist * mouseDist / max(uMouseRadius * uMouseRadius * 0.08, 1e-4)) * uMouseStrength;
  }

  // Tube spacing & width
  float spacing = 0.056 / max(0.25, uDensity);
  float baseRadius = spacing * 0.44 * clamp(uStreakWidth, 0.5, 2.0);

  // Background radiant sky-white canvas (NO dark theme!)
  vec3 col = uBgColor;
  col += vec3(-0.012, -0.008, 0.015) * uv.y;

  float baseTrack = floor(p.x / spacing);
  vec3 tubeAccum = vec3(0.0);
  float maxAlpha = 0.0;
  vec3 bloomAccum = vec3(0.0);

  // Check 4 adjacent tube tracks to get seamless overlapping cylindrical ribbons
  for (int i = -1; i <= 2; i++) {
    float id = baseTrack + float(i);
    float h1 = hash11(id * 19.173 + 3.41);
    float h2 = hash11(id * 73.911 + 9.87);
    float h3 = hash11(id * 141.53 + 1.23);

    float cx = (id + 0.5) * spacing;
    float dx = p.x - cx;

    // Tube radius with subtle natural variation per strand
    float r = baseRadius * (0.88 + 0.24 * h2);
    float ndx = dx / r;

    // Pulse calculation along tube length
    float pulseSpeed = (uSpeed * 0.45 + 0.12) * (0.75 + 0.5 * h3);
    float pulsePeriod = 1.9 + 1.4 * h1;
    float pulsePhase = mod(p.y * 1.5 - iTime * pulseSpeed + h1 * 15.0, pulsePeriod);
    float pulseLen = 0.22 * clamp(uStreakLength, 0.3, 3.0);
    float pulseDist = abs(pulsePhase - pulsePeriod * 0.5);
    float pulseIntensity = smoothstep(pulseLen, 0.0, pulseDist);
    pulseIntensity = pulseIntensity * pulseIntensity;

    // Tube color from the light palette (crisp whites, ice blues, sky blues)
    vec3 tubeBase = palette(h1);

    // Pulse core: glowing cyan / electric blue in light theme
    vec3 pulseCol = mix(vec3(0.12, 0.65, 1.0), vec3(1.0, 1.0, 1.0), 0.70);

    // Delicate luminous bloom
    float haloDist = length(vec2(dx * 1.2, pulseDist * 0.6));
    float halo = exp(-haloDist * haloDist / (r * r * 4.0)) * pulseIntensity * 0.85 * uGlow;
    bloomAccum += pulseCol * halo;

    if (abs(ndx) < 1.03) {
      // 3D Cylindrical Surface Normal
      float cndx = clamp(ndx, -1.0, 1.0);
      float nz = sqrt(max(0.0, 1.0 - cndx * cndx));
      vec3 normal = normalize(vec3(cndx, 0.0, nz));

      // Key light from top-left creating crisp, clean light-theme cylindrical ridge
      vec3 lightDir = normalize(vec3(-0.45, -0.32, 0.83));
      float diff = max(0.0, dot(normal, lightDir));

      // Clean bright specular streak along the tube length
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(0.0, dot(normal, halfDir)), 18.0);

      // Delicate light-theme edge crease shadow (NO heavy dark theme shadows!)
      float edgeOcc = smoothstep(1.0, 0.68, abs(cndx));

      // Light-theme shaded cylinder body: high ambient base (0.76), bright & airy
      vec3 shaded = tubeBase * (0.76 + 0.24 * diff) + vec3(1.0) * spec * 0.45;
      shaded *= (0.84 + 0.16 * edgeOcc); // Only gentle 16% soft contact crease

      // Embedded glowing pulse slug
      vec3 pulseInside = pulseCol * (pulseIntensity * 1.5 * uGlow);

      // Mouse interactive lighting in sky-blue
      shaded += vec3(0.1, 0.45, 0.9) * (mouseGlow * 0.25 * (0.6 + 0.4 * diff));

      vec3 finalCylinder = shaded + pulseInside;

      float alpha = smoothstep(1.02, 0.96, abs(ndx));

      tubeAccum = mix(tubeAccum, finalCylinder, alpha);
      maxAlpha = max(maxAlpha, alpha);
    }
  }

  // Combine background, tubes, and glowing bloom
  col = mix(col, tubeAccum, maxAlpha * uOpacity);
  col += bloomAccum * uOpacity;

  fragColor = vec4(col, uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

const Lightfall: React.FC<LightfallProps> = ({
  className,
  dpr,
  paused = false,
  colors = ['#FFFFFF', '#F8FAFC', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#60A5FA', '#3B82F6'],
  backgroundColor = '#F0F7FF',
  speed = 0.5,
  streakCount = 2,
  streakWidth = 1,
  streakLength = 1,
  glow = 1,
  density = 0.6,
  twinkle = 1,
  zoom = 3,
  backgroundGlow = 0.5,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.5,
  mouseRadius = 1,
  mouseDampening = 0.15,
  mixBlendMode
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseTargetRef = useRef<[number, number]>([0, 0]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const { arr, count, avg } = prepColors(colors);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: hexToRGB(backgroundColor) },
      uMouseColor: { value: avg },
      uSpeed: { value: speed },
      uStreakCount: { value: Math.max(1, Math.min(16, Math.round(streakCount))) },
      uStreakWidth: { value: streakWidth },
      uStreakLength: { value: streakLength },
      uGlow: { value: glow },
      uDensity: { value: density },
      uTwinkle: { value: twinkle },
      uZoom: { value: zoom },
      uBgGlow: { value: backgroundGlow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    if (mouseInteraction) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value as number[];
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseInteraction) window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj: unknown, key: string) => {
        const fn = obj && (obj as Record<string, unknown>)[key];
        if (typeof fn === 'function') {
          (fn as () => void).call(obj);
        }
      };
      callIfFn(programRef.current, 'remove');
      callIfFn(geometryRef.current, 'remove');
      callIfFn(meshRef.current, 'remove');
      callIfFn(rendererRef.current, 'destroy');
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    mouseDampening
  ]);

  return (
    <div
      ref={containerRef}
      className={`lightfall-container ${className ?? ''}`}
      style={{
        ...(mixBlendMode && { mixBlendMode: mixBlendMode as React.CSSProperties['mixBlendMode'] })
      }}
    />
  );
};

export { Lightfall };
export default Lightfall;

// ── Styles (auto-applied on import; no separate CSS file needed) ────────────
const __KX_CSS = `
.lightfall-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
`;
if (typeof document !== "undefined" && !document.getElementById("kx-bg-lightfall")) {
  const __kxStyle = document.createElement("style");
  __kxStyle.id = "kx-bg-lightfall";
  __kxStyle.textContent = __KX_CSS;
  document.head.appendChild(__kxStyle);
}
