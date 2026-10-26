// src/data/puzzleData.ts
// Dữ liệu trò chơi ô chữ học đường & đại chúng
// KHÔNG DÙNG THUẬT NGỮ CHUYÊN MÔN / VĂN BẢN HÀNH CHÍNH
// Từ khóa hàng dọc: LÀM CHỦ THỜI SỐ (LAMCHUTHOISO)

export interface CrosswordItem {
  id: string;
  order: number; // 1 -> 12
  word: string; // Không dấu (dùng so khớp nội bộ)
  displayWord: string; // Có dấu tiếng Việt chuẩn
  clozeSentence: string; // Câu hỏi điền từ có chỗ trống [.......]
  keyCharIndex: number; // Vị trí chữ cái hàng dọc
  keyChar: string; // Chữ cái không dấu
  keyCharDisplay: string; // Chữ cái có dấu
  // Tọa độ trên ma trận 12x12
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-down-right' | 'diagonal-down-left';
}

export const CROSSWORD_ITEMS: CrosswordItem[] = [
  {
    id: "q1",
    order: 1,
    word: "LAPHIEU",
    displayWord: "LÁ PHIẾU",
    clozeSentence: "Ngày 6/1/1946, người dân cầm trên tay [.......] bầu Quốc hội đầu tiên của nước Việt Nam độc lập.",
    keyCharIndex: 0,
    keyChar: "L",
    keyCharDisplay: "L",
    startRow: 9,
    startCol: 3,
    endRow: 9,
    endCol: 9,
    direction: "horizontal"
  },
  {
    id: "q2",
    order: 2,
    word: "CANHCUA",
    displayWord: "CÁNH CỬA",
    clozeSentence: "Năm 1945, lớp học mở ở đình chùa, chợ; thiếu bảng đen thì người dân dùng [.......], thiếu phấn thì lấy gạch viết xuống đất.",
    keyCharIndex: 1,
    keyChar: "A",
    keyCharDisplay: "À",
    startRow: 0,
    startCol: 5,
    endRow: 0,
    endCol: 11,
    direction: "horizontal"
  },
  {
    id: "q3",
    order: 3,
    word: "MUCHU",
    displayWord: "MÙ CHỮ",
    clozeSentence: "Khi nước Việt Nam Dân chủ Cộng hòa ra đời, 95% dân số rơi vào cảnh thất học, [.......], không thể tự đọc luật.",
    keyCharIndex: 0,
    keyChar: "M",
    keyCharDisplay: "M",
    startRow: 1,
    startCol: 9,
    endRow: 5,
    endCol: 5,
    direction: "diagonal-down-left"
  },
  {
    id: "q4",
    order: 4,
    word: "CONGNGHE",
    displayWord: "CÔNG NGHỆ",
    clozeSentence: "Năm 1945, người không biết chữ bị bỏ lại phía sau; hôm nay, người không biết dùng [.......] cũng đứng trước nguy cơ tương tự.",
    keyCharIndex: 0,
    keyChar: "C",
    keyCharDisplay: "C",
    startRow: 0,
    startCol: 3,
    endRow: 7,
    endCol: 3,
    direction: "vertical"
  },
  {
    id: "q5",
    order: 5,
    word: "BINHDAN",
    displayWord: "BÌNH DÂN",
    clozeSentence: "Ngày 8/9/1945, Chính phủ ban hành sắc lệnh thành lập Nha [.......] học vụ, quy định việc học chữ bắt buộc và không mất tiền.",
    keyCharIndex: 3,
    keyChar: "H",
    keyCharDisplay: "H",
    startRow: 1,
    startCol: 4,
    endRow: 7,
    endCol: 4,
    direction: "vertical"
  },
  {
    id: "q6",
    order: 6,
    word: "QUOCNGU",
    displayWord: "QUỐC NGỮ",
    clozeSentence: "Trong Lời kêu gọi ngày 4/10/1945, Bác Hồ căn dặn mọi người trước hết phải biết đọc, biết viết chữ [.......].",
    keyCharIndex: 1,
    keyChar: "U",
    keyCharDisplay: "Ủ",
    startRow: 2,
    startCol: 11,
    endRow: 8,
    endCol: 5,
    direction: "diagonal-down-left"
  },
  {
    id: "q7",
    order: 7,
    word: "GIACDOT",
    displayWord: "GIẶC DỐT",
    clozeSentence: "Tại phiên họp Chính phủ đầu tiên ngày 3/9/1945, Chủ tịch Hồ Chí Minh xác định diệt giặc đói, diệt [.......] và diệt giặc ngoại xâm.",
    keyCharIndex: 6,
    keyChar: "T",
    keyCharDisplay: "T",
    startRow: 11,
    startCol: 2,
    endRow: 11,
    endCol: 8,
    direction: "horizontal"
  },
  {
    id: "q8",
    order: 8,
    word: "CHIAKHOA",
    displayWord: "CHÌA KHÓA",
    clozeSentence: "Tri thức chính là [.......] để mở ra tương lai tươi sáng cho đất nước.",
    keyCharIndex: 1,
    keyChar: "H",
    keyCharDisplay: "H",
    startRow: 10,
    startCol: 4,
    endRow: 10,
    endCol: 11,
    direction: "horizontal"
  },
  {
    id: "q9",
    order: 9,
    word: "SUOTDOI",
    displayWord: "SUỐT ĐỜI",
    clozeSentence: "Bác Hồ và Đảng luôn căn dặn chúng ta phải xây dựng tinh thần tự giác học tập, học tập [.......].",
    keyCharIndex: 2,
    keyChar: "O",
    keyCharDisplay: "Ờ",
    startRow: 3,
    startCol: 1,
    endRow: 9,
    endCol: 1,
    direction: "vertical"
  },
  {
    id: "q10",
    order: 10,
    word: "VNEID",
    displayWord: "VNEID",
    clozeSentence: "Hôm nay, người dân đăng nhập nền tảng trực tuyến Bình dân học vụ số bằng tài khoản định danh [.......].",
    keyCharIndex: 3,
    keyChar: "I",
    keyCharDisplay: "I",
    startRow: 2,
    startCol: 9,
    endRow: 6,
    endCol: 5,
    direction: "diagonal-down-left"
  },
  {
    id: "q11",
    order: 11,
    word: "QUOCSACH",
    displayWord: "QUỐC SÁCH",
    clozeSentence: "Phát triển giáo dục và đào tạo cùng với khoa học và công nghệ luôn là [.......] hàng đầu.",
    keyCharIndex: 4,
    keyChar: "S",
    keyCharDisplay: "S",
    startRow: 0,
    startCol: 2,
    endRow: 7,
    endCol: 2,
    direction: "vertical"
  },
  {
    id: "q12",
    order: 12,
    word: "LUADAO",
    displayWord: "LỪA ĐẢO",
    clozeSentence: "Khi tham gia môi trường mạng, chúng ta cần trang bị kỹ năng số để phòng tránh nguy cơ [.......] trực tuyến.",
    keyCharIndex: 5,
    keyChar: "O",
    keyCharDisplay: "Ố",
    startRow: 1,
    startCol: 11,
    endRow: 6,
    endCol: 6,
    direction: "diagonal-down-left"
  }
];

