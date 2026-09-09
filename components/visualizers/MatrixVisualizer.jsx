'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MatrixVisualizer.module.css';

const DIM_FILL = '#eef1f5';
const FOCUS = '#1e56a0';
const ACTIVE = '#5b8fd4';
const SETTLED = '#8fb3de';
const MONO = '"Cascadia Mono", Consolas, "SF Mono", Menlo, monospace';

/** Nhận generator yield step có { matrix, cells } — vẽ bảng 2D trên canvas. */
export default function MatrixVisualizer({ steps = [], current = 0, height = 320 }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: height });

  // Theo dõi độ rộng khung chứa — cùng cơ chế với ArrayVisualizer.
  useEffect(() => {
    const el = canvasRef.current?.parentElement;
    if (!el) return undefined;
    const measure = () => setSize({ w: el.clientWidth, h: height });
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const step = steps[current];
    if (!canvas || !size.w) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.w, size.h);

    const matrix = step?.matrix ?? [];
    if (!matrix.length) return;

    const rows = matrix.length;
    const cols = matrix[0].length;
    const hit = new Set((step?.cells ?? []).map(([r, c]) => `${r},${c}`));
    const type = step?.type ?? '';

    // Lề trái/trên dành cho nhãn chỉ số hàng/cột (font mono).
    const padL = 30;
    const padT = 30;
    const gap = 4;
    const cellW = Math.max((size.w - padL - 10 - gap * (cols - 1)) / cols, 26);
    const cellH = Math.max((size.h - padT - 10 - gap * (rows - 1)) / rows, 26);

    const fillFor = (r, c) => {
      if (!hit.has(`${r},${c}`)) return DIM_FILL;
      if (type === 'done' || type === 'mark') return SETTLED;
      if (type === 'compare' || type === 'pivot') return FOCUS;
      return ACTIVE;
    };

    // Nhãn chỉ số hàng (bên trái) và cột (phía trên).
    ctx.font = `11px ${MONO}`;
    ctx.fillStyle = '#8a929c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < rows; r++) {
      ctx.fillText(String(r), 14, padT + r * (cellH + gap) + cellH / 2);
    }
    for (let c = 0; c < cols; c++) {
      ctx.fillText(String(c), padL + c * (cellW + gap) + cellW / 2, 13);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padL + c * (cellW + gap);
        const y = padT + r * (cellH + gap);
        const highlighted = hit.has(`${r},${c}`);

        ctx.fillStyle = fillFor(r, c);
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, 5);
        ctx.fill();

        ctx.fillStyle = highlighted ? '#ffffff' : '#3d454f';
        ctx.font = `13px ${MONO}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(matrix[r][c]), x + cellW / 2, y + cellH / 2);
      }
    }
  }, [steps, current, size]);

  return (
    <div className={styles.frame} style={{ height: size.h }}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="Minh họa bảng hai chiều từng bước" />
    </div>
  );
}