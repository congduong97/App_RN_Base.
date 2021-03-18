Các phần sửa đổi: Pro 1.0.2

- Sửa UI phần chọn ngày tháng IOS 14 về như cũ.
- Thay key google-map IOS và Android.
- Sửa lỗi mất ảnh IOS 14.
- Chức năng disable account trong mypage.
- Tự động xóa cookie khi tài khoản bị vô hiệu hóa.
- Sửa 1 số text và css theo yêu cầu của khách.

code push dev command:
appcenter codepush release-react -a Komeda-Co./Komeda-Android -d Staging -m

appcenter codepush release-react -a Komeda-Co./Komeda-iOS -d Staging -m

code push pro command:
appcenter codepush release-react -a Komeda-Co./Komeda-iOS -d Production -m
appcenter codepush release-react -a Komeda-Co./Komeda-Android -d Production -m
