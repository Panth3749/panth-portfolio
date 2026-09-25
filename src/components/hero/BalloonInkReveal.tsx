"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ArrowDown, RotateCcw, Sparkles } from "lucide-react";
import { scrollTo } from "../../utils/smoothScroll";

const DISPLAY_WORD = "UI ARCHITECT";
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const FONT_FALLBACK_URL = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

type Point = {
  x: number;
  y: number;
};

type LetterRecord = {
  mesh: THREE.Mesh;
  baseX: number;
  baseY: number;
  baseZ: number;
  baseRotation: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function createWrinkleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const context = canvas.getContext("2d");
  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.fillStyle = "#808080";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const random = (minimum: number, maximum: number) =>
    minimum + Math.random() * (maximum - minimum);

  // Long vertical vinyl creases
  for (let index = 0; index < 520; index += 1) {
    const x = random(0, canvas.width);
    const y = random(-120, canvas.height);
    const length = random(18, 130);
    const bend = random(-18, 18);
    const bright = Math.random() > 0.48;

    context.beginPath();
    context.moveTo(x, y);

    context.bezierCurveTo(
      x + bend,
      y + length * 0.3,
      x - bend,
      y + length * 0.7,
      x + random(-5, 5),
      y + length
    );

    context.strokeStyle = bright
      ? `rgba(255,255,255,${random(0.04, 0.17)})`
      : `rgba(0,0,0,${random(0.035, 0.13)})`;

    context.lineWidth = random(0.6, 2.6);
    context.stroke();
  }

  // Smaller compressed wrinkles
  for (let index = 0; index < 680; index += 1) {
    const x = random(0, canvas.width);
    const y = random(0, canvas.height);
    const length = random(5, 34);

    context.beginPath();
    context.moveTo(x - length / 2, y);

    context.quadraticCurveTo(
      x,
      y + random(-6, 6),
      x + length / 2,
      y + random(-2, 2)
    );

    context.strokeStyle =
      Math.random() > 0.5
        ? `rgba(255,255,255,${random(0.025, 0.1)})`
        : `rgba(0,0,0,${random(0.02, 0.09)})`;

    context.lineWidth = random(0.4, 1.7);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.8, 1.8);
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export const BalloonInkReveal: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const rawRoot = rootRef.current;
    const rawOutputCanvas = outputCanvasRef.current;
    if (!rawRoot || !rawOutputCanvas) return;

    const rawOutputContext = rawOutputCanvas.getContext("2d");
    if (!rawOutputContext) return;

    const root: HTMLElement = rawRoot;
    const outputCanvas: HTMLCanvasElement = rawOutputCanvas;
    const outputContext: CanvasRenderingContext2D = rawOutputContext;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let animationFrameId = 0;

    let width = 1;
    let height = 1;
    let pixelRatio = 1;

    const inkCanvas = document.createElement("canvas");
    const rawInkContext = inkCanvas.getContext("2d");

    const textCompositeCanvas = document.createElement("canvas");
    const rawTextCompositeContext = textCompositeCanvas.getContext("2d");

    if (!rawInkContext || !rawTextCompositeContext) return;
    const inkContext: CanvasRenderingContext2D = rawInkContext;
    const textCompositeContext: CanvasRenderingContext2D = rawTextCompositeContext;

    /* ──────────────────────────────
       Three.js scene
    ────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0.2, 28);

    const roomEnvironment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = environmentTarget.texture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 4.8);
    mainLight.position.set(-8, 10, 13);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Sky blue directional fill light for lustrous azure reflections
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 2.8);
    fillLight.position.set(9, 1, 8);
    scene.add(fillLight);

    const lowerLight = new THREE.PointLight(0xffffff, 65, 28, 1.8);
    lowerLight.position.set(0, -7, 10);
    scene.add(lowerLight);

    const movingLight = new THREE.PointLight(0xbae6fd, 80, 24, 1.6);
    movingLight.position.set(0, 3, 10);
    scene.add(movingLight);

    const wrinkleTexture = createWrinkleTexture();

    // Pure pearl white inflated vinyl face with sky blue specular sheen
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xfafbfc),
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      sheen: 0.95,
      sheenColor: new THREE.Color(0x7dd3fc),
      sheenRoughness: 0.5,
      envMapIntensity: 1.45,
      bumpMap: wrinkleTexture,
      bumpScale: 0.12,
    });

    // Soft sky blue vinyl sides
    const sideMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xc7ddf8),
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.55,
      clearcoatRoughness: 0.28,
      envMapIntensity: 1.2,
      bumpMap: wrinkleTexture,
      bumpScale: 0.1,
    });

    const wordGroup = new THREE.Group();
    scene.add(wordGroup);

    const letters: LetterRecord[] = [];
    const geometries: TextGeometry[] = [];

    let unscaledWordWidth = 1;
    let unscaledWordHeight = 1;

    function fitWordToViewport() {
      if (letters.length === 0 || width <= 1 || height <= 1) {
        return;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const distance = camera.position.z - wordGroup.position.z;
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const visibleHeight = 2 * Math.tan(verticalFov / 2) * distance;
      const visibleWidth = visibleHeight * camera.aspect;

      const targetWidth = visibleWidth * (width < 700 ? 0.94 : 0.88);
      const targetHeight = visibleHeight * (width < 700 ? 0.32 : 0.42);

      const scale = Math.min(
        targetWidth / unscaledWordWidth,
        targetHeight / unscaledWordHeight
      );

      wordGroup.scale.setScalar(scale);
      wordGroup.position.y = width < 700 ? -0.15 : -0.4;
    }

    async function buildBalloonWord() {
      try {
        const loader = new FontLoader();
        let font;
        try {
          font = await loader.loadAsync(FONT_URL);
        } catch (e) {
          font = await loader.loadAsync(FONT_FALLBACK_URL);
        }

        if (disposed) return;

        const isMobile = width < 700;

        // Micro-rotations and playful offsets per letter
        const rotations = [-2.4, 1.8, 0, -1.2, 2.1, -1.5, 1.9, -1.3, 1.6, -1.7, 1.4, -1.2];
        const verticalOffsets = [0.12, -0.08, 0, 0.09, -0.12, 0.08, -0.05, 0.11, -0.08, 0.06, -0.07, 0.05];
        const depthOffsets = [0.35, 0.08, 0, 0.42, 0.15, 0.34, 0.04, 0.32, 0.12, 0.28, 0.08, 0.25];

        const letterWidths: number[] = [];
        const meshes: (THREE.Mesh | null)[] = [];

        for (let index = 0; index < DISPLAY_WORD.length; index += 1) {
          const letter = DISPLAY_WORD[index];

          if (letter === " ") {
            letterWidths.push(isMobile ? 1.4 : 2.2);
            meshes.push(null);
            continue;
          }

          const geometry = new TextGeometry(letter, {
            font,
            size: 4,
            depth: 1.5,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.62,
            bevelSize: 0.5,
            bevelOffset: 0,
            bevelSegments: 14,
          });

          geometry.computeBoundingBox();
          const bounds = geometry.boundingBox;
          if (!bounds) continue;

          const letterWidth = bounds.max.x - bounds.min.x;
          const letterHeight = bounds.max.y - bounds.min.y;

          geometry.translate(
            -(bounds.min.x + bounds.max.x) / 2,
            -(bounds.min.y + bounds.max.y) / 2,
            -0.75
          );

          geometry.computeVertexNormals();

          geometries.push(geometry);
          letterWidths.push(letterWidth);

          unscaledWordHeight = Math.max(unscaledWordHeight, letterHeight + 1.3);

          const mesh = new THREE.Mesh(geometry, [frontMaterial, sideMaterial]);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          mesh.rotation.z = THREE.MathUtils.degToRad(
            rotations[index % rotations.length] ?? 0
          );
          mesh.rotation.x = THREE.MathUtils.degToRad(
            index % 2 === 0 ? -2.4 : 2.2
          );
          mesh.rotation.y = THREE.MathUtils.degToRad(
            index % 2 === 0 ? -3 : 3
          );

          meshes.push(mesh);
          wordGroup.add(mesh);
        }

        const overlapGap = -0.14;
        const totalWidth =
          letterWidths.reduce((total, letterWidth) => total + letterWidth, 0) +
          overlapGap * Math.max(0, letterWidths.length - 1);

        unscaledWordWidth = totalWidth;
        let cursor = -totalWidth / 2;

        meshes.forEach((mesh, index) => {
          const letterWidth = letterWidths[index];
          if (!mesh) {
            cursor += letterWidth + overlapGap;
            return;
          }

          const baseX = cursor + letterWidth / 2;
          const baseY = verticalOffsets[index % verticalOffsets.length] ?? 0;
          const baseZ = depthOffsets[index % depthOffsets.length] ?? 0;

          mesh.position.set(baseX, baseY, baseZ);

          const record: LetterRecord = {
            mesh,
            baseX,
            baseY,
            baseZ,
            baseRotation: mesh.rotation.z,
          };

          letters.push(record);
          cursor += letterWidth + overlapGap;
        });

        fitWordToViewport();
        setIsReady(true);
      } catch (error) {
        console.error("Unable to load the 3D font:", error);
        setHasError(true);
      }
    }

    void buildBalloonWord();

    /* ──────────────────────────────
       Natural spring brush
    ────────────────────────────── */
    const pointer = {
      targetX: width / 2,
      targetY: height / 2,
      normalizedX: 0,
      normalizedY: 0,
      active: false,
      initialized: false,
    };

    const brush = {
      x: width / 2,
      y: height / 2,
      velocityX: 0,
      velocityY: 0,
      radius: 76,
      targetRadius: 76,
      angle: 0,
      speed: 0,
    };

    let previousPaintPoint: Point | null = null;
    let lastDropletTime = 0;

    // Ink color: Deep architectural royal blue (#1E3A8A / #1D4ED8)
    const INK_COLOR = "#1D4ED8";

    function clearCanvas(
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ) {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
    }

    function clearInk() {
      clearCanvas(inkCanvas, inkContext);
      previousPaintPoint = null;
    }

    function drawOrganicStamp(
      x: number,
      y: number,
      radius: number,
      angle: number,
      speed: number
    ) {
      const speedRatio = clamp(speed / 42, 0, 1);
      const horizontalStretch = 1 + speedRatio * 0.55;
      const verticalStretch = 1 - speedRatio * 0.18;

      inkContext.save();
      inkContext.translate(x, y);
      inkContext.rotate(angle);
      inkContext.fillStyle = INK_COLOR;

      inkContext.beginPath();
      inkContext.ellipse(
        0,
        0,
        radius * horizontalStretch,
        radius * verticalStretch,
        0,
        0,
        Math.PI * 2
      );
      inkContext.fill();

      // Organic liquid paint edge lobes
      const lobeCount = 4 + Math.floor(Math.random() * 3);
      for (let index = 0; index < lobeCount; index += 1) {
        const lobeAngle =
          (index / lobeCount) * Math.PI * 2 + Math.random() * 0.7;
        const lobeDistance = radius * (0.5 + Math.random() * 0.42);
        const lobeRadius = radius * (0.16 + Math.random() * 0.25);

        inkContext.beginPath();
        inkContext.arc(
          Math.cos(lobeAngle) * lobeDistance,
          Math.sin(lobeAngle) * lobeDistance,
          lobeRadius,
          0,
          Math.PI * 2
        );
        inkContext.fill();
      }

      inkContext.restore();
    }

    function drawSmallDroplet(x: number, y: number, radius: number) {
      inkContext.beginPath();
      inkContext.arc(x, y, radius, 0, Math.PI * 2);
      inkContext.fillStyle = INK_COLOR;
      inkContext.fill();
    }

    function paintBetween(from: Point, to: Point) {
      const deltaX = to.x - from.x;
      const deltaY = to.y - from.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 0.3) return;

      const spacing = Math.max(3, brush.radius * 0.11);
      const steps = Math.max(1, Math.ceil(distance / spacing));
      const angle = Math.atan2(deltaY, deltaX);

      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        const x = lerp(from.x, to.x, progress);
        const y = lerp(from.y, to.y, progress);

        const radiusVariation =
          0.94 +
          Math.sin(x * 0.018 + y * 0.012) * 0.035 +
          Math.random() * 0.035;

        drawOrganicStamp(
          x,
          y,
          brush.radius * radiusVariation,
          angle,
          brush.speed
        );
      }

      const now = performance.now();
      if (brush.speed > 11 && now - lastDropletTime > 70 && Math.random() > 0.46) {
        lastDropletTime = now;
        const side = Math.random() > 0.5 ? 1 : -1;
        const perpendicularAngle = angle + (side * Math.PI) / 2;
        const distanceFromStroke =
          brush.radius * (1.1 + Math.random() * 1.2);

        drawSmallDroplet(
          to.x + Math.cos(perpendicularAngle) * distanceFromStroke,
          to.y + Math.sin(perpendicularAngle) * distanceFromStroke,
          brush.radius * (0.05 + Math.random() * 0.12)
        );
      }
    }

    function createSplash(x: number, y: number) {
      const splashRadius = clamp(
        Math.min(width, height) * 0.095,
        64,
        125
      );

      drawOrganicStamp(x, y, splashRadius, Math.random() * Math.PI, 12);

      const amount = 30;
      for (let index = 0; index < amount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance =
          splashRadius * (0.65 + Math.pow(Math.random(), 0.55) * 2.8);
        const dropletRadius =
          splashRadius * (0.025 + Math.random() * 0.13);

        drawSmallDroplet(
          x + Math.cos(angle) * distance,
          y + Math.sin(angle) * distance,
          dropletRadius
        );
      }
    }

    function updateBrush() {
      if (!pointer.initialized) return;

      const deltaX = pointer.targetX - brush.x;
      const deltaY = pointer.targetY - brush.y;

      const springStrength = 0.115;
      const damping = 0.69;

      brush.velocityX += deltaX * springStrength;
      brush.velocityY += deltaY * springStrength;

      brush.velocityX *= damping;
      brush.velocityY *= damping;

      brush.x += brush.velocityX;
      brush.y += brush.velocityY;

      brush.speed = Math.hypot(brush.velocityX, brush.velocityY);

      if (brush.speed > 0.05) {
        brush.angle = Math.atan2(brush.velocityY, brush.velocityX);
      }

      const baseRadius = clamp(
        Math.min(width, height) * 0.076,
        54,
        108
      );

      brush.targetRadius = clamp(
        baseRadius - brush.speed * 1.25,
        baseRadius * 0.55,
        baseRadius * 1.05
      );

      brush.radius = lerp(brush.radius, brush.targetRadius, 0.12);

      if (pointer.active) {
        const nextPoint = { x: brush.x, y: brush.y };

        if (!previousPaintPoint) {
          drawOrganicStamp(
            brush.x,
            brush.y,
            brush.radius,
            brush.angle,
            brush.speed
          );
          previousPaintPoint = nextPoint;
        } else {
          paintBetween(previousPaintPoint, nextPoint);
          previousPaintPoint = nextPoint;
        }
      } else {
        previousPaintPoint = null;
      }

      const speedStretch = clamp(1 + brush.speed * 0.018, 1, 1.55);

      root.style.setProperty("--brush-x", `${brush.x}px`);
      root.style.setProperty("--brush-y", `${brush.y}px`);
      root.style.setProperty("--brush-angle", `${brush.angle}rad`);
      root.style.setProperty("--brush-stretch", `${speedStretch}`);
      root.style.setProperty("--brush-squash", `${2 - speedStretch}`);
      root.style.setProperty("--brush-opacity", pointer.active ? "1" : "0");
    }

    /* ──────────────────────────────
       Resize and composition
    ────────────────────────────── */
    function resize() {
      const bounds = root.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const pixelWidth = Math.round(width * pixelRatio);
      const pixelHeight = Math.round(height * pixelRatio);

      outputCanvas.width = pixelWidth;
      outputCanvas.height = pixelHeight;
      outputCanvas.style.width = `${width}px`;
      outputCanvas.style.height = `${height}px`;

      inkCanvas.width = pixelWidth;
      inkCanvas.height = pixelHeight;

      textCompositeCanvas.width = pixelWidth;
      textCompositeCanvas.height = pixelHeight;

      inkContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);

      fitWordToViewport();
      clearInk();

      pointer.targetX = width / 2;
      pointer.targetY = height / 2;
      brush.x = pointer.targetX;
      brush.y = pointer.targetY;
      brush.velocityX = 0;
      brush.velocityY = 0;
    }

    function animateThreeScene(elapsed: number) {
      const pointerX = pointer.normalizedX;
      const pointerY = pointer.normalizedY;

      const targetRotationY = pointerX * 0.13;
      const targetRotationX = -pointerY * 0.075;

      wordGroup.rotation.y = lerp(
        wordGroup.rotation.y,
        targetRotationY,
        0.055
      );
      wordGroup.rotation.x = lerp(
        wordGroup.rotation.x,
        targetRotationX,
        0.055
      );

      letters.forEach((letter, index) => {
        const wave = reducedMotion
          ? 0
          : Math.sin(elapsed * (0.72 + index * 0.035) + index * 1.37);

        const secondaryWave = reducedMotion
          ? 0
          : Math.cos(elapsed * 0.5 + index * 1.8);

        letter.mesh.position.x =
          letter.baseX + pointerX * (0.05 + index * 0.008);
        letter.mesh.position.y = letter.baseY + wave * 0.075;
        letter.mesh.position.z = letter.baseZ + secondaryWave * 0.055;

        letter.mesh.rotation.z = letter.baseRotation + wave * 0.008;
        letter.mesh.rotation.y =
          THREE.MathUtils.degToRad(index % 2 === 0 ? -3 : 3) +
          pointerX * 0.035;
        letter.mesh.rotation.x =
          THREE.MathUtils.degToRad(index % 2 === 0 ? -2.4 : 2.2) -
          pointerY * 0.025;
      });

      movingLight.position.x = pointerX * 9;
      movingLight.position.y = -pointerY * 6 + 3;
      mainLight.position.x = -7 + pointerX * 4;
    }

    function composeFrame() {
      const pixelWidth = outputCanvas.width;
      const pixelHeight = outputCanvas.height;

      if (pixelWidth <= 0 || pixelHeight <= 0) return;

      renderer.render(scene, camera);

      textCompositeContext.setTransform(1, 0, 0, 1, 0, 0);
      textCompositeContext.globalCompositeOperation = "source-over";
      textCompositeContext.clearRect(0, 0, pixelWidth, pixelHeight);
      textCompositeContext.drawImage(
        renderer.domElement,
        0,
        0,
        pixelWidth,
        pixelHeight
      );

      // Only retain the 3D text where the ink paint exists
      textCompositeContext.globalCompositeOperation = "destination-in";
      textCompositeContext.drawImage(
        inkCanvas,
        0,
        0,
        pixelWidth,
        pixelHeight
      );

      textCompositeContext.globalCompositeOperation = "source-over";
      outputContext.setTransform(1, 0, 0, 1, 0, 0);
      outputContext.clearRect(0, 0, pixelWidth, pixelHeight);

      // Warm white / beige background of the page
      outputContext.fillStyle = "#FAF7F2";
      outputContext.fillRect(0, 0, pixelWidth, pixelHeight);

      // Draw the royal blue ink silhouette
      outputContext.drawImage(inkCanvas, 0, 0, pixelWidth, pixelHeight);

      // Draw the 3D typography on top
      outputContext.drawImage(
        textCompositeCanvas,
        0,
        0,
        pixelWidth,
        pixelHeight
      );
    }

    function renderFrame(timestamp: number) {
      if (disposed) return;

      updateBrush();
      animateThreeScene(timestamp * 0.001);
      composeFrame();

      animationFrameId = requestAnimationFrame(renderFrame);
    }

    /* ──────────────────────────────
       Pointer events
    ────────────────────────────── */
    function getLocalPoint(event: PointerEvent) {
      const bounds = root.getBoundingClientRect();
      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
    }

    function isInterfaceElement(target: EventTarget | null) {
      return (
        target instanceof Element &&
        Boolean(target.closest("[data-interface-control]"))
      );
    }

    function handlePointerEnter(event: PointerEvent) {
      if (isInterfaceElement(event.target)) return;

      const point = getLocalPoint(event);
      pointer.targetX = point.x;
      pointer.targetY = point.y;
      pointer.active = true;

      if (!pointer.initialized) {
        pointer.initialized = true;
        brush.x = point.x;
        brush.y = point.y;
        brush.velocityX = 0;
        brush.velocityY = 0;
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (isInterfaceElement(event.target)) {
        pointer.active = false;
        return;
      }

      const point = getLocalPoint(event);
      pointer.targetX = point.x;
      pointer.targetY = point.y;
      pointer.normalizedX = point.x / Math.max(width, 1) - 0.5;
      pointer.normalizedY = point.y / Math.max(height, 1) - 0.5;
      pointer.active = true;

      if (!pointer.initialized) {
        pointer.initialized = true;
        brush.x = point.x;
        brush.y = point.y;
      }
    }

    function handlePointerLeave() {
      pointer.active = false;
      root.style.setProperty("--brush-opacity", "0");
    }

    function handlePointerDown(event: PointerEvent) {
      if (isInterfaceElement(event.target)) return;

      const point = getLocalPoint(event);
      createSplash(point.x, point.y);
      root.style.setProperty("--brush-press", "0.72");
    }

    function handlePointerUp() {
      root.style.setProperty("--brush-press", "1");
    }

    function handleReset() {
      clearInk();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    root.addEventListener("pointerenter", handlePointerEnter);
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);
    root.addEventListener("pointerdown", handlePointerDown);
    root.addEventListener("pointerup", handlePointerUp);

    resetButtonRef.current?.addEventListener("click", handleReset);

    resize();
    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointerup", handlePointerUp);

      resetButtonRef.current?.removeEventListener("click", handleReset);

      geometries.forEach((geometry) => geometry.dispose());
      frontMaterial.dispose();
      sideMaterial.dispose();
      wrinkleTexture.dispose();
      environmentTarget.texture.dispose();
      pmremGenerator.dispose();
      roomEnvironment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      scene.clear();
    };
  }, []);

  const handleExploreClick = () => {
    scrollTo("#scroll-expand-hero", 0);
  };

  return (
    <section
      id="ink-reveal"
      ref={rootRef}
      className="balloon-ink relative w-full min-h-[100svh] overflow-hidden bg-[#FAF7F2] text-slate-900 select-none touch-pan-y"
    >
      <style>{`
        .balloon-ink {
          --brush-x: 50%;
          --brush-y: 50%;
          --brush-angle: 0rad;
          --brush-stretch: 1;
          --brush-squash: 1;
          --brush-opacity: 0;
          --brush-press: 1;
          cursor: crosshair;
        }

        .balloon-ink__canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: block;
          width: 100%;
          height: 100%;
        }

        .balloon-ink__interface {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
        }

        .balloon-ink__intro {
          position: absolute;
          top: 24px;
          left: 24px;
          width: min(420px, calc(100% - 48px));
        }

        .balloon-ink__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(186, 230, 253, 0.8);
          color: #1D4ED8;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
          backdrop-filter: blur(8px);
        }

        .balloon-ink__headline {
          margin: 12px 0 0 0;
          font-size: clamp(1.2rem, 2vw, 1.85rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.04em;
          color: #0f172a;
        }

        .balloon-ink__sub {
          margin: 8px 0 0 0;
          font-size: 13px;
          line-height: 1.5;
          color: #475569;
          font-weight: 400;
        }

        .balloon-ink__call {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
          padding: 0 8px 0 20px;
          border: 0;
          border-radius: 999px;
          background: #2563EB;
          color: #ffffff;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: auto;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.35);
          transition: transform 250ms ease, box-shadow 250ms ease, background 200ms ease;
        }

        .balloon-ink__call:hover {
          transform: translateY(-2px);
          background: #1D4ED8;
          box-shadow: 0 14px 30px -4px rgba(37, 99, 235, 0.45);
        }

        .balloon-ink__arrow {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border-radius: 50%;
          background: #ffffff;
          color: #2563EB;
          transition: transform 250ms ease;
        }

        .balloon-ink__call:hover .balloon-ink__arrow {
          transform: translateY(2px);
        }

        .balloon-ink__reset {
          position: absolute;
          top: 24px;
          right: 24px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(186, 230, 253, 0.8);
          color: #1D4ED8;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          pointer-events: auto;
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.08);
          backdrop-filter: blur(8px);
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
        }

        .balloon-ink__reset:hover {
          background: #ffffff;
          border-color: #38BDF8;
          transform: translateY(-1px);
        }

        .balloon-ink__footer-left,
        .balloon-ink__footer-center,
        .balloon-ink__footer-right {
          position: absolute;
          bottom: 24px;
          margin: 0;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .balloon-ink__footer-left {
          left: 24px;
          color: #334155;
          font-family: var(--font-mono, monospace);
        }

        .balloon-ink__footer-center {
          left: 50%;
          color: #1D4ED8;
          background: rgba(255, 255, 255, 0.85);
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(186, 230, 253, 0.7);
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transform: translateX(-50%);
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.06);
        }

        .balloon-ink__footer-right {
          right: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #334155;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          text-transform: uppercase;
        }

        .balloon-ink__brush {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 20;
          width: 82px;
          height: 82px;
          border: 1.5px solid rgba(37, 99, 235, 0.5);
          border-radius: 50%;
          opacity: var(--brush-opacity);
          pointer-events: none;
          transform: translate(calc(var(--brush-x) - 41px), calc(var(--brush-y) - 41px))
            rotate(var(--brush-angle))
            scaleX(calc(var(--brush-stretch) * var(--brush-press)))
            scaleY(calc(var(--brush-squash) * var(--brush-press)));
          transition: opacity 180ms ease;
          will-change: transform;
        }

        .balloon-ink__brush::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          content: "";
          background: #2563EB;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.6);
        }

        .balloon-ink__brush::after {
          position: absolute;
          inset: 8px;
          border: 1px dashed rgba(56, 189, 248, 0.6);
          border-radius: 50%;
          content: "";
          animation: balloon-brush-spin 8s linear infinite;
        }

        .balloon-ink__loading {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 8;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #2563EB;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(186, 230, 253, 0.8);
          padding: 8px 18px;
          border-radius: 999px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: none;
          transform: translate(-50%, -50%);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.1);
          backdrop-filter: blur(8px);
          transition: opacity 500ms ease, visibility 500ms ease;
        }

        .balloon-ink__loading::before {
          width: 10px;
          height: 10px;
          border: 2px solid #2563EB;
          border-top-color: transparent;
          border-radius: 50%;
          content: "";
          animation: balloon-loading-spin 0.8s linear infinite;
        }

        .balloon-ink__loading--hidden {
          opacity: 0;
          visibility: hidden;
        }

        .balloon-ink__error {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 8;
          width: min(380px, calc(100% - 40px));
          color: #0f172a;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(186, 230, 253, 0.8);
          padding: 16px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.6;
          text-align: center;
          transform: translate(-50%, -50%);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
        }

        @keyframes balloon-brush-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes balloon-loading-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .balloon-ink {
            cursor: auto;
          }

          .balloon-ink__intro {
            top: 18px;
            left: 18px;
          }

          .balloon-ink__headline {
            font-size: 1.25rem;
          }

          .balloon-ink__call {
            min-height: 42px;
            margin-top: 14px;
            padding-left: 16px;
            font-size: 10px;
          }

          .balloon-ink__arrow {
            width: 28px;
            height: 28px;
          }

          .balloon-ink__reset {
            top: 18px;
            right: 18px;
            padding: 6px 12px;
            font-size: 10px;
          }

          .balloon-ink__brush {
            display: none;
          }

          .balloon-ink__footer-center {
            display: none;
          }

          .balloon-ink__footer-left {
            left: 18px;
            bottom: 18px;
          }

          .balloon-ink__footer-right {
            right: 18px;
            bottom: 18px;
          }
        }
      `}</style>

      <canvas
        ref={outputCanvasRef}
        className="balloon-ink__canvas"
        aria-label="Interactive ink reveal with inflated 3D UI ARCHITECT lettering"
      />

      <div className="balloon-ink__interface">
        <header className="balloon-ink__intro">
          <div className="balloon-ink__badge">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Ink Reveal</span>
          </div>

          <h1 className="balloon-ink__headline">
            Move cursor to paint &amp; reveal.
            <br />
            Motion is everything.
          </h1>

          <p className="balloon-ink__sub">
            Panth Mistry · UI Architect &amp; AI Developer.
          </p>

          <button
            type="button"
            data-interface-control
            onClick={handleExploreClick}
            className="balloon-ink__call"
          >
            Explore UI Architecture
            <span className="balloon-ink__arrow">
              <ArrowDown className="w-4 h-4" />
            </span>
          </button>
        </header>

        <button
          ref={resetButtonRef}
          type="button"
          data-interface-control
          className="balloon-ink__reset"
          title="Clear ink strokes and reveal again"
        >
          <RotateCcw className="w-3 h-3 text-blue-600" />
          <span>Reset ✣</span>
        </button>

        <p className="balloon-ink__footer-left">
          Vadodara, Gujarat · India
        </p>

        <p className="balloon-ink__footer-center">
          Move cursor to paint · click to splash · scroll down to expand
        </p>

        <div className="balloon-ink__footer-right">
          <span>Panth Mistry</span>
          <span>/</span>
          <strong>2026</strong>
        </div>
      </div>

      {!hasError && (
        <div
          className={[
            "balloon-ink__loading",
            isReady ? "balloon-ink__loading--hidden" : "",
          ].join(" ")}
        >
          Inflating 3D Typography
        </div>
      )}

      {hasError && (
        <div className="balloon-ink__error">
          The 3D font could not be loaded. Please ensure the local font file is available.
        </div>
      )}

      <div className="balloon-ink__brush" aria-hidden="true" />
    </section>
  );
};

export default BalloonInkReveal;
