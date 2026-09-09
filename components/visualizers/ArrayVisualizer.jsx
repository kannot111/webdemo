'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ArrayVisualizer.module.css';

/**
 * Vẽ mảng dạng thanh bằng canvas, tô màu theo step.type của bước hiện tại.
 *
 * - bar màu nền: xám nhạt
 * - so sánh (compare) : xanh dương đậm (accent chính của site)
 * - hoán đổi (swap)   : xanh dương nhạt hơn
 * - mark / done       : xanh dương đậm nhạt bền vững (phần tử đã đúng chỗ)
 * - các phần còn lại  : xám nhạt
 *
 * Con số trên đầu thanh dùng font monospace riêng (font-mono), đúng chuẩn
 * "1 font riêng cho số liệu" của thiết kế.
 */
const DIM = '#d9dde3';
const FOCUS = '#1e56a0';
const ACTIVE = '#5b8fd4';
const SETTLED = '#8fb3de';
// Canvas không hiểu CSS variables — khai báo font mono trực tiếp tại đây.
const MONO = '"Cascadia Mono", Consolas, "SF Mono", Menlo, monospace';


function toneFor(step, i) {
  if (!step) return DIM;
  if (step.type === 'done') return SETTLED;
  const idx = step.indices;
  if (!Array.isArray(idx)) return DIM;
  if (step.type === 'compare' || step.type === 'pivot') return idx.includes(i) ? FOCUS : DIM;
  if (step.type === 'swap' || step.type === 'push' || step.type === 'update' || step.type === 'visit') {
    return idx.includes(i) ? ACTIVE : DIM;
  }
  if (step.type === 'mark') return idx.includes(i) ? SETTLED : DIM;
  return DIM;
}

export default function ArrayVisualizer({ steps = [], current = 0, height = 260 }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: height });

  // Theo dõi độ rộng thực tế của khung chứa để canvas co giãn theo màn hình.
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

    const arr = step?.array ?? [];
    if (!arr.length) return;

    // Hỗ trợ cả mảng có số âm (prefix sum, mảng hiệu): vẽ thanh theo trục 0.
    const maxVal = Math.max(...arr, 1);
    const minVal = Math.min(...arr, 0);
    const n = arr.length;
    const padTop = 30; // chừa chỗ cho số liệu font mono
    const padBottom = 20; // chừa chỗ cho chỉ số
    const gap = n > 24 ? 2 : 6;
    const barW = Math.max((size.w - gap * (n - 1)) / n, 3);
    const plotH = Math.max(size.h - padTop - padBottom, 8);
    const span = maxVal - minVal;
    const yFor = (v) => padTop + plotH - ((v - minVal) / span) * plotH;

    // Trục 0 làm mốc thị giác khi có giá trị âm.
    if (minVal < 0) {
      ctx.strokeStyle = '#c9ced5';
      ctx.beginPath();
      ctx.moveTo(0, yFor(0));
      ctx.lineTo(size.w, yFor(0));
      ctx.stroke();
    }

    for (let i = 0; i < n; i++) {
      const y0 = yFor(0);
      const y1 = yFor(arr[i]);
      const h = Math.max(Math.abs(y1 - y0), 3);
      const x = i * (barW + gap);
      const y = arr[i] >= 0 ? y1 : y0;

      ctx.fillStyle = toneFor(step, i);
      ctx.fillRect(x, y, barW, h);

      // Chỉ số dưới chân thanh, font mono, màu trung tính.
      if (barW >= 22) {
        ctx.fillStyle = '#8a929c';
        ctx.font = `11px ${MONO}`;
        ctx.textAlign = 'center';
        ctx.fillText(String(i), x + barW / 2, size.h - 4);
      }

      // Giá trị trên đầu thanh.
      if (barW >= 30) {
        ctx.fillStyle = '#3d454f';
        ctx.font = `12px ${MONO}`;
        ctx.textAlign = 'center';
        ctx.fillText(String(arr[i]), x + barW / 2, Math.min(y, y0) - 7);
      }
    }
  }, [steps, current, size]);

  return (
    <div className={styles.frame} style={{ height: size.h }}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="Minh họa mảng từng bước" />
    </div>
  );
}
