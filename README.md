# DBMS_Project

- Pull về ròi thì mn chuột phải folder gốc -> open in intergrated terminal -> gõ npm install
- Dùng SQL auth.
- File .env: sửa DB_HOST (nếu chạy bị lỗi, chứ máy tui chạy bth :))) )
- Bật port 1433 (https://kienthuclaptrinh.vn/2012/07/24/7-buoc-de-mo-port-1433-cho-ms-sql-server/). Lưu ý: port 1434 chỉ dùng cho sysadmin nên sẽ không thể login cho các login với quyền bị giới hạn (https://dba.stackexchange.com/questions/320070/cannot-connect-to-sql-server-using-local-127-0-0-1-address-unless-the-login-user). Bật xong restart lại SQL services nha
- Để chạy: chuột phải folder gốc -> open in intergrated terminal -> gõ npm start -> http://localhost:3000/ trên chrome
- Ý tưởng routing hiện tại:
![alt text](https://github.com/tutam1232/DBMS_Project/blob/main/routing.png?raw=true)

- Note: sesssion chứa:
    + resolve: cho biết đang ở demo resolve hay conflict (true: resolve, false: conflict)
    + user: username
    + userType: loại user (KH, NS, QTV,,...)
    + config: lưu config obj cho từng user để connect db
- Nếu server của mn là tên máy (vd như tam/tam123) mà lưu trong DB_HOST ở file .env chạy ko dc (lỗi could not sequence) thì đổi DB_HOST thành localhost/tam123 nha
