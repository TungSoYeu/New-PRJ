const db = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const query = `
            SELECT "ID", "TenSP", "Anh", "GiaGoc", "GiaSale", "SoLuongSP", "MoTaSP",
                   ROUND("GiaGoc" * (1 - "GiaSale" / 100), 2) AS "GiaBan"
            FROM "SanPham"
        `;
        const result = await db.query(query);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getSales = async (req, res) => {
    try {
        const query = `
            SELECT "ID", "TenSP", "Anh", "GiaGoc", "GiaSale", "SoLuongSP", "MoTaSP",
                   ROUND("GiaGoc" * (1 - "GiaSale" / 100), 2) AS "GiaBan"
            FROM "SanPham"
            WHERE "GiaSale" > 25
        `;
        const result = await db.query(query);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching sale products:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.search = async (req, res) => {
    const searchQuery = req.query.q || '';
    try {
        const query = `
            SELECT "ID", "TenSP", "Anh", "GiaGoc", "GiaSale", "SoLuongSP", "MoTaSP",
                   ROUND("GiaGoc" * (1 - "GiaSale" / 100), 2) AS "GiaBan"
            FROM "SanPham"
            WHERE "TenSP" ILIKE $1
        `;
        const result = await db.query(query, [`%${searchQuery}%`]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT "Hang" FROM "SanPham" WHERE "Hang" IS NOT NULL ORDER BY "Hang";
        `;
        const result = await db.query(query);
        const brands = result.rows.map(r => r.Hang);
        res.json({ success: true, data: brands });
    } catch (err) {
        console.error('Error fetching brands:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getByBrand = async (req, res) => {
    try {
        const { brand } = req.params;
        const query = `
            SELECT "ID", "TenSP", "Anh", "GiaGoc", "GiaSale", "SoLuongSP", "MoTaSP", "Hang",
                   ROUND("GiaGoc" * (1 - "GiaSale" / 100), 2) AS "GiaBan"
            FROM "SanPham"
            WHERE "Hang" = $1
        `;
        const result = await db.query(query, [brand]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching products by brand:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
