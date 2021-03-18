Bản build mới: bản Pro.
versionCode 5
versionName "1.0.3"

IOS :
1.0.3 - Version 1 (28/10/2020):

Các phần sửa đổi:
1:Logic push notification.
2:Sửa lỗi mất ảnh IOS 14.
3:Sửa UI chọn lịch date-time-picker như cũ.
4:Sửa thư viện splash screen sang boot-splash.
5:Xử lí hiển thị ảnh barcode và ảnh chứng nhận thành viên ở màn hình mất mạng và maintain như kusuri.
6:Thay key youtube
Android: AIzaSyBNB3tf_56-Ok93Fhdht5zK-\_5LfYDpK3A
IOS: AIzaSyDQVVqyFDSvbNqjTcwAfNAFPa9ifzAI3Ws
7: Sửa lỗi vừa ấn vừa vuốt màn app start.

08032065556 shinto10

Code Push YoneYama DEV:

appcenter codepush release-react -a Yoneyama/Yoneyama-IOS -d Staging -m
appcenter codepush release-react -a Yoneyama/Yoneyama-Android -d Staging -m

Dev

- 1.0.6 thay đổi cấu hình firebase.
- Thay đổi cấu hình applicationIdSuffix ".dev"

Pro 1.0.4 (10/11/2020) V6:
Sửa lỗi crash app hết hạn token trắng màn hình Home.

Production (08/12/2020):
1.0.4 (1) Chỉ đẩy code push:
1: API getAppData gắn thêm deviceId ;
2: Sửa lỗi strong pass ở textInput đăng kí ;
3: Lỗi code 500 không cho phép hiển thị form logout rồi thoát tài khoản người dùng ra ngoài.