export const VERTICAL_KEY_WORD = {
  word: "LAMCHUTHOISO",
  displayWord: "LÀM CHỦ THỜI SỐ",
  clue: "Từ khóa 12 chữ cái: Khát vọng và năng lực mà mỗi người dân Việt Nam cần có – từ việc tự tay cầm lá phiếu độc lập năm 1946 đến việc thành thạo công nghệ số năm 2026!"
};

// Ma trận chữ 12x12 đa hướng (Ngang - Dọc - Chéo)
export const WORD_SEARCH_GRID: string[][] = [
  ['X', 'T', 'Q', 'C', 'Z', 'C', 'A', 'N', 'H', 'C', 'U', 'A'],
  ['P', 'Y', 'U', 'O', 'B', 'K', 'L', 'M', 'G', 'M', 'N', 'L'],
  ['W', 'R', 'O', 'N', 'I', 'T', 'S', 'D', 'U', 'V', 'U', 'Q'],
  ['V', 'S', 'C', 'G', 'N', 'P', 'Q', 'C', 'N', 'A', 'U', 'X'],
  ['T', 'U', 'S', 'N', 'H', 'K', 'H', 'E', 'D', 'O', 'Z', 'Y'],
  ['F', 'O', 'A', 'G', 'D', 'U', 'I', 'A', 'C', 'R', 'T', 'K'],
  ['H', 'T', 'C', 'H', 'A', 'D', 'O', 'N', 'M', 'P', 'L', 'S'],
  ['J', 'D', 'H', 'E', 'N', 'W', 'G', 'Z', 'X', 'B', 'V', 'C'],
  ['K', 'O', 'P', 'M', 'T', 'U', 'Q', 'R', 'S', 'T', 'Y', 'D'],
  ['N', 'I', 'Z', 'L', 'A', 'P', 'H', 'I', 'E', 'U', 'W', 'F'],
  ['B', 'G', 'H', 'J', 'C', 'H', 'I', 'A', 'K', 'H', 'O', 'A'],
  ['M', 'K', 'G', 'I', 'A', 'C', 'D', 'O', 'T', 'P', 'L', 'Q']
];

