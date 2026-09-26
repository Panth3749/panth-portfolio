import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, RotateCcw, Eye } from "lucide-react";

interface HeroInkMaskProps {
  containerRef: React.RefObject<HTMLElement | null>;
  scrollProgress: number;
}

type Point = {
  x: number;
  y: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

export const HeroInkMask: React.FC<HeroInkMaskProps> = ({
  containerRef,
  scrollProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushElementRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // References for spring physics & smooth interpolation
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    active: false,
    initialized: false,
  });

  const brushRef = useRef({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    radius: 72,
    targetRadius: 72,
    angle: 0,
    speed: 0,
  });

  const previousPointRef = useRef<Point | null>(null);
  const lastDropletTimeRef = useRef(0);
  const isRevealedRef = useRef(false);
  isRevealedRef.current = isRevealed;

  // Fill canvas with luxury architectural "Design Flex" cover and prominent Kraton "P&P Studio" title
  const fillCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    // 1. Deep architectural Obsidian-to-Sapphire-to-Cobalt radial background
    const gradient = ctx.createRadialGradient(
      cssWidth / 2,
      cssHeight / 2,
      30,
      cssWidth / 2,
      cssHeight / 2,
      Math.max(cssWidth, cssHeight) * 0.85
    );
    gradient.addColorStop(0, "#2563EB");    // Electric royal blue in core
    gradient.addColorStop(0.35, "#1D4ED8"); // Deep azure blue
    gradient.addColorStop(0.70, "#1E3A8A"); // Midnight sapphire
    gradient.addColorStop(1, "#071126");    // Deep obsidian navy at edges

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const isMobile = cssWidth < 768;
    const isCompactH = cssHeight < 720;
    const cx = cssWidth / 2;
    const cy = cssHeight / 2;

    // 2. Architectural Blueprint Grid & Subtle Dots
    ctx.save();
    const gridStep = isMobile ? 48 : 64;
    ctx.strokeStyle = "rgba(186, 230, 253, 0.055)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < cssWidth; x += gridStep) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssHeight);
    }
    for (let y = 0; y < cssHeight; y += gridStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(cssWidth, y);
    }
    ctx.stroke();

    // Precision Crosshairs at major grid intersections
    const crossStep = gridStep * 2;
    ctx.strokeStyle = "rgba(186, 230, 253, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const arm = 5;
    for (let x = crossStep; x < cssWidth; x += crossStep) {
      for (let y = crossStep; y < cssHeight; y += crossStep) {
        ctx.moveTo(x - arm, y);
        ctx.lineTo(x + arm, y);
        ctx.moveTo(x, y - arm);
        ctx.lineTo(x, y + arm);
      }
    }
    ctx.stroke();

    // Blueprint dot matrix in center of cells
    ctx.fillStyle = "rgba(186, 230, 253, 0.16)";
    for (let x = gridStep / 2; x < cssWidth; x += gridStep) {
      for (let y = gridStep / 2; y < cssHeight; y += gridStep) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 3. Millimeter Technical Rulers along edges
    ctx.save();
    ctx.strokeStyle = "rgba(186, 230, 253, 0.22)";
    ctx.fillStyle = "rgba(186, 230, 253, 0.40)";
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.lineWidth = 1;

    // Top & Bottom Rulers
    const tickInterval = 16;
    for (let x = 32; x < cssWidth - 32; x += tickInterval) {
      const isMajor = x % 96 === 0;
      const tickH = isMajor ? 8 : 4;
      // Top ticks
      ctx.beginPath();
      ctx.moveTo(x, 8);
      ctx.lineTo(x, 8 + tickH);
      ctx.stroke();

      // Bottom ticks
      ctx.beginPath();
      ctx.moveTo(x, cssHeight - 8);
      ctx.lineTo(x, cssHeight - 8 - tickH);
      ctx.stroke();

      if (isMajor && !isMobile && x < cssWidth - 120) {
        ctx.fillText(`${x}`, x - 8, 24);
        ctx.fillText(`${x}`, x - 8, cssHeight - 16);
      }
    }
    ctx.restore();

    // 4. Corner Registration Marks & Technical Metadata (Design Flex)
    ctx.save();
    const pad = isMobile ? 20 : 36;
    const bLen = isMobile ? 18 : 28;
    ctx.strokeStyle = "rgba(186, 230, 253, 0.65)";
    ctx.lineWidth = 1.5;

    // Top-Left L-Bracket
    ctx.beginPath();
    ctx.moveTo(pad, pad + bLen);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + bLen, pad);
    ctx.stroke();

    // Top-Right L-Bracket
    ctx.beginPath();
    ctx.moveTo(cssWidth - pad - bLen, pad);
    ctx.lineTo(cssWidth - pad, pad);
    ctx.lineTo(cssWidth - pad, pad + bLen);
    ctx.stroke();

    // Bottom-Left L-Bracket
    ctx.beginPath();
    ctx.moveTo(pad, cssHeight - pad - bLen);
    ctx.lineTo(pad, cssHeight - pad);
    ctx.lineTo(pad + bLen, cssHeight - pad);
    ctx.stroke();

    // Bottom-Right L-Bracket
    ctx.beginPath();
    ctx.moveTo(cssWidth - pad - bLen, cssHeight - pad);
    ctx.lineTo(cssWidth - pad, cssHeight - pad);
    ctx.lineTo(cssWidth - pad, cssHeight - pad - bLen);
    ctx.stroke();

    // Metadata Typography
    ctx.fillStyle = "rgba(186, 230, 253, 0.85)";
    ctx.font = `600 10px "JetBrains Mono", monospace`;
    ctx.letterSpacing = "0.14em";

    // Top-Left Studio Info
    if (!isMobile) {
      ctx.textAlign = "left";
      ctx.fillText("P&P // ARCHITECTURAL LABS", pad + 8, pad + 16);
      ctx.fillStyle = "rgba(186, 230, 253, 0.55)";
      ctx.font = `500 9px "JetBrains Mono", monospace`;
      ctx.fillText("ENGINE: 120 FPS WEBGL FERROFLUID MASK", pad + 8, pad + 30);
      ctx.fillText("COORD: 22.3072° N · 73.1812° E [BARODA / IN]", pad + 8, pad + 44);

      // Bottom-Left Specs
      ctx.fillStyle = "rgba(186, 230, 253, 0.85)";
      ctx.font = `600 10px "JetBrains Mono", monospace`;
      ctx.fillText("DISCIPLINE // AI ARCHITECTURE & CREATIVE DEV", pad + 8, cssHeight - pad - 36);
      ctx.fillStyle = "rgba(186, 230, 253, 0.55)";
      ctx.font = `500 9px "JetBrains Mono", monospace`;
      ctx.fillText("STACK: THREE.JS · GLSL SHADERS · MACHINE LEARNING", pad + 8, cssHeight - pad - 22);
      ctx.fillText("INTERACTION: DRAG BRUSH TO PEEL COVER ↓", pad + 8, cssHeight - pad - 8);

      // Bottom-Right Spec
      ctx.textAlign = "right";
      ctx.fillStyle = "#7DD3FC";
      ctx.font = `700 18px "JetBrains Mono", monospace`;
      ctx.fillText("01 // STAGE", cssWidth - pad - 8, cssHeight - pad - 28);
      ctx.fillStyle = "rgba(186, 230, 253, 0.55)";
      ctx.font = `500 9px "JetBrains Mono", monospace`;
      ctx.fillText(`CANVAS: ${Math.round(cssWidth)} × ${Math.round(cssHeight)} PX · STATUS: LIVE ●`, cssWidth - pad - 8, cssHeight - pad - 12);
    }
    ctx.restore();

    // 5. Central Astrolabe / Celestial Orbit Geometric Graphics
    ctx.save();
    const maxR = Math.min(cssWidth, cssHeight);
    const rOuter = maxR * (isMobile ? 0.44 : isCompactH ? 0.35 : 0.38);
    const rMid = maxR * (isMobile ? 0.34 : isCompactH ? 0.26 : 0.28);
    const rInner = maxR * (isMobile ? 0.24 : isCompactH ? 0.17 : 0.18);

    // Outer Dashed Orbit Ring with cardinal degree ticks
    ctx.strokeStyle = "rgba(186, 230, 253, 0.22)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cardinal Degree Notches & Labels
    const cardinals = [
      { deg: "000°", angle: 0 },
      { deg: "090°", angle: Math.PI / 2 },
      { deg: "180°", angle: Math.PI },
      { deg: "270°", angle: (3 * Math.PI) / 2 },
    ];
    ctx.fillStyle = "rgba(186, 230, 253, 0.45)";
    ctx.font = `9px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const c of cardinals) {
      const nx = cx + Math.cos(c.angle) * (rOuter + 14);
      const ny = cy + Math.sin(c.angle) * (rOuter + 14);
      ctx.fillText(c.deg, nx, ny);

      // Notch mark
      ctx.strokeStyle = "rgba(186, 230, 253, 0.5)";
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(c.angle) * (rOuter - 6), cy + Math.sin(c.angle) * (rOuter - 6));
      ctx.lineTo(cx + Math.cos(c.angle) * (rOuter + 6), cy + Math.sin(c.angle) * (rOuter + 6));
      ctx.stroke();
    }

    // Mid Gyroscopic Orbit Ring with 12 subtle millimeter ticks
    ctx.strokeStyle = "rgba(125, 211, 252, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, rMid, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (rMid - 4), cy + Math.sin(a) * (rMid - 4));
      ctx.lineTo(cx + Math.cos(a) * (rMid + 4), cy + Math.sin(a) * (rMid + 4));
      ctx.stroke();
    }

    // Inner Concentric Hexagon / Octagon Wireframe
    ctx.strokeStyle = "rgba(186, 230, 253, 0.14)";
    ctx.beginPath();
    const sides = 8;
    for (let i = 0; i <= sides; i++) {
      const a = (i * 2 * Math.PI) / sides + Math.PI / 8;
      const px = cx + Math.cos(a) * rInner;
      const py = cy + Math.sin(a) * rInner;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Subtle Radial Hairline Crosshairs extending from outer ring
    const hGap = isMobile ? 140 : 260;
    const vGap = isMobile ? 80 : 120;
    ctx.strokeStyle = "rgba(186, 230, 253, 0.18)";
    ctx.lineWidth = 1;
    // Left & Right horizontal hair-lines
    ctx.beginPath();
    ctx.moveTo(cx - rOuter - 60, cy);
    ctx.lineTo(cx - hGap, cy);
    ctx.moveTo(cx + hGap, cy);
    ctx.lineTo(cx + rOuter + 60, cy);
    // Top & Bottom vertical hair-lines
    ctx.moveTo(cx, cy - rOuter - 40);
    ctx.lineTo(cx, cy - vGap);
    ctx.moveTo(cx, cy + vGap);
    ctx.lineTo(cx, cy + rOuter + 40);
    ctx.stroke();

    // Glowing Celestial Neural Constellation Nodes around orbits
    const starAngles = [0.35, 1.15, 2.1, 2.9, 3.75, 4.4, 5.2, 5.9];
    for (const a of starAngles) {
      const rad = rMid + (Math.sin(a * 4) * 28);
      const sx = cx + Math.cos(a) * rad;
      const sy = cy + Math.sin(a) * rad;

      // Glow halo
      ctx.fillStyle = "rgba(56, 189, 248, 0.28)";
      ctx.beginPath();
      ctx.arc(sx, sy, 7, 0, Math.PI * 2);
      ctx.fill();

      // Sharp ring
      ctx.strokeStyle = "rgba(186, 230, 253, 0.85)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // White core dot
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 6. MAIN TYPOGRAPHY LOCKUP (P&P Studio in Kraton font)
    ctx.save();
    // A. Decorative Top Eyebrow Badge with Flanking Rules
    const badgeFontSize = Math.round(clamp(Math.min(cssWidth * 0.012, cssHeight * 0.022), 10, 13));
    ctx.font = `600 ${badgeFontSize}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#BAE6FD"; // Luminous sky blue
    ctx.letterSpacing = "0.22em";
    const badgeY = cy - (isMobile ? 64 : isCompactH ? 72 : 96);

    // Flanking horizontal rules
    const ruleW = isMobile ? 32 : isCompactH ? 48 : 80;
    const badgeText = "✦   P & P   S T U D I O   ·   E S T .   2 0 2 6   ✦";
    const badgeMetrics = ctx.measureText(badgeText);
    const halfBadgeW = badgeMetrics.width / 2;

    ctx.strokeStyle = "rgba(186, 230, 253, 0.40)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - halfBadgeW - ruleW - 14, badgeY);
    ctx.lineTo(cx - halfBadgeW - 14, badgeY);
    ctx.moveTo(cx + halfBadgeW + 14, badgeY);
    ctx.lineTo(cx + halfBadgeW + ruleW + 14, badgeY);
    ctx.stroke();

    ctx.fillText(badgeText, cx, badgeY);

    // B. MAIN TITLE: "P&P Studio" in Kraton font with dual-layer bloom
    const titleFontSize = Math.round(clamp(Math.min(cssWidth * 0.095, cssHeight * 0.16), 46, 128));
    ctx.font = `normal ${titleFontSize}px "Kraton", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const titleY = cy - (isMobile ? 12 : isCompactH ? 14 : 20);

    // Pass 1: Luminous cyan atmospheric glow
    ctx.shadowColor = "rgba(56, 189, 248, 0.65)";
    ctx.shadowBlur = 42;
    ctx.fillStyle = "rgba(240, 249, 255, 0.95)";
    ctx.fillText("P&P Studio", cx, titleY);

    // Pass 2: High-contrast crisp white foreground with drop shadow
    ctx.shadowColor = "rgba(7, 15, 35, 0.75)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("P&P Studio", cx, titleY);

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // C. Decorative Diamond Flourish under title
    const divY = cy + (isMobile ? 26 : isCompactH ? 32 : 44);
    ctx.strokeStyle = "rgba(186, 230, 253, 0.40)";
    ctx.lineWidth = 1;
    const divW = isMobile ? 50 : isCompactH ? 70 : 100;
    ctx.beginPath();
    ctx.moveTo(cx - divW, divY);
    ctx.lineTo(cx - 12, divY);
    ctx.moveTo(cx + 12, divY);
    ctx.lineTo(cx + divW, divY);
    ctx.stroke();

    // Central diamond
    ctx.fillStyle = "#7DD3FC";
    ctx.beginPath();
    ctx.moveTo(cx, divY - 4);
    ctx.lineTo(cx + 4, divY);
    ctx.lineTo(cx, divY + 4);
    ctx.lineTo(cx - 4, divY);
    ctx.closePath();
    ctx.fill();

    // D. Subtitle Pill Capsule: "Panth Mistry · UI Architect & AI Developer"
    const subFontSize = Math.round(clamp(Math.min(cssWidth * 0.013, cssHeight * 0.024), 11, 15));
    ctx.font = `600 ${subFontSize}px "JetBrains Mono", monospace`;
    ctx.letterSpacing = "0.12em";
    const subText = "PANTH MISTRY  ·  UI ARCHITECT & AI DEVELOPER";
    const subMetrics = ctx.measureText(subText);
    const subY = cy + (isMobile ? 58 : isCompactH ? 66 : 84);
    const pillPadX = 20;
    const pillH = subFontSize + 14;

    // Translucent dark-glass pill background
    ctx.fillStyle = "rgba(7, 18, 42, 0.60)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(cx - subMetrics.width / 2 - pillPadX, subY - pillH / 2, subMetrics.width + pillPadX * 2, pillH, pillH / 2);
    } else {
      ctx.rect(cx - subMetrics.width / 2 - pillPadX, subY - pillH / 2, subMetrics.width + pillPadX * 2, pillH);
    }
    ctx.fill();

    // Subtle cyan pill border
    ctx.strokeStyle = "rgba(186, 230, 253, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Subtitle text
    ctx.fillStyle = "#E0F2FE";
    ctx.fillText(subText, cx, subY);

    // E. Interactive Instruction Pill Chip
    const hintFontSize = Math.round(clamp(Math.min(cssWidth * 0.011, cssHeight * 0.02), 9, 12));
    ctx.font = `500 ${hintFontSize}px "JetBrains Mono", monospace`;
    ctx.letterSpacing = "0.10em";
    ctx.fillStyle = "rgba(224, 242, 254, 0.85)";
    const hintY = cy + (isMobile ? 96 : isCompactH ? 104 : 132);
    ctx.fillText("✨ MOVE CURSOR TO ERASE WITH INK  ·  SCROLL TO EXPAND ↓", cx, hintY);

    ctx.restore();
    setIsRevealed(false);
    setUserInteracted(false);
  }, []);

  // Organic liquid brush stamp that cuts through the beige cover
  const drawOrganicStamp = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      angle: number,
      speed: number
    ) => {
      const speedRatio = clamp(speed / 38, 0, 1);
      const horizontalStretch = 1 + speedRatio * 0.52;
      const verticalStretch = 1 - speedRatio * 0.16;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Central stamp ellipse
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        radius * horizontalStretch,
        radius * verticalStretch,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Fluid outer edge lobes for natural paint feel
      const lobeCount = 4 + Math.floor(Math.random() * 3);
      for (let index = 0; index < lobeCount; index += 1) {
        const lobeAngle =
          (index / lobeCount) * Math.PI * 2 + Math.random() * 0.7;
        const lobeDistance = radius * (0.52 + Math.random() * 0.4);
        const lobeRadius = radius * (0.18 + Math.random() * 0.22);

        ctx.beginPath();
        ctx.arc(
          Math.cos(lobeAngle) * lobeDistance,
          Math.sin(lobeAngle) * lobeDistance,
          lobeRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
    },
    []
  );

  const drawSmallDroplet = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    []
  );

  const paintBetween = useCallback(
    (ctx: CanvasRenderingContext2D, from: Point, to: Point) => {
      const deltaX = to.x - from.x;
      const deltaY = to.y - from.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 0.4) return;

      const brush = brushRef.current;
      const spacing = Math.max(3, brush.radius * 0.12);
      const steps = Math.max(1, Math.ceil(distance / spacing));
      const angle = Math.atan2(deltaY, deltaX);

      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        const x = lerp(from.x, to.x, progress);
        const y = lerp(from.y, to.y, progress);

        const radiusVariation =
          0.94 +
          Math.sin(x * 0.02 + y * 0.015) * 0.035 +
          Math.random() * 0.04;

        drawOrganicStamp(
          ctx,
          x,
          y,
          brush.radius * radiusVariation,
          angle,
          brush.speed
        );
      }

      // Splashing droplets on high velocity
      const now = performance.now();
      if (
        brush.speed > 10 &&
        now - lastDropletTimeRef.current > 65 &&
        Math.random() > 0.45
      ) {
        lastDropletTimeRef.current = now;
        const side = Math.random() > 0.5 ? 1 : -1;
        const perpendicularAngle = angle + (side * Math.PI) / 2;
        const distanceFromStroke =
          brush.radius * (1.15 + Math.random() * 1.3);

        drawSmallDroplet(
          ctx,
          to.x + Math.cos(perpendicularAngle) * distanceFromStroke,
          to.y + Math.sin(perpendicularAngle) * distanceFromStroke,
          brush.radius * (0.06 + Math.random() * 0.12)
        );
      }
    },
    [drawOrganicStamp, drawSmallDroplet]
  );

  // Setup Canvas & Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let rafId = 0;
    let dpr = 1;

    let cachedW = window.innerWidth;
    let cachedH = window.innerHeight;
    let cachedBaseRadius = clamp(Math.min(cachedW, cachedH) * 0.075, 55, 95);

    const handleResize = () => {
      // The hero cover strictly spans the visible 100vh viewport
      const w = Math.max(320, window.innerWidth);
      const h = Math.max(320, window.innerHeight);
      cachedW = w;
      cachedH = h;
      cachedBaseRadius = clamp(Math.min(w, h) * 0.075, 50, 90);

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fillCover();
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    let fontTimer1: ReturnType<typeof setTimeout> | undefined;
    let fontTimer2: ReturnType<typeof setTimeout> | undefined;
    let fontTimer3: ReturnType<typeof setTimeout> | undefined;

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load('80px "Kraton"').then(() => {
        if (!isRevealedRef.current) fillCover();
      }).catch(() => {
        if (!isRevealedRef.current) fillCover();
      });
      document.fonts.ready.then(() => {
        if (!isRevealedRef.current) fillCover();
      });
    }

    fontTimer1 = setTimeout(() => {
      if (!isRevealedRef.current) fillCover();
    }, 120);
    fontTimer2 = setTimeout(() => {
      if (!isRevealedRef.current) fillCover();
    }, 400);
    fontTimer3 = setTimeout(() => {
      if (!isRevealedRef.current) fillCover();
    }, 1000);

    // Pointer move listener on the hero container
    const handlePointerMove = (e: PointerEvent) => {
      if (isRevealedRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      pointerRef.current.targetX = clientX;
      pointerRef.current.targetY = clientY;
      pointerRef.current.active = true;

      if (!pointerRef.current.initialized) {
        pointerRef.current.initialized = true;
        brushRef.current.x = clientX;
        brushRef.current.y = clientY;
      }

      setUserInteracted(true);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isRevealedRef.current) return;
      handlePointerMove(e);

      // Instant splash on click
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const splashRadius = clamp(Math.min(cachedW, cachedH) * 0.08, 60, 110);
      drawOrganicStamp(ctx, clientX, clientY, splashRadius, Math.random() * Math.PI, 15);
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      previousPointRef.current = null;
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerdown", handlePointerDown, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // Main animation loop for natural spring brush & drawing
    const tick = () => {
      if (isRevealedRef.current || scrollProgress > 0.3) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const pointer = pointerRef.current;
      const brush = brushRef.current;

      if (pointer.initialized) {
        const deltaX = pointer.targetX - brush.x;
        const deltaY = pointer.targetY - brush.y;

        const spring = 0.125;
        const damping = 0.68;

        brush.velocityX += deltaX * spring;
        brush.velocityY += deltaY * spring;
        brush.velocityX *= damping;
        brush.velocityY *= damping;

        brush.x += brush.velocityX;
        brush.y += brush.velocityY;

        brush.speed = Math.hypot(brush.velocityX, brush.velocityY);
        if (brush.speed > 0.05) {
          brush.angle = Math.atan2(brush.velocityY, brush.velocityX);
        }

        const baseRadius = cachedBaseRadius;
        brush.targetRadius = clamp(
          baseRadius - brush.speed * 1.1,
          baseRadius * 0.6,
          baseRadius * 1.1
        );
        brush.radius = lerp(brush.radius, brush.targetRadius, 0.12);

        // Update custom cursor element style
        if (brushElementRef.current) {
          const speedStretch = clamp(1 + brush.speed * 0.016, 1, 1.45);
          brushElementRef.current.style.transform = `translate3d(${brush.x}px, ${brush.y}px, 0) rotate(${brush.angle}rad) scale(${speedStretch}, ${2 - speedStretch})`;
          brushElementRef.current.style.opacity = pointer.active ? "1" : "0";
        }

        // Paint onto canvas
        if (pointer.active) {
          const currentPoint: Point = { x: brush.x, y: brush.y };

          if (!previousPointRef.current) {
            drawOrganicStamp(
              ctx,
              brush.x,
              brush.y,
              brush.radius,
              brush.angle,
              brush.speed
            );
            previousPointRef.current = currentPoint;
          } else {
            paintBetween(ctx, previousPointRef.current, currentPoint);
            previousPointRef.current = currentPoint;
          }
        } else {
          previousPointRef.current = null;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (fontTimer1) clearTimeout(fontTimer1);
      if (fontTimer2) clearTimeout(fontTimer2);
      if (fontTimer3) clearTimeout(fontTimer3);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [containerRef, drawOrganicStamp, fillCover, paintBetween]);

  // Handle Reveal All
  const handleRevealAll = () => {
    setIsRevealed(true);
  };

  // Smooth fade only when intentionally scrolling down to expand
  const autoFadeFromScroll =
    scrollProgress < 0.05 ? 1 : Math.max(0, 1 - (scrollProgress - 0.05) * 4);
  const opacity = isRevealed ? 0 : autoFadeFromScroll;
  const pointerEvents = isRevealed || scrollProgress > 0.08 ? "none" : "auto";

  return (
    <div
      className="absolute inset-0 z-40 transition-opacity duration-700 ease-out"
      style={{
        opacity,
        pointerEvents: "none", // Allows pointer to reach hero while tracking on container
      }}
    >
      {/* Scratch Reveal Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />

      {/* Dynamic Spring Brush Cursor Indicator (Luminous White on Blue) */}
      <div
        ref={brushElementRef}
        className="pointer-events-none absolute -top-8 -left-8 w-16 h-16 rounded-full border border-white/80 transition-opacity duration-200"
        style={{
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.7), inset 0 0 10px rgba(186, 230, 253, 0.5)",
          willChange: "transform, opacity",
        }}
      >
        <div className="absolute inset-2 rounded-full border border-dashed border-white/80 animate-spin" style={{ animationDuration: "8s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md shadow-white" />
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2.5 pointer-events-auto">
        <button
          type="button"
          onClick={fillCover}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-semibold text-white shadow-md shadow-black/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Reset ink cover and redraw P&P Studio"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-200" />
          <span>Reset Ink ✣</span>
        </button>

        <button
          type="button"
          onClick={handleRevealAll}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-blue-900 text-xs font-bold shadow-md shadow-black/15 hover:bg-sky-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Reveal the full hero section"
        >
          <Eye className="w-3.5 h-3.5 text-blue-700" />
          <span>Reveal All ✦</span>
        </button>
      </div>
    </div>
  );
};
