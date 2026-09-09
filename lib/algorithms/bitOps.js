/**
 * Thao tác bit — chuỗi phép toán cơ bản trên số 8-bit, mỗi bước hiển thị
 * dãy bit và làm nổi bật bit bị tác động.
 * @returns {number} giá trị cuối cùng
 */
export const SAMPLE_DATA = 22; // 0b00010110

const BITS = 8;
const toBits = (x) => Array.from({ length: BITS }, (_, k) => (x >> (BITS - 1 - k)) & 1);
const bitIndex = (k) => BITS - 1 - k; // vị trí trong mảng hiển thị của bit k (0 = LSB)

export function* bitOps(start) {
  let x = start;
  yield {
    type: 'mark',
    indices: [],
    array: toBits(x),
    meta: `x = ${x} (nhị phân 0b${x.toString(2).padStart(BITS, '0')}) — ô trái là bit cao nhất.`,
  };

  x |= 1 << 1;
  yield {
    type: 'update',
    indices: [bitIndex(1)],
    array: toBits(x),
    meta: `BẬT bit 1: x |= (1 << 1) ⇒ x = ${x} = 0b${x.toString(2).padStart(BITS, '0')}.`,
  };

  x &= ~(1 << 4);
  yield {
    type: 'update',
    indices: [bitIndex(4)],
    array: toBits(x),
    meta: `TẮT bit 4: x &= ~(1 << 4) ⇒ x = ${x} = 0b${x.toString(2).padStart(BITS, '0')}.`,
  };

  x ^= 1 << 0;
  yield {
    type: 'update',
    indices: [bitIndex(0)],
    array: toBits(x),
    meta: `ĐẢO bit 0: x ^= (1 << 0) ⇒ x = ${x} = 0b${x.toString(2).padStart(BITS, '0')}.`,
  };

  const check = (x >> 3) & 1;
  yield {
    type: 'compare',
    indices: [bitIndex(3)],
    array: toBits(x),
    meta: `KIỂM TRA bit 3: (x >> 3) & 1 = ${check} ⇒ bit 3 ${check ? 'đang bật' : 'đang tắt'}.`,
  };

  x <<= 1;
  yield {
    type: 'update',
    indices: [bitIndex(0), bitIndex(BITS - 1)],
    array: toBits(x),
    meta: `DỊCH TRÁI 1 bit: x <<= 1 ⇒ x = ${x} (nhân đôi, = 0b${x.toString(2).padStart(BITS, '0')}).`,
  };

  x >>= 2;
  yield {
    type: 'update',
    indices: [bitIndex(1), bitIndex(0)],
    array: toBits(x),
    meta: `DỊCH PHẢI 2 bit: x >>= 2 ⇒ x = ${x} (chia lấy nguyên cho 4).`,
  };

  const cnt = toBits(x).reduce((s, b) => s + b, 0);
  yield {
    type: 'done',
    array: toBits(x),
    meta: `Kết quả x = ${x}, có ${cnt} bit bật — đủ để dựng mọi thao tác bit cơ bản.`,
  };
  return x;
}