/** Chạy thử mọi generator đã đăng ký: mỗi bước phải là step hợp lệ. */
import { GENERATORS } from '../components/generators.js';
import { isValidStep } from '../lib/algorithms/types.js';

let failed = 0;
for (const [key, entry] of Object.entries(GENERATORS)) {
  try {
    const gen = entry.gen(entry.data);
    let count = 0;
    let r = gen.next();
    while (!r.done) {
      if (!isValidStep(r.value)) throw new Error(`step #${count} type không hợp lệ: ${JSON.stringify(r.value)?.slice(0, 80)}`);
      count += 1;
      r = gen.next();
    }
    if (count === 0) throw new Error('không sinh bước nào');
    console.log(`OK  ${key.padEnd(14)} ${String(count).padStart(3)} bước`);
  } catch (e) {
    failed += 1;
    console.error(`LỖI ${key}: ${e.message}`);
  }
}
console.log(failed === 0 ? '\nTất cả generator hợp lệ.' : `\n${failed} generator lỗi.`);
process.exit(failed === 0 ? 0 : 1);
