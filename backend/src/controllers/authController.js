const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Xử lý đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu!' });
    }

    try {
        const query = 'SELECT * FROM "KhachHang" WHERE "Email" = $1';
        const result = await db.query(query, [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại!' });
        }

        const user = result.rows[0];

        // So sánh mật khẩu bằng bcrypt hoặc mật khẩu plaintext cũ (nếu admin)
        const isMatch = await bcrypt.compare(password, user.MatKhau);
        
        // Hỗ trợ trường hợp tài khoản cũ không băm
        if (!isMatch && password !== user.MatKhau) {
            return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        // Tạo session
        req.session.user = {
            ID: user.ID,
            TenKH: user.TenKH,
            Email: user.Email,
            SoDu: user.SoDu
        };

        return res.json({ success: true, user: req.session.user, message: 'Đăng nhập thành công' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập!' });
    }
};

// Xử lý đăng ký
exports.register = async (req, res) => {
    const { fullname, email, password, password_confirmation } = req.body;

    if (!fullname || !email || !password || !password_confirmation) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    if (password !== password_confirmation) {
        return res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp!' });
    }

    try {
        const emailCheckQuery = 'SELECT * FROM "KhachHang" WHERE "Email" = $1';
        const emailCheckResult = await db.query(emailCheckQuery, [email]);
        
        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Tài khoản email đã tồn tại' });
        }

        // Băm mật khẩu (Salt: 10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const queryText = `
            INSERT INTO "KhachHang"("TenKH", "Email", "MatKhau")
            VALUES ($1, $2, $3) RETURNING "ID", "TenKH", "Email";
        `;
        const result = await db.query(queryText, [fullname, email, hashedPassword]);
        
        return res.json({ success: true, message: 'Đăng ký tài khoản thành công', user: result.rows[0] });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi đăng ký!' });
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất' });
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Đăng xuất thành công' });
    });
};

// Lấy thông tin user hiện tại
exports.me = (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ success: true, user: req.session.user });
    }
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
};
