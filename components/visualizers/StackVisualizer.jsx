'use client';

import styles from './StackVisualizer.module.css';

const TONE = {
  push: 'active',
  pop: 'focus',
  mark: 'settled',
  done: 'settled',
  visit: 'base',
};

/**
 * Cột đệ quy cho các generator quay lui: mỗi frame là một tầng gọi đệ quy.
 * Nhận nguyên bước hiện tại (step) thay vì cả m steps vì không cần tua lại
 * bằng canvas — các frame được render declarative bằng DOM.
 */
export default function StackVisualizer({ step, height = 260 }) {
  const frames = step?.stack ?? [];
  const used = step?.extra?.used ?? null;
  const tone = TONE[step?.type] ?? 'base';

  return (
    <div className={styles.frame} style={{ minHeight: height }}>
      {Array.isArray(used) && (
        <div className={styles.chips}>
          {used.map((isUsed, i) => (
            <span
              key={i}
              className={`${styles.chip} ${isUsed ? styles.chipUsed : styles.chipFree}`}
              title={isUsed ? `Giá trị ${i + 1} đang được dùng ở nhánh hiện tại` : `Giá trị ${i + 1} còn tự do`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}

      <div className={styles.column}>
        {frames.length === 0 && <p className={styles.empty}>Cột đệ quy đang rỗng</p>}
        {frames.map((f) => (
          <div key={f.k} className={`${styles.row} ${styles[tone] ?? styles.base}`}>
            <span className={styles.depth}>tầng {f.k}</span>
            <span className={`${styles.cell} ${styles[`cell_${tone}`] ?? styles.cell_base}`}>{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}