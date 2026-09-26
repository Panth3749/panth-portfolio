"use client";
/* Lightfall — self-contained WebGL Hopf Fibration Torus Background.
   Optimized for the architectural light-blue & white portfolio theme,
   with support for customizable streak colors, density, speed, and interactive mouse glow. */

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export interface LightfallProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  theme?: 'light' | 'dark';
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

export const DEFAULT_LIGHT_COLORS = [
  '#FFFFFF', // Pure luminous white
  '#E0F2FE', // Luminous ice crystal blue
  '#BAE6FD', // Soft pale sky blue
  '#38BDF8', // Vivid electric sky blue
  '#60A5FA', // Cornflower / periwinkle blue
  '#2563EB', // Architectural royal blue
  '#1D4ED8', // Deep sapphire blue
  '#1E3A8A'  // Structural navy blue
];

const hexToRGB = (hex: string): RGB => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepColors = (input?: string[]) => {
  const base = (input && input.length ? input : DEFAULT_LIGHT_COLORS).slice(0, MAX_COLORS);
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
uniform float uIsLightMode;

varying vec2 vUv;

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

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);

  // Mouse interaction glow calculation
  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  if (uIsLightMode > 0.5) {
    // ── LIGHT MODE (Matches portfolio website light sky theme) ──
    float yPos = clamp(vUv.y, 0.0, 1.0);
    vec3 topCol = vec3(0.941, 0.969, 1.0);   // #F0F7FF (Hero edge match)
    vec3 midCol = vec3(0.886, 0.937, 1.0);   // #E2EFFF
    vec3 botCol = vec3(0.835, 0.910, 0.992); // #D5E8FD

    // Smooth architectural background gradient
    vec3 baseBg = mix(botCol, mix(midCol, topCol, clamp(yPos * 2.0 - 1.0, 0.0, 1.0)), clamp(yPos * 2.0, 0.0, 1.0));

    // Ambient radial lighting
    float radial = 1.0 / (1.0 + 3.8 * dot(P, P));
    baseBg += vec3(0.03, 0.08, 0.22) * radial * uBgGlow;

    // Interactive mouse highlight wash
    if (uMouseEnabled > 0.5) {
      baseBg = mix(baseBg, vec3(1.0), mGlow * 0.35);
    }

    vec3 composite = baseBg;

    // Draw flowing 3D Hopf fibration streaks
    for (int m = 0; m < 16; m++) {
      if (m >= uStreakCount) break;
      float jf = float(m) + 1.0;
      float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
      vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
      Pp -= floor(Pp / Y + 0.5) * Y;
      float h = fract(8663.0 * ic);
      vec3 col = palette(h);
      float weight = mix(1.3, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
      weight *= (1.0 + mGlow * 1.8);
      vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
      vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
      float val = dot(sm, vec2(exp(tail * Pp.y), 3.0)) * weight * uGlow;

      float alpha = clamp(val * 0.75, 0.0, 0.92);
      composite = mix(composite, col, alpha);

      // Light-emitting bloom for bright streaks (white, ice cyan)
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      if (lum > 0.65) {
        composite += col * pow(alpha, 1.8) * 0.38;
      }
      C.x += Y.x / 8.0;
    }

    o = vec4(clamp(composite, 0.0, 1.0), uOpacity);
  } else {
    // ── DARK MODE (Classic Kexsio additive glow preset) ──
    vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);
    if (uMouseEnabled > 0.5) {
      O.rgb += uMouseColor * mGlow * 0.25;
    }

    for (int m = 0; m < 16; m++) {
      if (m >= uStreakCount) break;
      float jf = float(m) + 1.0;
      float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
      vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
      Pp -= floor(Pp / Y + 0.5) * Y;
      float h = fract(8663.0 * ic);
      vec3 col = palette(h);
      float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
      weight *= (1.0 + mGlow * 2.0);
      vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
      vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
      O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
      C.x += Y.x / 8.0;
    }

    vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
    o = vec4(colr, uOpacity);
  }
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
  theme = 'light',
  colors = DEFAULT_LIGHT_COLORS,
  backgroundColor = '#E2EFFF',
  speed = 0.45,
  streakCount = 5,
  streakWidth = 1.6,
  streakLength = 2.0,
  glow = 1.2,
  density = 0.65,
  twinkle = 0.85,
  zoom = 2.8,
  backgroundGlow = 0.35,
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
  const uniformsRef = useRef<Record<string, { value: unknown }> | null>(null);
  const pausedRef = useRef(paused);
  const mouseTargetRef = useRef<[number, number]>([0, 0]);
  const lastTimeRef = useRef(0);

  pausedRef.current = paused;

  // Initialize WebGL context and scene
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

    const uniforms: Record<string, { value: unknown }> = {
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
      uMouseEnabled: { value: mouseInteraction ? 1.0 : 0.0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
      uIsLightMode: { value: theme === 'light' ? 1.0 : 0.0 }
    };
    uniformsRef.current = uniforms;

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      if (!container || !rendererRef.current) return;
      const rect = container.getBoundingClientRect();
      rendererRef.current.setSize(rect.width, rect.height);
      if (uniformsRef.current) {
        uniformsRef.current.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
      }
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
      if (mouseDampening <= 0 && uniformsRef.current) {
        uniformsRef.current.iMouse.value = [x, y];
      }
    };

    if (mouseInteraction) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!uniformsRef.current) return;
      uniformsRef.current.iTime.value = t * 0.001;

      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniformsRef.current.iMouse.value as number[];
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }

      if (!pausedRef.current && rendererRef.current && meshRef.current) {
        try {
          rendererRef.current.render({ scene: meshRef.current });
        } catch {
          // silently handle edge context teardowns
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
      uniformsRef.current = null;
    };
  }, [dpr, mouseInteraction, mouseDampening]);

  // Dynamically update uniforms when props change without destroying WebGL context
  useEffect(() => {
    if (!uniformsRef.current) return;
    const { arr, count, avg } = prepColors(colors);
    for (let i = 0; i < MAX_COLORS; i++) {
      (uniformsRef.current[`uColor${i}`] as { value: RGB }).value = arr[i];
    }
    (uniformsRef.current.uColorCount as { value: number }).value = count;
    (uniformsRef.current.uBgColor as { value: RGB }).value = hexToRGB(backgroundColor);
    (uniformsRef.current.uMouseColor as { value: RGB }).value = avg;
    (uniformsRef.current.uSpeed as { value: number }).value = speed;
    (uniformsRef.current.uStreakCount as { value: number }).value = Math.max(1, Math.min(16, Math.round(streakCount)));
    (uniformsRef.current.uStreakWidth as { value: number }).value = streakWidth;
    (uniformsRef.current.uStreakLength as { value: number }).value = streakLength;
    (uniformsRef.current.uGlow as { value: number }).value = glow;
    (uniformsRef.current.uDensity as { value: number }).value = density;
    (uniformsRef.current.uTwinkle as { value: number }).value = twinkle;
    (uniformsRef.current.uZoom as { value: number }).value = zoom;
    (uniformsRef.current.uBgGlow as { value: number }).value = backgroundGlow;
    (uniformsRef.current.uOpacity as { value: number }).value = opacity;
    (uniformsRef.current.uMouseEnabled as { value: number }).value = mouseInteraction ? 1.0 : 0.0;
    (uniformsRef.current.uMouseStrength as { value: number }).value = mouseStrength;
    (uniformsRef.current.uMouseRadius as { value: number }).value = mouseRadius;
    (uniformsRef.current.uIsLightMode as { value: number }).value = theme === 'light' ? 1.0 : 0.0;
  }, [
    colors,
    backgroundColor,
    theme,
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
    mouseRadius
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

// ── Styles ─────────────────────────────────────────────────────────
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
