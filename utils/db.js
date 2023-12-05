require('dotenv').config();

const pgp = require('pg-promise')({
    capSQL: true
});

const connectString = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
}


const db = pgp(connectString);
module.exports = {
    initDatabase: async function initDatabase() {
        try {
            // Kiểm tra xem database đã tồn tại chưa
            const databaseExists = await db.oneOrNone(
                'SELECT 1 FROM pg_database WHERE datname = $1',
                process.env.DB_NAME
            );

            if (!databaseExists) {
                // Tạo mới database
                await db.none(`CREATE DATABASE ${process.env.DB_NAME}`);
                console.log(`Database ${process.env.DB_NAME} created.`);

                // Kết nối đến database mới tạo
                db.$pool.options.database = process.env.DB_NAME;
                await db.connect();

                // create table inside the new database
                await db.none(`

                    CREATE TABLE KHACHHANG(
                        Sdt VARCHAR(11) PRIMARY KEY,
                        HoTen VARCHAR(50),
                        NgaySinh DATE,
                        DiaChi VARCHAR(200)
                    );

                    CREATE TABLE KHACHHANGCOTAIKHOAN(
                        TenDangNhap VARCHAR(11) PRIMARY KEY,
                        MatKhau VARCHAR(20),
                        FOREIGN KEY (TenDangNhap) REFERENCES KHACHHANG(Sdt)
                    );

                    CREATE TABLE NHASI(
                        MaNhaSi VARCHAR(10) PRIMARY KEY,
                        HoTen VARCHAR(50),
                        NgaySinh DATE,
                        DiaChi VARCHAR(200),
                        Sdt VARCHAR(11),
                        MatKhau VARCHAR(20)
                    );

                    CREATE TABLE LICHTRUC(
                        Ngay DATE,
                        ThuTuCa INT,
                        GioBatDau TIME,
                        GioKetThuc TIME,
                        PRIMARY KEY(Ngay, ThuTuCa)
                    );

                    CREATE TABLE LICHCANHAN(
                        MaNhaSi VARCHAR(10),
                        Ngay DATE,
                        ThuTuCa INT,
                        TrangThai VARCHAR(20),
                        PRIMARY KEY(MaNhaSi, Ngay, ThuTuCa),
                        FOREIGN KEY (MaNhaSi) REFERENCES NHASI(MaNhaSi),
                        FOREIGN KEY (Ngay, ThuTuCa) REFERENCES LICHTRUC(Ngay, ThuTuCa)
                    );

                    CREATE TABLE PHIEUHEN(
                        MaPhieu VARCHAR(10) PRIMARY KEY,
                        NhaSiKham VARCHAR(10),
                        Ngay DATE,
                        ThuTuCa INT,
                        SdtKhachHang VARCHAR(11),
                        FOREIGN KEY (SdtKhachHang) REFERENCES KHACHHANG(Sdt),
                        FOREIGN KEY (NhaSiKham, Ngay, ThuTuCa) REFERENCES LICHCANHAN(MaNhaSi, Ngay, ThuTuCa)
                    );

                    CREATE TABLE BENHAN(
                        SdtKhachHang VARCHAR(11),
                        MaBenhAn VARCHAR(10),
                        MaPhieuHen VARCHAR(10),
                        PRIMARY KEY(SdtKhachHang, MaBenhAn),
                        FOREIGN KEY (SdtKhachHang) REFERENCES KHACHHANG(Sdt),
                        FOREIGN KEY (MaPhieuHen) REFERENCES PHIEUHEN(MaPhieu)
                    );

                    CREATE TABLE THUOC(
                        MaThuoc VARCHAR(10) PRIMARY KEY,
                        TenThuoc VARCHAR(50),
                        DonViTinh VARCHAR(20),
                        ChiDinh VARCHAR(200),
                        SoLuongTonKho INT CHECK (SoLuongTonKho >= 0), 
                        NgayHetHan DATE
                    );

                    CREATE TABLE CHITIETDONTHUOC(
                        MaThuoc VARCHAR(10),
                        SdtKhachHang VARCHAR(11),
                        MaBenhAn VARCHAR(10),
                        SoLuong INT CHECK (SoLuong > 0),
                        PRIMARY KEY(MaThuoc, SdtKhachHang, MaBenhAn),
                        FOREIGN KEY (MaThuoc) REFERENCES THUOC(MaThuoc),
                        FOREIGN KEY (SdtKhachHang, MaBenhAn) REFERENCES BENHAN(SdtKhachHang, MaBenhAn)
                    );

                    CREATE TABLE DICHVU(
                        MaDichVu VARCHAR(10) PRIMARY KEY,
                        TenDichVu VARCHAR(50),
                        PhiDichVu FLOAT
                    );

                    CREATE TABLE CHITIETDICHVU(
                        MaDichVu VARCHAR(10),
                        SdtKhachHang VARCHAR(11),
                        MaBenhAn VARCHAR(10),
                        PRIMARY KEY(MaDichVu, SdtKhachHang, MaBenhAn),
                        FOREIGN KEY (MaDichVu) REFERENCES DICHVU(MaDichVu),
                        FOREIGN KEY (SdtKhachHang, MaBenhAn) REFERENCES BENHAN(SdtKhachHang, MaBenhAn)
                    );

                    CREATE TABLE HOADON(
                        MaHoaDon VARCHAR(10) PRIMARY KEY,
                        MaBenhAn VARCHAR(10),
                        SdtKhachHang VARCHAR(11),
                        TongTien FLOAT,
                        FOREIGN KEY (SdtKhachHang, MaBenhAn) REFERENCES BENHAN(SdtKhachHang, MaBenhAn)
                    );

                    CREATE TABLE NHANVIEN(
                        MaNhanVien VARCHAR(10) PRIMARY KEY,
                        HoTen VARCHAR(50),
                        NgaySinh DATE,
                        DiaChi VARCHAR(200),
                        Sdt VARCHAR(11),
                        MatKhau VARCHAR(20)
                    );

                    -- Triggers

                    CREATE OR REPLACE FUNCTION update_tongtien_hoadon()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        UPDATE HOADON
                        SET TongTien = (
                            SELECT SUM(PhiDichVu) FROM CHITIETDICHVU ctdv
                            JOIN DICHVU dv ON ctdv.MaDichVu = dv.MaDichVu
                            WHERE NEW.MaBenhAn = ctdv.MaBenhAn AND NEW.SdtKhachHang = ctdv.SdtKhachHang
                        );
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgHoaDon
                    AFTER INSERT OR UPDATE ON PHIEUHEN
                    FOR EACH ROW
                    EXECUTE FUNCTION update_tongtien_hoadon();

                    CREATE OR REPLACE FUNCTION check_giobatdau_gioketthuc()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF NEW.GioBatDau >= NEW.GioKetThuc THEN
                            RAISE EXCEPTION 'Giờ bắt đầu phải trước giờ kết thúc';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgGioBD_GioKT
                    BEFORE INSERT OR UPDATE ON LICHTRUC
                    FOR EACH ROW
                    EXECUTE FUNCTION check_giobatdau_gioketthuc();

                    CREATE OR REPLACE FUNCTION check_tuoi_bacsi()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF DATE_PART('year', AGE(NEW.NgaySinh, CURRENT_DATE)) < 18 THEN
                            RAISE EXCEPTION 'Bác sĩ phải đủ 18 tuổi trở lên';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgTuoiBacSi
                    BEFORE INSERT OR UPDATE ON NHASI
                    FOR EACH ROW
                    EXECUTE FUNCTION check_tuoi_bacsi();

                    CREATE OR REPLACE FUNCTION check_tuoi_nhanvien()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF DATE_PART('year', AGE(NEW.NgaySinh, CURRENT_DATE)) < 18 THEN
                            RAISE EXCEPTION 'Nhân viên phải đủ 18 tuổi trở lên';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgTuoiNhanVien
                    BEFORE INSERT OR UPDATE ON NHANVIEN
                    FOR EACH ROW
                    EXECUTE FUNCTION check_tuoi_nhanvien();

                    CREATE OR REPLACE FUNCTION check_sodienthoai()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        IF LENGTH(NEW.Sdt) <> 10 THEN
                            RAISE EXCEPTION 'Số điện thoại phải có 10 chữ số';
                        END IF;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgSoDienThoai
                    BEFORE INSERT OR UPDATE ON KHACHHANG
                    FOR EACH ROW
                    EXECUTE FUNCTION check_sodienthoai();

                    CREATE OR REPLACE FUNCTION update_trangthai_lichcanhan()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        UPDATE LICHCANHAN
                        SET TrangThai = 'Bận'
                        WHERE MaNhaSi = NEW.NhaSiKham AND Ngay = NEW.Ngay AND ThuTuCa = NEW.ThuTuCa;
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgThemPhieuHen
                    AFTER INSERT ON PHIEUHEN
                    FOR EACH ROW
                    EXECUTE FUNCTION update_trangthai_lichcanhan();

                    CREATE OR REPLACE FUNCTION update_trangthai_lichcanhan_delete()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        UPDATE LICHCANHAN
                        SET TrangThai = 'Rảnh'
                        WHERE MaNhaSi = OLD.NhaSiKham AND Ngay = OLD.Ngay AND ThuTuCa = OLD.ThuTuCa;
                        RETURN OLD;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgXoaPhieuHen
                    AFTER DELETE ON PHIEUHEN
                    FOR EACH ROW
                    EXECUTE FUNCTION update_trangthai_lichcanhan_delete();

                    CREATE OR REPLACE FUNCTION update_trangthai_lichcanhan_update()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        UPDATE LICHCANHAN
                        SET TrangThai = 'Bận'
                        WHERE MaNhaSi = NEW.NhaSiKham AND Ngay = NEW.Ngay AND ThuTuCa = NEW.ThuTuCa;
                        
                        UPDATE LICHCANHAN
                        SET TrangThai = 'Rảnh'
                        WHERE MaNhaSi = OLD.NhaSiKham AND Ngay = OLD.Ngay AND ThuTuCa = OLD.ThuTuCa;
                        
                        RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;

                    CREATE TRIGGER trgSuaPhieuHen
                    AFTER UPDATE ON PHIEUHEN
                    FOR EACH ROW
                    EXECUTE FUNCTION update_trangthai_lichcanhan_update();

                    -- Roles and Permissions

                    CREATE ROLE NhaSi;

                    GRANT SELECT, UPDATE ON TABLE NHASI TO NhaSi;
                    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE LICHCANHAN TO NhaSi;
                    GRANT SELECT ON TABLE LICHTRUC TO NhaSi;
                    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE BENHAN TO NhaSi;
                    GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE CHITIETDONTHUOC TO NhaSi;
                    GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE CHITIETDICHVU TO NhaSi;
                    GRANT SELECT ON TABLE THUOC TO NhaSi;
                    GRANT SELECT ON TABLE DICHVU TO NhaSi;
                    GRANT SELECT ON TABLE KHACHHANG TO NhaSi;
                    GRANT SELECT ON TABLE PHIEUHEN TO NhaSi;

                    CREATE ROLE KhachHang;

                    GRANT SELECT, UPDATE ON TABLE KHACHHANG TO KhachHang;
                    GRANT SELECT, UPDATE ON TABLE KHACHHANGCOTAIKHOAN TO KhachHang;
                    GRANT SELECT ON TABLE BENHAN TO KhachHang;
                    GRANT INSERT ON TABLE PHIEUHEN TO KhachHang;

                    -- Drop roles if needed
                    -- DROP ROLE NhaSi;
                    -- DROP ROLE KhachHang;

                `);

                console.log(`Tables created inside '${process.env.DB_NAME}' database.`);
                console.log(`Data imported into '${process.env.DB_NAME}' database.`);
            }
            else {
                db.$pool.options.database = process.env.DB_NAME;
                await db.connect();
                console.log(`Database '${process.env.DB_NAME}' already exists. Cannot create database.`);
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    db: db,
};

