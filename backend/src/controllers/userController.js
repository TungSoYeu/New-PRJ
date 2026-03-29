const db = require('../config/db');

exports.updateProfile = async (req, res) => {
    const { hovaten, email, gioitinh, sodienthoai, sinhnhat, diachi } = req.body;
    const user = req.session.user;

    let updates = [];
    let updateFields = {}; 
    let values = [];
    let counter = 1;

    if (hovaten) {
        updates.push(`"TenKH" = $${counter++}`);
        values.push(hovaten);
        updateFields.TenKH = hovaten;
    }
    if (email) {
        updates.push(`"Email" = $${counter++}`);
        values.push(email);
        updateFields.Email = email;
    }
    if (gioitinh) {
        updates.push(`"GioiTinh" = $${counter++}`);
        values.push(gioitinh);
        updateFields.GioiTinh = gioitinh;
    }
    if (sodienthoai) {
        updates.push(`"SoDienThoai" = $${counter++}`);
        values.push(sodienthoai);
        updateFields.SoDienThoai = sodienthoai;
    }
    if (sinhnhat) {
        updates.push(`"SinhNhat" = $${counter++}`);
        values.push(sinhnhat);
        updateFields.SinhNhat = sinhnhat;
    }
    if (diachi) {
        updates.push(`"DiaChi" = $${counter++}`);
        values.push(diachi);
        updateFields.DiaChi = diachi;
    }

    if (updates.length > 0) {
        values.push(user.ID);
        const query = `UPDATE "KhachHang" SET ${updates.join(', ')} WHERE "ID" = $${counter}`;
        
        try {
            await db.query(query, values);
            
            // Lấy lại user sau update để update session cho chuẩn
            const userQuery = 'SELECT * FROM "KhachHang" WHERE "ID" = $1';
            const { rows } = await db.query(userQuery, [user.ID]);
            req.session.user = {
                ID: rows[0].ID,
                TenKH: rows[0].TenKH,
                Email: rows[0].Email,
                SoDu: rows[0].SoDu,
                GioiTinh: rows[0].GioiTinh,
                SinhNhat: rows[0].SinhNhat,
                SoDienThoai: rows[0].SoDienThoai,
                DiaChi: rows[0].DiaChi
            };

            res.json({ success: true, message: 'Cập nhật thông tin thành công', user: req.session.user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, message: 'Cập nhật thông tin thất bại' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Không có thông tin nào để cập nhật' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const query = 'SELECT * FROM "KhachHang" WHERE "ID" = $1';
        const { rows } = await db.query(query, [req.session.user.ID]);
        
        if (rows.length > 0) {
            // Loại bỏ password
            const profile = { ...rows[0] };
            delete profile.MatKhau;
            res.json({ success: true, user: profile });
        } else {
            res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
