'use client';

import { useEffect, useRef, useState } from 'react';
import PlayerControls from './PlayerControls';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import MatrixVisualizer from './visualizers/MatrixVisualizer';
import StackVisualizer from './visualizers/StackVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import TreeVisualizer from './visualizers/TreeVisualizer';
import styles from './AlgorithmPlayer.module.css';
import { GENERATORS } from './generators';

const TICK_MS = 800;

/**
 * Bộ renderer khả dụng. Mỗi entry trong GENERATORS có thể khai báo `kind`
 * ('matrix' | 'graph' | 'tree') để ép renderer; nếu không, renderer được
 * suy từ dữ liệu của bước (step.matrix → bảng 2D, mặc định → mảng 1D).
 */
const RENDERERS = {
  array: ArrayVisualizer,
  matrix: MatrixVisualizer,
  graph: GraphVisualizer,
  tree: TreeVisualizer,
};

function resolveRenderer(entry, step) {
  const kind = entry?.kind;
  if (kind && RENDERERS[kind]) return RENDERERS[kind];
  if (step?.matrix) return MatrixVisualizer;
  return ArrayVisualizer;
}

/**
 * Điều phối playback: nhận key thuật toán (xem components/generators.js),
 * lấy generator function tương ứng rồi gọi .next() theo nhịp để tích lũy
 * steps, đưa cho visualizer vẽ. Lưu history để hỗ trợ Bước lùi mà không
 * cần tạo lại generator.
 *
 * Props phải là giá trị serialized được (string/number) vì component này
 * được nhúng từ nội dung MDX render phía server.
 */
export default function AlgorithmPlayer({ algorithm = 'bubbleSort', height = 260 }) {
  const entry = GENERATORS[algorithm];
  const generator = entry?.gen;
  const data = entry?.data;

  const [steps, setSteps] = useState([]);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);
  const genRef = useRef(null);

  const currentStep = steps[current] ?? null;
  const finished = total > 0 && current >= total - 1;
  const Visualizer = resolveRenderer(entry, currentStep);
  const showStack = Boolean(entry?.stack); // cột đệ quy hiện cố định khi có khai báo

  const init = () => {
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!generator) return;
    // Đếm trước tổng số bước bằng cách chạy hết một generator phụ (rẻ,
    // chỉ để thanh tiến trình và nút điều khiển biết trước tổng bước —
    // playback thật vẫn gọi .next() từng nhịp như thiết kế engine).
    let count = 0;
    const counter = generator(data);
    while (!counter.next().done) count += 1;
    setTotal(count);

    const first = generator(data);
    genRef.current = first;
    const r = first.next();
    setSteps([r.value]);
    setCurrent(0);
  };

  // Reset khi đổi thuật toán.
  useEffect(() => {
    init();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  // Vòng lặp playback: gọi .next() theo nhịp, tốc độ điều chỉnh bằng speed.
  // Effect phụ thuộc current — mỗi khi bước thay đổi, timeout mới được đặt lại.
  useEffect(() => {
    if (!running || finished) return undefined;
    timerRef.current = setTimeout(() => {
      const gen = genRef.current;
      if (!gen) {
        setRunning(false);
        return;
      }
      const r = gen.next();
      if (r.done) {
        setRunning(false);
        return;
      }
      setSteps((prev) => [...prev, r.value]);
      setCurrent((c) => c + 1);
    }, TICK_MS / speed);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, current, speed, finished]);

  const handlePlayPause = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (finished) return; // đã chạy hết — dùng Đặt lại để xem lại
    setRunning(true);
  };

  const handleStep = () => {
    setRunning(false);
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else if (!finished) {
      const gen = genRef.current;
      if (!gen) return;
      const r = gen.next();
      if (r.done) return;
      setSteps((prev) => [...prev, r.value]);
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => {
    setRunning(false);
    setCurrent((c) => Math.max(c - 1, 0));
  };

  const handleReset = () => {
    init();
  };

  const progress = total > 0 ? Math.min(((current + 1) / total) * 100, 100) : 0;

  return (
    <figure className={styles.wrap}>
      <div className={showStack ? `${styles.stage} ${styles.stageSplit}` : styles.stage}>
        <div className={showStack ? styles.stageMain : undefined}>
          <Visualizer steps={steps} current={current} height={height} />
        </div>
        {showStack && <StackVisualizer step={currentStep} height={height} />}
      </div>

      {showStack && (
        <p className={styles.stackNote}>
          Cột phải là các tầng gọi đệ quy: <strong>Đẩy vào</strong> = gọi sâu hơn,{' '}
          <strong>Lấy ra</strong> = quay lui; ô tròn là các giá trị 1..n đã dùng ở nhánh hiện tại.
        </p>
      )}

      <figcaption className={styles.caption}>
        {currentStep?.meta ?? (generator ? 'Nhấn Chạy để bắt đầu.' : 'Chưa có minh họa cho thuật toán này.')}
      </figcaption>

      <div className={styles.track} aria-hidden="true">
        <div className={styles.trackFill} style={{ width: `${progress}%` }} />
      </div>

      <PlayerControls
        running={running}
        canPrev={current > 0}
        canNext={!finished}
        onPlayPause={handlePlayPause}
        onStep={handleStep}
        onPrev={handlePrev}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </figure>
  );
}
