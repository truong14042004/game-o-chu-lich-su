# 🇻🇳 Minigame Giải Ô Chữ Lịch Sử Đảng

![CI / CD Pipeline](https://github.com/truong14042004/game-o-chu-lich-su/actions/workflows/ci.yml/badge.svg)

> **Chủ đề**: *Diệt giặc dốt (1945) đến Phong trào Bình dân học vụ số*  
> Trò chơi giáo dục tương tác cao với thiết kế giao diện sáng trang nhã, cột từ khóa dọc thẳng tắp, hỗ trợ trình chiếu và lớp học.

---

## ✨ Tính Năng Nổi Bật

- **Cột Từ Khóa Dọc Cố Định**: Cột từ khóa hàng dọc **"BÌNH DÂN HỌC VỤ SỐ"** được căn thẳng tắp tại cột 7, nổi bật với biểu tượng hoa sen và viền vàng.
- **Tự Do Nhập Trực Tiếp Vào Từng Ô**: Người chơi có thể gõ từng chữ cái không dấu trực tiếp vào từng ô của hàng ngang hoặc gõ đáp án có dấu đầy đủ vào ô kiểm tra bên câu hỏi.
- **12 Câu Hỏi Đảo Thứ Tự**: Thứ tự 12 câu hỏi được xáo trộn tự động, người chơi tự tìm đọc câu hỏi và ghép vào hàng ô chữ tương ứng mà không bị lộ đáp án/gợi ý.
- **Ma Trận Chữ Cái 12x12**: Kéo chọn các từ khóa ẩn trên ma trận đa hướng (ngang, dọc, chéo).
- **Âm Thanh & Hiệu Ứng GSAP**: Hoạt ảnh lật ô 3D, confetti pháo hoa ăn mừng, hiệu ứng âm thanh click, đúng, sai sống động.
- **Chế Độ Trình Chiếu Lớp Học**: Tối ưu hiển thị cho máy chiếu, giảng đường và màn hình tương tác.
- **Quy Trình CI/CD Tự Động**: Tích hợp GitHub Actions tự động kiểm tra Linting, TypeScript và Build trên mỗi lần push hoặc tạo PR.

---

## 🚀 Bắt Đầu Nhanh (Local Development)

```bash
# Cài đặt thư viện
npm install

# Khởi chạy server phát triển
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Kiểm Tra Mã Nguồn (CI / CD)

```bash
# Kiểm tra ESLint
npm run lint

# Kiểm tra kiểu TypeScript
npm run type-check

# Tạo bản build tối ưu
npm run build
```

---

## 🌐 Triển Khai (Deployment)

Dự án đã sẵn sàng triển khai trên **Vercel**:
1. Đăng nhập [Vercel](https://vercel.com).
2. Chọn **Add New Project** ➔ Chọn repository `truong14042004/game-o-chu-lich-su`.
3. Nhấn **Deploy**. Mỗi lần push lên nhánh `master`, Vercel sẽ tự động deploy bản mới nhất!
