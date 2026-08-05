# Phantom Forge Core OJ V4

Bản frontend Online Judge chạy bằng HTML, CSS và JavaScript.

## Chức năng V4

- Mọi tài khoản bắt đầu ở `0 rating` với hạng `Unrated`.
- Tên và thanh rating tự đổi màu theo hạng: Unrated, Newbie, Apprentice, Specialist, Expert, Master, Grandmaster và Legend.
- Admin chọn màu tên riêng; hệ thống từ chối màu trùng bảng màu rating. Có tùy chọn hiệu ứng tên chuyển động.
- Giao diện xanh nhạt, nền và màu nhấn chuyển động tự động; admin có thể tắt hiệu ứng toàn web.
- Phân quyền nhiều vai trò: Admin, Problem Setter, Contest Setter và Muted.
- Problem Setter quản lý bài tập; Contest Setter quản lý kỳ thi; Muted không thể gửi chat.
- Admin toàn quyền đổi username, tên hiển thị, mật khẩu, quyền, rating, Orb và màu tên của tài khoản khác.
- Thành viên thường không thể tự đổi username hoặc tên hiển thị.
- Admin xem/xóa sảnh chung và tin nhắn riêng, đồng thời chèn thông báo hệ thống.
- Admin có Orb vô hạn; thành viên mới có 10 Orb và nhận thêm Orb khi AC lần đầu.
- Avatar và nền toàn website hỗ trợ PNG, JPG, WebP, GIF dưới 10 MB.
- Chỉ giữ đúng 3 ngôn ngữ: HTML, CSS và JavaScript.

## Lưu ý

Đây là bản frontend dùng localStorage và IndexedDB. Chấm bài là mô phỏng; triển khai thật cần backend, cơ sở dữ liệu máy chủ, xác thực an toàn và sandbox judge.
