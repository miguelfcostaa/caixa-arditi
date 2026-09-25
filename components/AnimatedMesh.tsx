"use client";

import { useEffect, useRef } from "react";

const LINE_COUNT = 22;
const POINT_COUNT = 150;

export function AnimatedMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const horizonRatio = 0.49;
    const pointer = {
      x: 0.62,
      targetX: 0.62,
      depth: 0.35,
      targetDepth: 0.35,
      strength: 0,
      targetStrength: 0,
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const gaussian = (value: number, center: number, spread: number) => {
      const distance = (value - center) / spread;
      return Math.exp(-(distance * distance));
    };

    const draw = (elapsed: number) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = width < 640 ? 1.35 : 1.65;
      context.lineCap = "round";
      context.lineJoin = "round";

      const time = reduceMotion.matches ? 0 : elapsed * 0.00016;
      const horizon = height * horizonRatio;

      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.depth += (pointer.targetDepth - pointer.depth) * 0.055;
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.065;

      for (let line = 0; line < LINE_COUNT; line += 1) {
        const depth = line / (LINE_COUNT - 1);
        const perspective = Math.pow(depth, 1.72);
        const baseY = horizon + perspective * height * 0.89;
        const depthAmplitude = 0.32 + depth * 1.05;
        const pointerDepthInfluence = gaussian(depth, pointer.depth, 0.3);

        context.beginPath();

        for (let point = 0; point <= POINT_COUNT; point += 1) {
          const xRatio = point / POINT_COUNT;
          const x = xRatio * width;

          const mainCenter =
            0.61 +
            Math.sin(time * 0.78 + depth * 2.1) * 0.035 -
            depth * 0.055 +
            (pointer.x - 0.5) * pointer.strength * 0.055;
          const leftCenter =
            0.2 +
            Math.sin(time * 0.62 + depth * 1.7 + 1.4) * 0.045;
          const rightCenter =
            0.88 +
            Math.sin(time * 0.5 + depth * 1.3 + 2.5) * 0.035;

          const mainRidge =
            gaussian(xRatio, mainCenter, 0.115 + depth * 0.035) *
            height *
            0.105 *
            depthAmplitude;
          const leftRidge =
            gaussian(xRatio, leftCenter, 0.095 + depth * 0.025) *
            height *
            0.052 *
            depthAmplitude;
          const rightRidge =
            gaussian(xRatio, rightCenter, 0.13) *
            height *
            0.035 *
            depthAmplitude;
          const flowingWave =
            Math.sin(xRatio * 11.5 - time * 2.15 + depth * 2.8) *
            height *
            0.009 *
            depthAmplitude;
          const fineWave =
            Math.sin(xRatio * 24 + time * 1.35 + depth * 5.2) *
            height *
            0.0025 *
            (0.5 + depth);
          const pointerXInfluence = gaussian(
            xRatio,
            pointer.x,
            0.105 + depth * 0.035,
          );
          const hoverLift =
            pointerXInfluence *
            pointerDepthInfluence *
            height *
            0.075 *
            pointer.strength;
          const hoverRipple =
            Math.sin((xRatio - pointer.x) * 25 - depth * 4.5 + time * 4) *
            pointerXInfluence *
            pointerDepthInfluence *
            height *
            0.012 *
            pointer.strength;

          const y =
            baseY -
            mainRidge -
            leftRidge * 0.62 +
            rightRidge +
            flowingWave +
            fineWave -
            hoverLift +
            hoverRipple;

          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const alpha =
          0.54 + depth * 0.2 + pointerDepthInfluence * pointer.strength * 0.1;
        context.strokeStyle = `rgba(248, 83, 8, ${alpha})`;
        context.stroke();
      }
    };

    const render = (elapsed: number) => {
      draw(elapsed);
      if (!reduceMotion.matches) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handleMotionPreference = () => {
      window.cancelAnimationFrame(animationFrame);
      render(0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const isInside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isInside) {
        pointer.targetStrength = 0;
        return;
      }

      const normalizedX = (event.clientX - bounds.left) / bounds.width;
      const normalizedY = (event.clientY - bounds.top) / bounds.height;
      const perspectiveY = Math.max(
        0,
        Math.min(1, (normalizedY - horizonRatio) / (1 - horizonRatio)),
      );

      pointer.targetX = normalizedX;
      pointer.targetDepth = Math.pow(perspectiveY, 1 / 1.72);
      pointer.targetStrength = 1;

      if (reduceMotion.matches) draw(0);
    };

    const handlePointerLeave = () => {
      pointer.targetStrength = 0;
      if (reduceMotion.matches) draw(0);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion.matches) draw(0);
    });

    resizeObserver.observe(canvas);
    reduceMotion.addEventListener("change", handleMotionPreference);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("mouseleave", handlePointerLeave);
    resize();
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", handleMotionPreference);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#FCFAF9]"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-90"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_48%,rgba(252,250,249,0.98)_0%,rgba(252,250,249,0.86)_25%,transparent_55%)]" />
    </div>
  );
}
