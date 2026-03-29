require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function ensureDatabaseAndSeed() {
  const adminClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Kết nối vào default DB trước
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await adminClient.connect();
    
    // Kiểm tra xem database store đã tồn tại chưa
    const res = await adminClient.query("SELECT 1 FROM pg_database WHERE datname = 'store'");
    if (res.rowCount === 0) {
      console.log('Database "store" chưa tồn tại, đang tạo mới...');
      await adminClient.query('CREATE DATABASE store');
      console.log('Đã tạo thành công cở sở dữ liệu "store".');
    } else {
       console.log('Database "store" đã tồn tại.');
    }
  } catch (err) {
    console.error('Lỗi khi kiểm tra/tạo database:', err);
    return;
  } finally {
    await adminClient.end();
  }

  // Chạy seed data vào DB 'store'
  const storeClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'store',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    const sqlPath = path.join(__dirname, '../database/schema.sql');
    const sqlString = fs.readFileSync(sqlPath, 'utf8');

    await storeClient.connect();
    console.log('Đã kết nối vào Database "store"...');

    console.log('Đang chạy file schema.sql để khởi tạo bảng và dữ liệu...');
    await storeClient.query(sqlString);
    console.log('✅ Khởi tạo CSDL hoàn tất!');
  } catch (err) {
    console.error('Lỗi khi chạy file SQL:', err);
  } finally {
    await storeClient.end();
  }
}

ensureDatabaseAndSeed();
