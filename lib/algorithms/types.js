/**
 * Bộ step type dùng chung cho toàn bộ engine visualize.
 *
 * Mỗi thuật toán là một generator function, tại mỗi bước quan trọng
 * yield một object:
 *
 *   { type, indices?, keys?, values?, array?, meta? }
 *
 * - type      : một trong các STEP_TYPES bên dưới (bắt buộc)
 * - indices   : mảng chỉ số bị tác động (với cấu trúc dạng mảng)
 * - keys      : khóa bị tác động (với cấu trúc dạng map/set, ví dụ đỉnh đồ thị)
 * - values    : dữ liệu bổ sung (ví dụ khoảng cách mới khi update_cell)
 * - array     : snapshot mảng sau bước này (nên có với swap/update_cell
 *               để player dựng lại trạng thái khi tua nhanh)
 * - meta      : ghi chú hiển thị trên player (đã format sẵn tiếng Việt)
 */

export const STEP_TYPES = {
  compare: {
    label: 'So sánh',
    // Cặp phần tử đang được so sánh — highlight nhịp nhàng, không báo đổi chỗ.
    tone: 'focus',
  },
  swap: {
    label: 'Hoán đổi',
    tone: 'active',
  },
  visit: {
    label: 'Ghé thăm',
    // Duyệt qua một phần tử/đỉnh, ví dụ BFS/DFS.
    tone: 'active',
  },
  mark: {
    label: 'Đánh dấu',
    // Chốt trạng thái cuối cùng cho phần tử (ví dụ phần tử đã đúng vị trí).
    tone: 'settled',
  },
  push: {
    label: 'Đẩy vào',
    // Thêm phần tử vào cấu trúc phụ (stack, hàng đợi, nhánh quay lui...).
    tone: 'active',
  },
  pop: {
    label: 'Lấy ra',
    // Lấy phần tử ra khỏi cấu trúc phụ (bao gồm cả lúc quay lui).
    tone: 'focus',
  },
  update_cell: {
    label: 'Cập nhật',
    // Ghi giá trị mới vào một ô (bảng QHD, mảng khoảng cách...).
    tone: 'active',
  },
  update: {
    label: 'Ghi giá trị',
    // Bước tính ra và ghi một ô mới — dùng cho prefix sum, DP:
    // khác update_cell ở chỗ nói rõ công thức sinh giá trị trong meta.
    tone: 'active',
  },
  pivot: {
    label: 'Chọn trục',
    // Phần tử/ô được chọn làm mốc (binary search mid, quicksort pivot...).
    tone: 'focus',
  },
  done: {
    label: 'Hoàn thành',
    tone: 'settled',
  },
};

/** Kiểm tra một step có hợp lệ theo engine không (dùng khi debug generator). */
export function isValidStep(step) {
  return Boolean(step) && Object.prototype.hasOwnProperty.call(STEP_TYPES, step.type);
}
