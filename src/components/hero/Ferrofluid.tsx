"use client";
/* Ferrofluid — High-Performance Self-Contained WebGL Background.
   Black & White Theme for Panth Mistry Portfolio.
   Optimized for 60/120 FPS with fixed buffer clipping and zero GPU stalls. */

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export interface FerrofluidProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  colors?: string[];
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  flowDirection?: 'up' | 'down' | 'left' | 'right';
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  mixBlendMode?: string;
  fixedViewport?: boolean; // When true, renders at fixed viewport size for zero-lag expansion
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
      : ['#FFFFFF', '#FAF8F5', '#BAE6FD', '#38BDF8', '#2563EB', '#1D4ED8', '#1E3A8A', '#172554']
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

const flowVec = (d?: string): [number, number] => {
  switch (d) {
    case 'up':
      return [0, 1];
    case 'down':
      return [0, -1];
    case 'left':
      return [-1, 0];
    case 'right':
      return [1, 0];
    default:
      return [0, -1];
  }
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

uniform vec3  uMouseColor;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

varying vec2 vUv;

#define PI 3.14159265

vec3 getColor(int idx) {
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 palette(float h) {
  float count = float(uColorCount);
  if (count <= 1.0) return uColor0;
  float scaled = clamp(h, 0.0, 0.999999) * (count - 1.0);
  int idx0 = int(floor(scaled));
  int idx1 = idx0 + 1;
  if (idx1 >= uColorCount) idx1 = uColorCount - 1;
  float fractPart = scaled - float(idx0);
  return mix(getColor(idx0), getColor(idx1), smoothstep(0.0, 1.0, fractPart));
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = iTime;

  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);

  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }

  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn = clamp(ltn + mGlow * 0.4, 0.0, 1.5);

  float h = clamp(0.5 + (peaks - peaks2) * 1.35, 0.0, 1.0);
  vec3 col = palette(h);

  // Soft sky-blue and white gradient background
  vec3 bgBase = mix(vec3(0.975, 0.985, 1.0), vec3(0.915, 0.955, 0.995), vUv.y);

  // Liquid fluid crests: interpolate smoothly with luminous pure white highlights & royal dark blue depths
  vec3 fluidCol = mix(col, vec3(1.0, 1.0, 1.0), pow(clamp(ltn, 0.0, 1.0), 2.0) * 0.7);
  vec3 outc = mix(bgBase, fluidCol, clamp(ltn * 1.35, 0.0, 1.0));

  fragColor = vec4(outc, uOpacity);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

const Ferrofluid: React.FC<FerrofluidProps> = ({
  className,
  dpr,
  paused = false,
  colors = ['#FFFFFF', '#FAF8F5', '#F5EFE6', '#BAE6FD', '#7DD3FC', '#38BDF8', '#60A5FA', '#2563EB'],
  speed = 0.45,
  scale = 1.5,
  turbulence = 0.95,
  fluidity = 0.12,
  rimWidth = 0.2,
  sharpness = 2.8,
  shimmer = 1.6,
  glow = 2.2,
  flowDirection = 'down',
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1.1,
  mouseRadius = 0.35,
  mouseDampening = 0.15,
  mixBlendMode,
  fixedViewport = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseTargetRef = useRef<[number, number]>([0, 0]);
  const lastTimeRef = useRef(0);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const colorsKey = (colors || []).join(',');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cap DPR to 1.25 for peak performance with zero visible loss on dark backgrounds
    const effectiveDpr = dpr ?? (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.25) : 1);

    const renderer = new Renderer({
      dpr: effectiveDpr,
      alpha: true,
      antialias: false, // Disabling MSAA on full-screen fragment shaders saves significant fill-rate
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    gl.clearColor(0, 0, 0, 0);

    if (fixedViewport) {
      // Sized to fixed full viewport window to avoid ANY buffer reallocations during scroll expansion
      canvas.style.position = 'absolute';
      canvas.style.top = '50%';
      canvas.style.left = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.minWidth = '100%';
      canvas.style.minHeight = '100%';
    } else {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }

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
      uMouseColor: { value: avg },
      uFlow: { value: flowVec(flowDirection) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uTurbulence: { value: turbulence },
      uFluidity: { value: fluidity },
      uRimWidth: { value: rimWidth },
      uSharpness: { value: sharpness },
      uShimmer: { value: shimmer },
      uGlow: { value: glow },
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

    const handleResize = () => {
      const width = fixedViewport ? window.innerWidth : container.clientWidth;
      const height = fixedViewport ? window.innerHeight : container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    handleResize();

    // ONLY listen to browser window resize — NOT container expansion!
    // This completely eliminates WebGL buffer reallocations during scrolling!
    window.addEventListener('resize', handleResize);

    const onPointerMove = (e: PointerEvent) => {
      const sc = renderer.dpr || 1;
      let x: number, y: number;

      if (fixedViewport) {
        x = e.clientX * sc;
        y = (window.innerHeight - e.clientY) * sc;
      } else {
        const rect = canvas.getBoundingClientRect();
        x = (e.clientX - rect.left) * sc;
        y = (rect.height - (e.clientY - rect.top)) * sc;
      }

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
      if (!pausedRef.current && programRef.current && meshRef.current) {
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
      window.removeEventListener('resize', handleResize);
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
    colorsKey,
    speed,
    scale,
    turbulence,
    fluidity,
    rimWidth,
    sharpness,
    shimmer,
    glow,
    flowDirection,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    mouseDampening,
    fixedViewport,
  ]);

  return (
    <div
      ref={containerRef}
      className={`ferrofluid-container ${className ?? ''}`}
      style={{
        ...(mixBlendMode && { mixBlendMode: mixBlendMode as React.CSSProperties['mixBlendMode'] })
      }}
    />
  );
};

export default Ferrofluid;

// Styles auto-applied
const __KX_CSS = `
.ferrofluid-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
`;
if (typeof document !== "undefined" && !document.getElementById("kx-bg-ferrofluid")) {
  const __kxStyle = document.createElement("style");
  __kxStyle.id = "kx-bg-ferrofluid";
  __kxStyle.textContent = __KX_CSS;
  document.head.appendChild(__kxStyle);
}
