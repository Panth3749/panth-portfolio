export interface ShardFallbackOptions {
  backgroundColor?: string;
  shardColor?: string;
  accentColor?: string;
  speed?: number;
  scale?: number;
  density?: number;
  shardSize?: number;
  spin?: number;
  turbulence?: number;
  interactionRadius?: number;
}

interface Shard {
  x: number;
  y: number;
  z: number; // Depth factor [0.15 .. 1.0]
  size: number;
  aspect: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  speedX: number;
  speedY: number;
  rgb: { r: number; g: number; b: number };
  opacity: number;
  shapeType: number; // 0 = diamond, 1 = triangle, 2 = crystalline blade, 3 = rhomboid
  phase: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export class ShardFallbackEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private options: Required<ShardFallbackOptions>;
  private shards: Shard[] = [];
  private pointer = { x: -2000, y: -2000, active: false, radius: 180 };
  private animId: number | null = null;
  private lastTime = 0;
  private running = false;
  private dpr = 1;
  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement, options: ShardFallbackOptions = {}) {
    this.canvas = canvas;
    this.options = {
      backgroundColor: options.backgroundColor || '#d5efff',
      shardColor: options.shardColor || '#3B82F6',
      accentColor: options.accentColor || '#6366F1',
      speed: options.speed ?? 0.4,
      scale: options.scale ?? 2.05,
      density: options.density ?? 1.5,
      shardSize: options.shardSize ?? 1.1,
      spin: options.spin ?? 1,
      turbulence: options.turbulence ?? 1,
      interactionRadius: options.interactionRadius ?? 1.35,
    };

    const ctx = canvas.getContext('2d', { alpha: false });
    this.ctx = ctx;
    this.init();
  }

  private init() {
    this.resize();
    this.createShards();
  }

  public resize() {
    const parent = this.canvas.parentElement;
    const w = parent?.clientWidth || this.canvas.clientWidth || window.innerWidth || 1440;
    const h = parent?.clientHeight || this.canvas.clientHeight || window.innerHeight || 900;
    this.dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.width = w;
    this.height = h;
  }

  public setPointer(x: number, y: number, active: boolean) {
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.active = active;
  }

  private createShards() {
    // Calibrate count for smooth 60-120fps performance on all mobile and desktop devices
    const isMobile = this.width < 768;
    const baseCount = isMobile ? 130 : 240;
    const count = Math.round(baseCount * (this.options.density || 1));
    this.shards = [];

    const shardRgb = hexToRgb(this.options.shardColor);
    const accentRgb = hexToRgb(this.options.accentColor);

    for (let i = 0; i < count; i++) {
      const isAccent = Math.random() < 0.38;
      const rgb = isAccent ? accentRgb : shardRgb;
      const sizeBase = (12 + Math.random() * 24) * this.options.shardSize;

      this.shards.push({
        x: Math.random() * Math.max(this.width, 320),
        y: Math.random() * Math.max(this.height, 320),
        z: 0.18 + Math.random() * 0.82,
        size: sizeBase,
        aspect: 0.38 + Math.random() * 0.72,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 1.8 * this.options.spin,
        vRotY: (Math.random() - 0.5) * 2.4 * this.options.spin,
        vRotZ: (Math.random() - 0.5) * 1.2 * this.options.spin,
        // Stream flows diagonally from top-right to bottom-left with natural variation
        speedX: (-0.35 - Math.random() * 0.75) * this.options.speed * 60,
        speedY: (0.25 + Math.random() * 0.65) * this.options.speed * 60,
        rgb,
        opacity: 0.45 + Math.random() * 0.45,
        shapeType: Math.floor(Math.random() * 4),
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();

    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.08);
      this.lastTime = now;
      this.update(dt, now / 1000);
      this.render();
      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  public stop() {
    this.running = false;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  private update(dt: number, time: number) {
    const { width, height } = this;
    const turb = this.options.turbulence;

    for (let i = 0; i < this.shards.length; i++) {
      const s = this.shards[i];

      // Stream motion with subtle fluid wave turbulence
      const wave = Math.sin(time * 0.7 + s.phase) * turb * 18 * s.z;
      s.x += (s.speedX + wave * 0.45) * dt * 1.6;
      s.y += (s.speedY + wave) * dt * 1.6;

      // 3D rotation
      s.rotX += s.vRotX * dt;
      s.rotY += s.vRotY * dt;
      s.rotZ += s.vRotZ * dt;

      // Pointer / touch repel interaction
      if (this.pointer.active) {
        const dx = s.x - this.pointer.x;
        const dy = s.y - this.pointer.y;
        const dist = Math.hypot(dx, dy);
        const radius = this.pointer.radius * this.options.interactionRadius;
        if (dist < radius && dist > 1) {
          const force = (1 - dist / radius) * 260 * dt;
          s.x += (dx / dist) * force;
          s.y += (dy / dist) * force;
        }
      }

      // Wrap around screen boundaries with margin
      const margin = 60;
      if (s.x < -margin) s.x = width + margin;
      if (s.x > width + margin) s.x = -margin;
      if (s.y < -margin) s.y = height + margin;
      if (s.y > height + margin) s.y = -margin;
    }
  }

  public render() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Clean background fill
    ctx.fillStyle = this.options.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Sort shards by depth z for accurate 3D layering
    const sorted = [...this.shards].sort((a, b) => a.z - b.z);

    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      ctx.save();
      ctx.translate(s.x, s.y);

      // 3D projection simulation: depth scaling + rotation cosines
      const cosY = Math.cos(s.rotY);
      const sinX = Math.sin(s.rotX);
      const scaleZ = s.z * (0.82 + 0.18 * Math.sin(s.rotZ));
      const widthScale = scaleZ * Math.abs(cosY);
      const heightScale = scaleZ * (0.55 + 0.45 * Math.abs(sinX));

      ctx.rotate(s.rotZ);
      ctx.scale(Math.max(0.07, widthScale), Math.max(0.07, heightScale));

      // Pearl light specular sheen based on surface normal orientation
      const lightFacing = Math.max(0, cosY * 0.72 + sinX * 0.68);
      const alpha = s.opacity * (0.45 + 0.55 * s.z);

      const sz = s.size;
      const grad = ctx.createLinearGradient(-sz, -sz, sz, sz);
      const { r, g, b } = s.rgb;

      // Pearl sheen highlight
      const rH = Math.min(255, Math.round(r + lightFacing * (255 - r) * 0.88));
      const gH = Math.min(255, Math.round(g + lightFacing * (255 - g) * 0.88));
      const bH = Math.min(255, Math.round(b + lightFacing * (255 - b) * 0.88));

      grad.addColorStop(0, `rgba(${rH}, ${gH}, ${bH}, ${alpha})`);
      grad.addColorStop(0.48, `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`);
      grad.addColorStop(1, `rgba(${Math.round(r * 0.62)}, ${Math.round(g * 0.62)}, ${Math.round(b * 0.82)}, ${alpha * 0.65})`);

      ctx.fillStyle = grad;
      ctx.beginPath();

      if (s.shapeType === 0) {
        // Diamond shard
        ctx.moveTo(0, -sz);
        ctx.lineTo(sz * s.aspect, 0);
        ctx.lineTo(0, sz);
        ctx.lineTo(-sz * s.aspect, 0);
      } else if (s.shapeType === 1) {
        // Triangular shard
        ctx.moveTo(0, -sz * 1.15);
        ctx.lineTo(sz * s.aspect * 1.1, sz * 0.85);
        ctx.lineTo(-sz * s.aspect * 0.9, sz * 0.75);
      } else if (s.shapeType === 2) {
        // Crystalline blade
        ctx.moveTo(0, -sz * 1.45);
        ctx.lineTo(sz * 0.45, -sz * 0.25);
        ctx.lineTo(sz * 0.18, sz * 1.25);
        ctx.lineTo(-sz * 0.45, sz * 0.2);
      } else {
        // Rhomboid facet
        ctx.moveTo(-sz * 0.4, -sz * 0.9);
        ctx.lineTo(sz * s.aspect * 1.2, -sz * 0.3);
        ctx.lineTo(sz * 0.35, sz * 0.95);
        ctx.lineTo(-sz * s.aspect * 1.0, sz * 0.35);
      }
      ctx.closePath();
      ctx.fill();

      // Soft crystalline edge gleam
      if (lightFacing > 0.35) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${(lightFacing - 0.35) * 0.75 * alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
