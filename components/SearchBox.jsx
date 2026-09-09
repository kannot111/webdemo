'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBox.module.css';

const EXAMPLES = ['cây phân đoạn', 'nén đường đi', 'đường đi ngắn nhất', 'số Catalan'];
const LIMIT = 8;
const MIN_SCORE = 0.45;

// Cache module-level: mô hình và index chỉ nạp một lần trong phiên.
let extractorPromise = null;
let indexPromise = null;

function loadIndex() {
  if (!indexPromise) {
    // NEXT_PUBLIC_BASE_PATH do next.config.mjs đặt lúc build (GitHub Pages cần /<repo>).
    indexPromise = fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/search/index.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return indexPromise;
}

function loadExtractor() {
  if (!extractorPromise) {
    // Tải transformers.js từ CDN ngay lúc chạy trong trình duyệt — không đóng
    // gói vào build (webpackIgnore) để bundle không kéo theo onnxruntime-node/
    // sharp (binary native bị chặn install script trên Vercel → build fail).
    extractorPromise = import(/* webpackIgnore: true */ 'https://esm.sh/@huggingface/transformers@3.8.1').then(
      (mod) => mod.pipeline('feature-extraction', 'Xenova/multilingual-e5-small', { dtype: 'q8' }),
    );
  }
  return extractorPromise;
}

function decodeVec(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/** Dự phòng khi mô hình chưa tải xong hoặc mất mạng: khớp chuỗi thường. */
function substringResults(query, items) {
  const q = query.toLowerCase();
  return items
    .filter((it) => `${it.name} ${it.en}`.toLowerCase().includes(q))
    .slice(0, LIMIT)
    .map((it) => ({ ...it, score: null }));
}

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading-model | model-ready | error
  const [note, setNote] = useState('');
  const runIdRef = useRef(0);

  const runSearch = useCallback(async (raw) => {
    const q = raw.trim();
    const runId = ++runIdRef.current;
    if (!q) {
      setResults([]);
      setNote('');
      setStatus('idle');
      return;
    }

    const index = await loadIndex();
    if (runId !== runIdRef.current) return;
    const items = index?.items ?? [];
    if (!items.length) {
      setResults([]);
      setNote('Không nạp được dữ liệu tìm kiếm.');
      return;
    }

    // Tìm theo nghĩa bằng mô hình open-weight chạy ngay trên trình duyệt.
    try {
      setStatus('loading-model');
      const extractor = await loadExtractor();
      if (runId !== runIdRef.current) return;
      setStatus('model-ready');
      const tensor = await extractor(`query: ${q}`, { pooling: 'mean', normalize: true });
      if (runId !== runIdRef.current) return;
      const qv = Float32Array.from(tensor.data);
      const ranked = items
        .map((it) => ({ ...it, score: dot(qv, decodeVec(it.vec)) }))
        .filter((r) => r.score >= MIN_SCORE)
        .sort((a, b) => b.score - a.score)
        .slice(0, LIMIT);
      setResults(ranked);
      setNote(ranked.length ? '' : 'Không có chủ đề nào đủ gần về nghĩa. Thử từ khóa khác.');
    } catch {
      if (runId !== runIdRef.current) return;
      setStatus('error');
      setResults(substringResults(q, items));
      setNote('Mô hình ngữ nghĩa chưa tải được, đang khớp theo từ khóa thường.');
    }
  }, []);

  // Gõ là tìm, chừa 200ms để không nhồi lại giữa các phím.
  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 200);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  const firstSlug = results.find((r) => r.slug)?.slug ?? null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstSlug) router.push(`/algorithms/${firstSlug}`);
  };

  return (
    <section className={styles.box} aria-label="Tìm kiếm thuật toán">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm chủ đề theo ý nghĩa, ví dụ: cây đoạn, quay lui, khoảng cách chỉnh sửa"
          className={styles.input}
          aria-label="Tìm kiếm thuật toán"
        />
      </form>

      <div className={styles.hintRow}>
        <span className={styles.hintLabel}>Thử tìm:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className={styles.chip} onClick={() => setQuery(ex)}>
            {ex}
          </button>
        ))}
      </div>

      {status === 'loading-model' && (
        <p className={styles.note}>
          Đang tải mô hình tìm kiếm vào trình duyệt (chỉ lần đầu, khoảng 35 MB, sau đó dùng lại
          được ngay; mọi thứ chạy tại máy bạn, không gửi câu hỏi đi đâu).
        </p>
      )}
      {status !== 'loading-model' && note && <p className={styles.note}>{note}</p>}
      {status === 'model-ready' && !note && results.length > 0 && (
        <p className={styles.note}>
          {results.length} chủ đề khớp nhất, xếp theo độ tương đồng về nghĩa.
        </p>
      )}

      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((r) => {
            const inner = (
              <>
                <span className={styles.resName}>{r.name}</span>
                {r.en && <span className={styles.resEn}>{r.en}</span>}
                <span className={styles.resCrumb}>
                  {r.stage}, {r.group}
                </span>
                {r.score != null && (
                  <span className={styles.resScore}>{Math.round(r.score * 100)}%</span>
                )}
                <span className={r.slug ? styles.resCta : styles.resMissing}>
                  {r.slug ? 'Xem bài viết' : 'Chưa có bài viết'}
                </span>
              </>
            );
            return (
              <li key={r.name} className={styles.resItem}>
                {r.slug ? (
                  <a href={`/algorithms/${r.slug}`} className={styles.resLink}>
                    {inner}
                  </a>
                ) : (
                  <div className={styles.resPlain}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
