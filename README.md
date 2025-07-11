# Kiểm Định Hình Ảnh - AI Image Analysis System

Hệ thống AI kiểm tra chất lượng in ấn nhãn mác sản phẩm thực phẩm cho thị trường Nhật Bản và các thị trường đòi hỏi tiêu chuẩn cao.

## 🌟 Tính năng chính

### 🔐 1. Đăng nhập với Google

- Xác thực nhanh chóng và bảo mật
- Giao diện đăng nhập hiện đại với hiệu ứng đẹp mắt
- Hỗ trợ đa ngôn ngữ (tiếng Việt)

### 📊 2. Trang tổng quan (Dashboard)

- Thông tin người dùng và chào mừng cá nhân hóa
- Bộ lọc thời gian linh hoạt
- Thống kê tổng quan:
  - Tổng số sản phẩm quản lý
  - Số lượng kiểm tra đã thực hiện
  - Tỷ lệ thành công/lỗi
- Biểu đồ sản phẩm có lỗi nhiều nhất
- Hoạt động gần đây

### 📦 3. Quản lý sản phẩm

- Hiển thị danh sách sản phẩm dạng lưới
- Lọc theo danh mục: Cháo tươi, Mì gói, Hải sản
- Tìm kiếm nhanh theo tên sản phẩm
- Thêm sản phẩm mới
- Thống kê trực quan

### 🔍 4. Chi tiết sản phẩm và AI Analysis

- So sánh ảnh mẫu chuẩn với ảnh thực tế
- Upload ảnh kiểm tra
- Phân tích AI tự động với:
  - Phát hiện lỗi văn bản (thiếu ký tự, lỗi font)
  - Kiểm tra độ mờ/rõ của hình ảnh
  - Xác minh QR code
  - Phân tích màu sắc và layout
- Lịch sử kiểm tra chi tiết
- Thông tin sản phẩm đầy đủ

### 👥 5. Quản lý nhân viên

- Danh sách nhân viên với thông tin đầy đủ
- Phân quyền: Quản trị viên / Nhân viên
- Lọc theo vai trò
- Tìm kiếm theo tên/email
- Thống kê nhân sự
- Thao tác nhanh

## 🚀 Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Trình duyệt hiện đại (Chrome, Safari, Firefox)

### Cài đặt

1. **Clone repository:**

```bash
git clone <repository-url>
cd kiem-dinh-hinh-anh
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Chạy ứng dụng:**

```bash
npm run dev
```

4. **Mở trình duyệt và truy cập:**

```
http://localhost:5173
```

### Scripts có sẵn

- `npm run dev` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm run preview` - Xem trước bản build
- `npm run lint` - Kiểm tra lỗi code

## 🛠️ Công nghệ sử dụng

- **Frontend Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Date Handling:** date-fns

## 📱 Responsive Design

Ứng dụng được thiết kế responsive hoàn toàn, hoạt động mượt mà trên:

- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📞 Mobile (< 768px)

## 🎨 UI/UX Features

- **Animations:** Fade-in, slide-up, bounce effects
- **Modern Design:** Rounded corners, shadows, gradients
- **Color Scheme:** Blue-purple gradient theme
- **Typography:** Inter font family
- **Icons:** Consistent Lucide icon set
- **Loading States:** Smooth loading animations
- **Empty States:** Helpful empty state messages

## 🔧 Tùy chỉnh

### Colors

Màu sắc chính có thể tùy chỉnh trong `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Customize primary colors
  }
}
```

### Animations

Các hiệu ứng animation được định nghĩa trong `tailwind.config.js` và `src/index.css`

## 📊 Mock Data

Ứng dụng sử dụng dữ liệu mẫu trong `src/data/mockData.ts` bao gồm:

- Thông tin người dùng và nhân viên
- Danh sách sản phẩm và danh mục
- Lịch sử kiểm tra và kết quả AI
- Thống kê dashboard

## 🚀 Deployment

### Build cho production:

```bash
npm run build
```

### Deploy lên Vercel/Netlify:

1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới MIT License. Xem `LICENSE` để biết thêm thông tin.

## 🌟 Screenshots

### Trang đăng nhập

![Login Screen](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Quản lý sản phẩm

![Products](screenshots/products.png)

### Chi tiết sản phẩm

![Product Detail](screenshots/product-detail.png)

### Quản lý nhân viên

![Employees](screenshots/employees.png)

## 📞 Liên hệ

- Email: support@kiemdinhinhanh.com
- Website: https://kiemdinhinhanh.com

---

Made with ❤️ for Vietnamese food production companies
