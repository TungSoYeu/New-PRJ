DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE "KhachHang" (
    "ID" SERIAL PRIMARY KEY,
    "TenKH" VARCHAR(255),
    "SoDu" INT DEFAULT 0,
    "Email" VARCHAR(255),
    "MatKhau" VARCHAR(255),
    "GioiTinh" VARCHAR(5) DEFAULT NULL,
    "SinhNhat" DATE DEFAULT NULL,
    "SoDienThoai" VARCHAR(15) DEFAULT NULL,
    "DiaChi" TEXT DEFAULT NULL
);

insert into "KhachHang"("TenKH","Email","MatKhau") values
	('admin','admin','admin'),
	('Hoang Cong Tung','hct@gmail.com','1111111');

CREATE TABLE "NguoiDung" (
    "ID" SERIAL PRIMARY KEY,
    "TenND" VARCHAR(255),
    "SoDienThoai" VARCHAR(20),
    "Mail" VARCHAR(255),
	"MatKhau" VARCHAR(255)
);

CREATE TABLE "SanPham" (
    "ID" SERIAL PRIMARY KEY,
    "TenSP" VARCHAR(255),
    "Anh" TEXT,
    "GiaGoc" DECIMAL(10, 2),
    "GiaSale" DECIMAL(10, 2),
    "SoLuongSP" INT,
    "MoTaSP" TEXT,
    "NguoiDungID" INT  REFERENCES "NguoiDung"("ID")
);

insert into "SanPham" ("TenSP","GiaSale","GiaGoc","SoLuongSP","MoTaSP","Anh")
	values ('iPhone 13 128GB | Chính hãng VN/A',9,18.99,20,'iPhone 13 128GB | Chính hãng VN/A','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13_2_.png'),
	('iPhone 15 Pro Max 256GB | Chính hãng VN/A',26,34.99,20,'iPhone 15 Pro Max 256GB | Chính hãng VN/A','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png'),
	('iPhone 14 Pro Max 128GB | Chính hãng VN/A',11,29.99,20,'iPhone 14 Pro Max 128GB | Chính hãng VN/A','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro_2__5.png'),
	('iPhone 14 128GB  | Chính hãng VN/A',23,22.99,20,'iPhone 14 128GB  | Chính hãng VN/A','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_1.png'),
	('Samsung Galaxy S23 Ultra 256GB',22,31.99,20,'Samsung Galaxy S23 Ultra 256GB','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-s23-ulatra_2__1.png'),
	('Samsung Galaxy S24 Ultra 12GB 256GB',17,33.99,20,'Samsung Galaxy S24 Ultra 12GB 256GB','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png'),
	('Samsung Galaxy Z Flip5 256GB | Chỉ có tại SHOP_PTT',35,25.99,20,'Samsung Galaxy Z Flip5 256GB','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-z-lip5_3_.png'),
	('Samsung Galaxy Z Fold5 12GB 256GB| Chỉ có tại SHOP_PTT',29,40.99,20,'Samsung Galaxy Z Fold5 12GB 256GB','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-z-fold5_2_.png'),
	('OPPO Reno11 F 5G 8GB 256GB | Chỉ có tại SHOP_PTT',35,8.99,20,'OPPO Reno11 F 5G 8GB 256GB','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-oppo-reno-11-f-2.png'),
	('Xiaomi 13T Pro 5G (12GB - 512GB) | Chỉ có tại SHOP_PTT',13,16.99,20,'Xiaomi 13T Pro 5G (12GB - 512GB)','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-13-pro-thumb-xanh-la9.jpg'),
	('Xiaomi 14 Ultra 5G (16GB 512GB)| Chỉ có tại SHOP_PTT',28,32.99,20,'Xiaomi 14 Ultra 5G (16GB 512GB)','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-ultra_3.png'),
	('Xiaomi 14 (12GB 256GB)  | Chỉ có tại SHOP_PTT',9,22.99,20,'Xiaomi 14 (12GB 256GB)','https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-pre-xanh-la.png');

CREATE TABLE "NhanVienGH" (
    "ID" SERIAL PRIMARY KEY,
    "TenNV" VARCHAR(255),
	"DiaChi" TEXT,
    "SDT" VARCHAR(20)
);

INSERT INTO "NhanVienGH" ("TenNV", "DiaChi", "SDT") VALUES
    ('Nguyen Van A', '123 Duong ABC, TP HCM', '0123456789'),
    ('Tran Thi B', '456 Duong XYZ, Ha Noi', '0987654321'),
	('Hoang Thi C','789 Canh DEF Ha Tinh','08752748242');

CREATE TABLE "GioHang" (
    "ID" serial primary key,
    "KhachHangID" INT,
    "SanPhamID" INT,
    "SoLuong" INT,
    "Chuyen" BOOLEAN,
    "NhanVienGHID" INT,
    FOREIGN KEY ("KhachHangID") REFERENCES "KhachHang"("ID"),
    FOREIGN KEY ("SanPhamID") REFERENCES "SanPham"("ID"),
    FOREIGN KEY ("NhanVienGHID") REFERENCES "NhanVienGH"("ID")
);

CREATE OR REPLACE VIEW "SanPhamBan" AS 
SELECT *,
       ROUND("GiaGoc" * (1 - "GiaSale" / 100), 2) AS "GiaBan"
FROM "SanPham";

CREATE OR REPLACE VIEW "SanPhamSale" AS 
SELECT *,
       ROUND("GiaGoc" * (1 - "GiaSale" / 100), 2) AS "GiaBan"
FROM "SanPham" sp
WHERE sp."GiaSale" > 25;
