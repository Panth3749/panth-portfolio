"use client";
/* Lightfall — High-Performance Ultra-Smooth WebGL Background.
   Optimized for Panth Mistry Portfolio (Blue, Sky Blue & White Theme).
   Features hardware standard derivatives (dFdx/dFdy), smooth palette interpolation,
   and zero buffer reallocations for silky 60/120 FPS performance. */

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
  themeMode?: 'light' | 'dark';
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
      : ['#FFFFFF', '#BAE6FD', '#7DD3FC', '#38BDF8', '#60A5FA', '#2563EB', '#1D4ED8', '#1E3A8A']
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
#extension GL_OES_standard_derivatives : enable
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
uniform float uLightMode;

varying vec2 vUv;

// Smooth Hermite color palette interpolation for ultra-high quality gradients
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

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

// Optimized 4D raymarcher: 16 fast steps with early exit
vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 16; k++) {
    if (d <= 3e-4) break;
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

  // Single raymarch pass instead of 3 redundant passes!
  vec2 c0 = sceneC(C, r);

  // Hardware standard derivatives: instant 1-cycle GPU screen differential
  #if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
    vec2 dCx = dFdx(c0);
    vec2 dCy = dFdy(c0);
    dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
    dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
    vec2 fw = abs(dCx) + abs(dCy);
  #else
    vec2 fw = vec2(0.0025, 0.0025);
  #endif
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 12; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.4, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 2.8)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.02, 0.04, 0.01), 0.0)));

  // Light theme: transparent alpha for smooth compositing on light blue gradients
  float streakLum = clamp(length(colr) * 1.7, 0.0, 1.0);
  vec4 darkOut = vec4(colr, uOpacity);
  vec4 lightOut = vec4(colr, streakLum * uOpacity);

  o = mix(darkOut, lightOut, uLightMode);
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

export const Lightfall: React.FC<LightfallProps> = ({
  className,
  dpr,
  paused = false,
  colors = ['#FFFFFF', '#BAE6FD', '#7DD3FC', '#38BDF8', '#60A5FA', '#2563EB', '#1D4ED8', '#1E3A8A'],
  backgroundColor = '#38BDF8',
  speed = 0.35,
  streakCount = 4,
  streakWidth = 1.2,
  streakLength = 1.4,
  glow = 1.25,
  density = 0.5,
  twinkle = 0.8,
  zoom = 2.8,
  backgroundGlow = 0.2,
  opacity = 0.88,
  mouseInteraction = true,
  mouseStrength = 0.6,
  mouseRadius = 1.2,
  mouseDampening = 0.15,
  mixBlendMode,
  themeMode = 'light'
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

    // Cap DPR at 1.0 or 1.25 for peak 60/120 FPS smoothness on Retina/4K screens
    const effectiveDpr = dpr ?? (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.2) : 1);

    const renderer = new Renderer({
      dpr: effectiveDpr,
      alpha: true,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;

    // Enable standard derivatives extension for 1-cycle GPU dFdx/dFdy
    gl.getExtension('OES_standard_derivatives');

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
      uStreakCount: { value: Math.max(1, Math.min(12, Math.round(streakCount))) },
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
      uMouseRadius: { value: mouseRadius },
      uLightMode: { value: themeMode === 'light' ? 1.0 : 0.0 }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    // ONLY resize on browser window resize (prevents scroll buffer reallocations)
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const onPointerMove = (e: PointerEvent) => {
      const sc = renderer.dpr || 1;
      const x = e.clientX * sc;
      const y = (window.innerHeight - e.clientY) * sc;
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
    mouseDampening,
    themeMode
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

export default Lightfall;

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