/**
 * Kiểm tra xem chuỗi có chứa dấu tiếng Việt hay không
 */
export function hasVietnameseAccents(str: string): boolean {
  if (!str) return false;
  const normalized = str.normalize('NFD');
  // Chứa dấu thanh hoặc dấu mũ/móc/trăng tiếng Việt hoặc chữ đ/Đ
  return /[\u0300-\u036fđĐ]/.test(normalized);
}

/**
 * Hàm kiểm tra đáp án cho 12 câu hỏi:
 * - Không phân biệt hoa/thường
 * - Nếu người chơi gõ CÓ DẤU: Bắt buộc phải ĐÚNG DẤU CHÍNH XÁC (sai dấu như "cảnh" thay vì "cánh" sẽ bị từ chối)
 * - Nếu người chơi gõ KHÔNG DẤU: So khớp với dạng không dấu chuẩn (a-z)
 */
export function validateAnswer(input: string, item: CrosswordItem): boolean {
  if (!input) return false;

  const rawInput = input.trim().toLowerCase().replace(/\s+/g, ' ').normalize('NFC');
  const targetDisplay = item.displayWord.trim().toLowerCase().replace(/\s+/g, ' ').normalize('NFC');
  const inputNoSpace = rawInput.replace(/\s+/g, '');
  const targetNoSpace = targetDisplay.replace(/\s+/g, '');

  if (hasVietnameseAccents(rawInput)) {
    // Nếu gõ có dấu: BẮT BUỘC ĐÚNG DẤU
    return rawInput === targetDisplay || inputNoSpace === targetNoSpace;
  }

  // Nếu gõ không dấu: so khớp chuỗi không dấu chuẩn (a-z)
  const targetNoAccent = item.word.toLowerCase();
  const inputNoAccent = rawInput.replace(/[^a-z0-9]/g, '');

  return inputNoAccent === targetNoAccent;
}

/**
 * Hàm kiểm tra TỪ KHÓA HÀNG DỌC:
 * - Nếu người chơi gõ CÓ DẤU: Bắt buộc phải là "LÀM CHỦ THỜI SỐ"!
 *   Nếu gõ sai dấu (ví dụ: "LÀM CHỦ THÔI SỐ", "THÔI" thay vì "THỜI") => BỊ TÍNH LÀ SAI!
 * - Nếu người chơi gõ KHÔNG DẤU: Bắt buộc phải là "LAMCHUTHOISO" hoặc "LAM CHU THOI SO"
 */
export function validateVerticalKeyword(input: string): boolean {
  if (!input) return false;

  const rawInput = input.trim().toLowerCase().replace(/\s+/g, ' ').normalize('NFC');
  const targetDisplay = VERTICAL_KEY_WORD.displayWord.trim().toLowerCase().replace(/\s+/g, ' ').normalize('NFC');
  const inputNoSpace = rawInput.replace(/\s+/g, '');
  const targetNoSpace = targetDisplay.replace(/\s+/g, '');

  if (hasVietnameseAccents(rawInput)) {
    // Nếu người chơi gõ có dấu: BẮT BUỘC ĐÚNG DẤU "LÀM CHỦ THỜI SỐ"
    // Nhập sai dấu (như "THÔI", "CHÚ", "SỔ"...) sẽ bị tính là SAI!
    return rawInput === targetDisplay || inputNoSpace === targetNoSpace;
  }

  // Nếu người chơi gõ không dấu: so khớp với "LAMCHUTHOISO"
  const targetNoAccent = VERTICAL_KEY_WORD.word.toLowerCase();
  const inputNoAccent = rawInput.replace(/[^a-z0-9]/g, '');

  return inputNoAccent === targetNoAccent;
}
