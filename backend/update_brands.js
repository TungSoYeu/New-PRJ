require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'store',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function updateBrands() {
  try {
    await client.connect();
    console.log('Đã kết nối DB. Đang cập nhật cột Hang...');

    // Thêm cột Hang nếu chưa tồn tại
    try {
        await client.query(`ALTER TABLE "SanPham" ADD COLUMN "Hang" VARCHAR(50);`);
        console.log('Thêm cột Hang thành công.');
    } catch(err) {
        if (err.code === '42701') {
             console.log('Cột Hang đã tồn tại, chèn dữ liệu tiếp...');
        } else {
             throw err;
        }
    }

    // Gán dữ liệu dựa trên TenSP
    await client.query(`UPDATE "SanPham" SET "Hang" = 'Apple' WHERE "TenSP" ILIKE '%iPhone%';`);
    await client.query(`UPDATE "SanPham" SET "Hang" = 'Samsung' WHERE "TenSP" ILIKE '%Samsung%' OR "TenSP" ILIKE '%Galaxy%';`);
    await client.query(`UPDATE "SanPham" SET "Hang" = 'Xiaomi' WHERE "TenSP" ILIKE '%Xiaomi%';`);
    await client.query(`UPDATE "SanPham" SET "Hang" = 'OPPO' WHERE "TenSP" ILIKE '%OPPO%';`);

    console.log('Cập nhật dữ liệu Hãng thanh công!');
  } catch (err) {
    console.error('Lỗi khi cập nhật:', err);
  } finally {
    await client.end();
  }
}

updateBrands();
