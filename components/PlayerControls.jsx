'use client';

import { useState } from 'react';
import styles from './PlayerControls.module.css';

const SPEEDS = [
  { value: 2, label: '2×' },
  { value: 1, label: '1×' },
  { value: 0.5, label: '0.5×' },
  { value: 0.25, label: '0.25×' },
];

export default function PlayerControls({
  running,
  canPrev,
  canNext,
  onPlayPause,
  onStep,
  onPrev,
  onReset,
  speed,
  onSpeedChange,
}) {
  const [showSpeeds, setShowSpeeds] = useState(false);

  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={styles.btn}
        onClick={onPlayPause}
        disabled={running ? false : !canNext}
        title={running ? 'Tạm dừng' : 'Chạy'}
      >
        {running ? 'Tạm dừng' : 'Chạy'}
      </button>

      <button type="button" className={styles.btn} onClick={onPrev} disabled={!canPrev} title="Lùi một bước">
        Bước lùi
      </button>
      <button type="button" className={styles.btn} onClick={() => onStep()} disabled={!canNext} title="Tiến một bước">
        Bước tới
      </button>
      <button type="button" className={styles.btn} onClick={onReset} title="Về trạng thái ban đầu">
        Đặt lại
      </button>

      <div className={styles.speed}>
        <button
          type="button"
          className={styles.speedBtn}
          onClick={() => setShowSpeeds((v) => !v)}
          title="Tốc độ chạy"
        >
          {SPEEDS.find((s) => s.value === speed)?.label ?? `${speed}×`}
        </button>
        {showSpeeds && (
          <div className={styles.speedMenu}>
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`${styles.speedItem}${s.value === speed ? ` ${styles.speedActive}` : ''}`}
                onClick={() => {
                  onSpeedChange(s.value);
                  setShowSpeeds(false);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
