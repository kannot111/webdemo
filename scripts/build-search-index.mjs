/**
 * Sinh index tìm kiếm ngữ nghĩa cho toàn bộ chủ đề trong lib/curriculum.js.
 *
 * Mô hình: Xenova/multilingual-e5-small — trọng số mở (MIT) của intfloat/
 * multilingual-e5-small, đóng gói ONNX, chạy được cả trong Node (build-time)
 * và trong trình duyệt (query-time) qua transformers.js. Không cần API key.
 *
 * Chạy: npm run index  → ghi public/search/index.json
 * (mô hình tải một lần về .cache/ rồi được tái sử dụng)
 */
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from '@huggingface/transformers';
import { STAGES } from '../lib/curriculum.js';

const MODEL = 'Xenova/multilingual-e5-small';

const items = [];
for (const stage of STAGES) {
  for (const group of stage.groups) {
    for (const topic of group.topics) {
      const passage = [
        `passage: ${topic.name}`,
        topic.en,
        topic.detail,
        group.name,
        stage.tag,
      ]
        .filter(Boolean)
        .join('. ');
      items.push({
        name: topic.name,
        en: topic.en ?? null,
        detail: topic.detail ?? null,
        slug: topic.slug ?? null,
        stage: stage.tag,
        stageId: stage.id,
        group: group.name,
        passage,
      });
    }
  }
}

console.log(`Sinh embedding cho ${items.length} chủ đề bằng ${MODEL}...`);
const extractor = await pipeline('feature-extraction', MODEL, { dtype: 'q8' });

let dim = 0;
const out = [];
for (const it of items) {
  const tensor = await extractor(it.passage, { pooling: 'mean', normalize: true });
  const f32 = Float32Array.from(tensor.data);
  if (!dim) dim = f32.length;
  out.push({
    name: it.name,
    en: it.en,
    detail: it.detail,
    slug: it.slug,
    stage: it.stage,
    stageId: it.stageId,
    group: it.group,
    // Vector float32 đã chuẩn hóa (L2), lưu base64 để file gọn.
    vec: Buffer.from(f32.buffer, f32.byteOffset, f32.byteLength).toString('base64'),
  });
}

const destDir = path.join(process.cwd(), 'public', 'search');
fs.mkdirSync(destDir, { recursive: true });
const dest = path.join(destDir, 'index.json');
fs.writeFileSync(dest, JSON.stringify({ model: MODEL, dim, items: out }));
const sizeKb = Math.round(fs.statSync(dest).size / 1024);
console.log(`Đã ghi ${dest} — ${out.length} mục, ${dim} chiều, ${sizeKb} KB.`);
