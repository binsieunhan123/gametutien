# Tu Tiên Nhàn Rỗi

<p align="center">
    <img src="https://i0.hdslb.com/bfs/article/c5bd547efa79470ccaab206c22b694c48941412.png" width="400">
</p>

## Công nghệ sử dụng

- **Framework**: [Vue.js](https://cn.vuejs.org)
- **Công cụ build**: [Vite](https://cn.vite.dev)
- **Quản lý trạng thái**: [Pinia](https://pinia.vuejs.org/zh)
- **Thư viện UI**: [Naive UI](https://www.naiveui.com/zh-CN)

## Chức năng chính
- [x] Hệ thống nhân vật
- [x] Hệ thống kỳ ngộ
- [x] Hệ thống khám phá
- [x] Hệ thống túi đồ
- [x] Hệ thống thành tựu
- [x] Linh thú và nuôi linh thú
- [x] Trang bị và cường hóa trang bị
- [x] Hệ thống quay thưởng
- [x] Luyện đan
- [x] Cài đặt
- [x] Quản lý dữ liệu
- [x] Chế độ GM

## Triển khai bằng Docker Compose
```bash
version: '3.9'
services:
  vue-idle-xiuxian:
    image: kowming/vue-idle-xiuxian:latest
    container_name: xiuxian
    restart: unless-stopped
    ports:
      - 8183:8080
    tty: true
    stdin_open: true
```

## Triển khai bằng NPM
```bash
# Cài đặt phụ thuộc
npm install

# Khởi chạy backend Socket.IO (cần MongoDB)
MONGO_URL=mongodb://localhost:27017 npm run server

# Chạy môi trường phát triển
npm run dev

# Nếu backend chạy ở địa chỉ khác, đặt biến VITE_API_URL
VITE_API_URL=http://localhost:3000 npm run dev
# Client sẽ đồng bộ dữ liệu qua Socket.IO

# Build bản phát hành
npm run build
```

## Cảm ơn

Dự án xin gửi lời cảm ơn tới các dự án mã nguồn mở sau:

- Vue.js
- Vite
- Naive UI
- Pinia

## Bản quyền

Copyright © 2025 Tu Tiên Nhàn Rỗi

Dự án phát hành theo giấy phép MIT. Xem file LICENSE để biết thêm chi tiết.
