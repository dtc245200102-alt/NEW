const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Để đọc dữ liệu JSON từ Frontend gửi lên

// --- CƠ SỞ DỮ LIỆU GIẢ LẬP ---
const usersDB = []; // Lưu trữ người dùng đã đăng ký
const warrantyDB = {
    "111122223333444": { khachHang: "Lê Văn C", thietBi: "iPhone 14 Pro", tinhTrang: "Đang bảo hành", ngayHetHan: "2026-10-15", loi: "Chưa có" },
    "555566667777888": { khachHang: "Phạm Thị D", thietBi: "Samsung Z Fold 5", tinhTrang: "Từ chối bảo hành", ngayHetHan: "2025-01-01", loi: "Rơi vỡ màn hình" }
};

// --- API: ĐĂNG KÝ ---
app.post('/api/register', (req, res) => {
    const { fullname, email, password } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const userExists = usersDB.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: "Email này đã được sử dụng!" });
    }

    // Lưu người dùng mới
    const newUser = { fullname, email, password };
    usersDB.push(newUser);
    res.json({ success: true, message: "Đăng ký thành công!" });
});

// --- API: ĐĂNG NHẬP ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = usersDB.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, message: "Đăng nhập thành công!", user: { fullname: user.fullname, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác!" });
    }
});

// --- API: TRA CỨU BẢO HÀNH ---
app.get('/api/warranty/:imei', (req, res) => {
    const imei = req.params.imei;
    const data = warrantyDB[imei];

    if (data) {
        res.json({ success: true, data: data });
    } else {
        res.status(404).json({ success: false, message: "Không tìm thấy thông tin IMEI này trong hệ thống." });
    }
});

app.listen(PORT, () => {
    console.log(`[Hệ thống Pro] Server chạy tại: http://localhost:${PORT}`);
});
