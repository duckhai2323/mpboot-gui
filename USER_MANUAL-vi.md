# Tải xuống
Ứng dụng (hoặc tệp cài đặt) có thể được tải xuống trên [Github Releases](https://github.com/aqaurius6666/mpboot-gui/releases).

Có ba phiên bản khác nhau cho Ubuntu, MacOS và Windows.
* Ubuntu: phần mở rộng `.AppImage`.
* MacOS: phần mở rộng `.dmg`.
* Windows: phần mở rộng `.exe`.

Vui lòng tải xuống phiên bản tương ứng với hệ điều hành của bạn.

# Cài đặt
## Ubuntu
* Tải xuống tệp có phần mở rộng `.AppImage` như đã đề cập trong [Tải xuống](#tải-xuống).
* Thay đổi chế độ của AppImage thành thực thi bằng cách chạy lệnh: ```chmod +x <đường dẫn đến tệp>```.
* Bây giờ bạn có thể nhấp đúp vào tệp AppImage để mở MPBootGUI hoặc mở từ dòng lệnh: ```<đường dẫn đến tệp>```.

## MacOS
* Tải xuống tệp có phần mở rộng `.dmg` như đã đề cập trong [Tải xuống](#tải-xuống).
* Cài đặt nó như bạn sẽ với bất kỳ cài đặt bình thường nào với phần mở rộng `.dmg` bằng cách kéo tệp vào thư mục Ứng dụng (Applications).
* Bạn không thể mở MPBootGUI bằng cách nhấp đúp vào biểu tượng ứng dụng từ Launchpad. Bạn chỉ có thể mở nó từ dòng lệnh: ```/Applications/MpbootGUI/Resources/MacOS/MpbootGUI```.
* Một thông báo cảnh báo bạn về an ninh sẽ hiện lên. Mở cài đặt Quyền riêng tư (Privacy) và cho phép MPBootGUI chạy.
* Bây giờ bạn có thể mở lại nó từ dòng lệnh: ```/Applications/MpbootGUI/Resources/MacOS/MpbootGUI```. 

## Windows
* Tải xuống tệp có phần mở rộng `.exe` như đã đề cập trong [Tải xuống](#tải-xuống).
* Nhấp đúp vào tệp cài đặt để bắt đầu quá trình cài đặt.
* Kích hoạt chế độ Nhà phát triển bằng cách tìm kiếm “Chế độ Nhà phát triển” (Developer mode) trên Start menu và chuyển nó thành bật.
* Bạn có thể mở nó bằng cách nhấp đúp vào biểu tượng của nó.

Ubuntu và MacOS    

# Yêu cầu
MPBootGUI cần công cụ `mpboot` để hoạt động và yêu cầu người dùng tự cài đặt `mpboot` và thêm nó vào biến PATH của hệ điều hành.
Bạn có thể cài đặt mpboot không chính thức từ [Phát hành Github của tôi](https://github.com/aqaurius6666/mpboot/releases)

Dưới đây là các bước để cài đặt mpboot trên 3 hệ điều hành chính.
## Ubuntu and MacOS
* Tải xuống phiên bản mpboot tương ứng với hệ điều hành của bạn.
* Giải nén tệp bằng cách nhấp đúp vào nó hoặc chạy lệnh ```unzip <đường dẫn đến tệp>```. Tệp thực thi mpboot sẽ ở trong cùng thư mục với tệp zip.
* Di chuyển tệp thực thi mpboot vào thư mục `/usr/local/bin` bằng cách chạy lệnh ```sudo mv ./mpboot /usr/local/bin/mpboot```.
* Bạn có thể kiểm tra việc cài đặt bằng cách chạy ```mpboot --help```.

     

 
## Windows
* Tải xuống phiên bản mpboot tương ứng với hệ điều hành của bạn.
* Giải nén tệp bằng cách sử dụng 7z.
* Sao chép đường dẫn tuyệt đối của thư mục đầu ra đã giải nén.
* Mở cài đặt biến môi trường và chỉnh sửa biến PATH bằng cách dán đường dẫn thư mục đầu ra đã giải nén và lưu các thay đổi.
* Mở một cửa sổ terminal mới và chạy ```mpboot --help``` để kiểm tra việc cài đặt.


## Hướng dẫn sử dụng 
Bạn có thể tải xuống [example.phy](./example.phy) để kiểm tra

1. Bắt đầu bằng cách tạo một không gian làm việc mới. Nhập đường dẫn thư mục không gian làm việc, tên không gian làm việc và thêm dữ liệu đầu vào cho không gian làm việc (example.phy). 
2. Chọn example.phy ở phía bên trái và nhấp vào nút Chạy ở phía bên phải 
3. Nhật ký của việc thực thi sẽ được hiển thị ở giữa và tệp cây kết quả sẽ được trực quan hóa. 
4. Sau khi chạy một vài lần thực thi, bạn có thể duyệt các lần thực thi cũ hơn bằng cách nhấp vào thư mục thực thi ở phía bên trái. Sử dụng các nút Lùi và Tiến để duyệt các lần thực thi.

# Chú ý
MPBootGUI hiện tại không được ký bởi bất kỳ chứng chỉ tin cậy nào. Hệ điều hành có thể báo cáo về ứng dụng có hại hoặc nội dung không tin cậy. Vui lòng kiểm tra kỹ nguồn của báo cáo. Đừng hoảng loạn nếu nó là nội dung của MPBootGUI.

