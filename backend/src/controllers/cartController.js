const db = require('../config/db');

exports.getCart = async (req, res) => {
    const KhachHangID = req.session.user.ID;

    try {
        const query = `
            SELECT sp."ID" as "SanPhamID", gh."KhachHangID", sp."TenSP", sp."GiaGoc",
                   ROUND(sp."GiaGoc" * (1 - sp."GiaSale" / 100), 2) AS "GiaBan",
                   gh."SoLuong", sp."MoTaSP", sp."Anh"
            FROM "GioHang" gh
            JOIN "KhachHang" kh ON (gh."KhachHangID" = kh."ID")
            JOIN "SanPham" sp ON (sp."ID" = gh."SanPhamID")
            WHERE kh."ID" = $1 AND gh."Chuyen" = false;
        `;
        const { rows } = await db.query(query, [KhachHangID]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    const { productId } = req.body;
    const productIdInt = parseInt(productId, 10);
    if (isNaN(productIdInt)) {
        return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    const KhachHangID = req.session.user.ID;

    try {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng và CHƯA thanh toán không
        const checkQuery = `SELECT * FROM "GioHang" WHERE "KhachHangID" = $1 AND "SanPhamID" = $2 AND "Chuyen" = false;`;
        const checkResult = await db.query(checkQuery, [KhachHangID, productIdInt]);
        
        // Kiểm tra kho
        const stockResult = await db.query(`SELECT "SoLuongSP" FROM "SanPham" WHERE "ID" = $1`, [productIdInt]);
        if (stockResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.'});
        if (stockResult.rows[0].SoLuongSP <= 0) return res.status(400).json({ success: false, message: 'Sản phẩm đã hết hàng trong kho.'});

        if (checkResult.rows.length > 0) {
            const updateQuery = `
                UPDATE "GioHang" SET "SoLuong" = "SoLuong" + 1 
                WHERE "KhachHangID" = $1 AND "SanPhamID" = $2 AND "Chuyen" = false;
            `;
            await db.query(updateQuery, [KhachHangID, productIdInt]);
        } else {
            const insertQuery = `
                INSERT INTO "GioHang"("KhachHangID", "SanPhamID", "SoLuong", "Chuyen") 
                VALUES ($1, $2, 1, false);
            `;
            await db.query(insertQuery, [KhachHangID, productIdInt]);
        }

        res.json({ success: true, message: 'Sản phẩm đã được thêm vào giỏ hàng' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm vào giỏ hàng' });
    }
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const productIdInt = parseInt(productId, 10);
    
    if (isNaN(productIdInt)) {
        return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    const KhachHangID = req.session.user.ID;

    try {
        const query = `DELETE FROM "GioHang" WHERE "KhachHangID" = $1 AND "SanPhamID" = $2 AND "Chuyen" = false;`;
        await db.query(query, [KhachHangID, productIdInt]);
        res.json({ success: true, message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
    }
};

exports.checkout = async (req, res) => {
    const KhachHangID = req.session.user.ID;

    const client = await db.connect(); // Transaction begins
    try {
        await client.query('BEGIN');

        // Lấy tất cả hàng trong giỏ chưa giao
        const cartQuery = `SELECT * FROM "GioHang" WHERE "KhachHangID" = $1 AND "Chuyen" = false FOR UPDATE`;
        const cartItems = await client.query(cartQuery, [KhachHangID]);

        if (cartItems.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Giỏ hàng của bạn đang trống.' });
        }

        // Kiểm tra kho và trừ thủ công
        for (const item of cartItems.rows) {
            const prodRes = await client.query(`SELECT "SoLuongSP" FROM "SanPham" WHERE "ID" = $1 FOR UPDATE`, [item.SanPhamID]);
            const kho = prodRes.rows[0].SoLuongSP;

            if (kho < item.SoLuong) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: 'Có sản phẩm vượt quá số lượng tồn kho (Hết hàng).' });
            }

            // Trừ kho
            await client.query(`UPDATE "SanPham" SET "SoLuongSP" = "SoLuongSP" - $1 WHERE "ID" = $2`, [item.SoLuong, item.SanPhamID]);
        }

        // Chốt đơn
        await client.query(`UPDATE "GioHang" SET "Chuyen" = true WHERE "KhachHangID" = $1 AND "Chuyen" = false`, [KhachHangID]);
        
        await client.query('COMMIT');
        res.json({ success: true, message: 'Thanh toán đặt hàng thành công! Đơn hàng đang được điều phối.'});
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Checkout error:', error);
        res.status(500).json({ success: false, message: 'Gặp lỗi trong quá trình thanh toán.' });
    } finally {
        client.release();
    }
};

exports.getOrders = async (req, res) => {
    const KhachHangID = req.session.user.ID;

    try {
        const query = `
            SELECT gh."ID" as "MaDonHang", sp."TenSP", sp."Anh",
                   ROUND(sp."GiaGoc" * (1 - sp."GiaSale" / 100), 2) AS "GiaMua",
                   gh."SoLuong"
            FROM "GioHang" gh
            JOIN "SanPham" sp ON (sp."ID" = gh."SanPhamID")
            WHERE gh."KhachHangID" = $1 AND gh."Chuyen" = true
            ORDER BY gh."ID" DESC;
        `;
        const { rows } = await db.query(query, [KhachHangID]);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi tải lịch sử.'});
    }
};
