import {
  APP_ID,
  URL_DOMAIN,
  DEVICE_ID,
  COMPANY_ID,
  TYPE_PLAFORM,
  PRIVATE_KEY_DEVICE_ID,
  isIos,
  versionApp,
} from './System';

const Api = {
  //API đăng kí ID thiết bị:
  registrationDeviceID: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/device/pushDeviceId?companyId=${COMPANY_ID}&deviceId=${DEVICE_ID}&deviceType=${TYPE_PLAFORM}&privateKey=${PRIVATE_KEY_DEVICE_ID}`;
  },

  //Thay đổi email:
  changEmail: (oldEmail, newEmail) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/changeEmail?oldEmail=${oldEmail}&newEmail=${newEmail}`;
  },
  //Thay đổi mật khẩu myPage:
  changePassWordMyPageAPI: (oldPassword, newPassword) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/changePassword?oldPassword=${oldPassword}&newPassword=${newPassword}`;
  },
  //Thay đổi mật khẩu mypage:
  changePassWord: (oldPassword, newPassword) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/changePassword?oldPassword=${oldPassword}&newPassword=${newPassword}`;
  },
  //Update thông ti cá nhân trong myPage:
  updateInfoMyPageAPI: (birthday, gender, zipCode) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/changeInfo?${
      birthday ? `&birthday=${birthday}` : ''
    }&gender=${gender}${zipCode ? `&zipCode=${zipCode}` : ''}`;
  },
  //API đăng kí token Push:
  registrationDeviceToken: (deviceToken) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/device/pushDeviceToken?deviceId=${DEVICE_ID}&deviceToken=${deviceToken}&privateKey=${PRIVATE_KEY_DEVICE_ID}`;
  },

  //API lấy cấu hình App:
  getAppData: (appVersion) => {
    const OS = isIos ? 'ios' : 'android';
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/app/getAppData/${appVersion}?typeOs=${OS}&versionApp=${versionApp}&deviceId=${DEVICE_ID}`;
  },

  //API lấy danh sách slider Home :
  getHomeSlider: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/news/listForHome?deviceId=${DEVICE_ID}`;
  },
  //API lấy danh sách ảnh Slide home:
  openItemNews: (newsId) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/news/countView?deviceId=${DEVICE_ID}&newsId=${newsId}`;
  },
  openStamps: (stapmId) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/stamp/detail/${stapmId}?deviceId=${DEVICE_ID}`;
  },
  getNewsList: (size, page) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/news/listAll?size=${size}&deviceId=${DEVICE_ID}&page=${page}`;
  },
  //API lấy danh sách notice Home :
  getHomeNotice: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/pushNotification/getLatestNotification?deviceId=${DEVICE_ID}&typeScreen=LIST_PUSH`;
  },

  //API lấy điều khoản sử dụng (Cái này hiện tại không dùng mà lấy policy ở API getAppData):
  getPolicy: () => {
    return `${URL_DOMAIN}/api/v1/web/${APP_ID}/term/detail`;
  },

  //Kiểm tra server đang có bảo trì không:
  checkVersion: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/app/checkVersionApp`;
  },

  //Lấy danh sách push:
  getPushNotification: (page, size) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/pushNotification/list-mobile?size=${size}&deviceId=${DEVICE_ID}&page=${page}&typeScreen=LIST_PUSH`;
  },

  //Lấy detail Push:
  openPushNotiItem: (pushNotiId) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/pushNotification/detail/${pushNotiId}?deviceId=${DEVICE_ID}`;
  },

  //(Chưa dùng)
  getDataCoupon: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/coupon/listForMobile?deviceId=${DEVICE_ID}`;
  },
  howToUse: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/instruction`;
  },
  //Lấy danh sách DropDown Store:
  getListCityAndDistrictAPI: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/store/getListCityAndDistrict`;
  },

  //(Chưa dùng)
  useCoupon: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/coupon/use`;
  },

  //(Chưa dùng)
  useCouponInDetail: (couponId) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/coupon/detail/${couponId}?deviceId=${DEVICE_ID}`;
  },
  disableAccount: (email, pass) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/disableAccount?email=${email}&password=${pass}`;
  },
  //API Đăng kí tài khoản:
  register: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/register`;
  },

  //API kiểm tra số điện thoại đã tồn tại hay chưa:
  validateEmail: (userName) => {
    return `${URL_DOMAIN}/api/v1/app/{appId}/member/validateEmail?email=${userName}`;
  },
  removeLinkingCard: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/deleteCardInfo`;
  },

  //API kiểm tra validate Zipcode:
  validateZipCodeAPI: (zipCode) => {
    return `${URL_DOMAIN}/api/v1/zipCode/validate?zipCode=${zipCode}`;
  },

  //Đăng nhập tài khoản:
  login: () => {
    console.log(`${URL_DOMAIN}/login`);
    return `${URL_DOMAIN}/login`;
  },

  //Lấy token mới khi hết hạn token:
  getAccessToken: (refreshToken) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/getAccessToken?refreshToken=${refreshToken}`;
  },

  //Lấy danh mục checkbox sở thích:
  listFavoriteCategoryRegistrationUser: () => {
    return `${URL_DOMAIN}/api/v1/app/favoriteCategory/listMobile`;
  },

  //Đọc thông báo thường:
  readNotiAPI: (notificationId) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/notification/detail/${notificationId}?deviceId=${DEVICE_ID}`;
  },
  getBalanceAndPoint: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/getBalanceAndPoint`;
  },

  //Đăng kí người dùng:
  registration_Member: (
    phoneNumber,
    password,
    gender,
    birthday,
    zipCode,
    listFavoriteCategory,
  ) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/register?phoneNumber=${phoneNumber}&password=${password}${
      gender ? `&currentFacilityId=${gender}` : ''
    }${birthday ? `&currentFacilityId=${birthday}` : ''}${
      zipCode ? `&currentFacilityId=${zipCode}` : ''
    }${
      listFavoriteCategory ? `&currentFacilityId=${listFavoriteCategory}` : ''
    }`;
  },
  //API kích hoạt mã OTP:
  activeOTP: (OTP, userName, otpType) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/confirmOTPCode?otpCode=${OTP}&otpType=${otpType}&email=${userName}`;
  },

  //Đổi mật khẩu:
  setNewPasswordApp: (newPass, email, OTP) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/setPasswordForApp?otpCode=${OTP}&email=${email}&newPassword=${newPass}`;
  },

  //Lấy thông tin người dùng trong MyPage:
  getInfoMyPage: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/getInformationMyPage`;
  },
  //Liên kết thẻ thành viên:
  linkingCard: (memberCode, pinCode) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/addCardInfo?memberCode=${memberCode}&pinCode=${pinCode}`;
  },
  //API chứng nhận thành viên:
  getCertification: (memberCode, pinCode) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/addCardInfo?memberCode=${memberCode}&pinCode=${pinCode}`;
  },
  //Chứng chỉ thành viên:
  getCertificationMemberAPI: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/certification`;
  },
  //API lấy danh sách cửa hàng:
  getListStore: (size, page, latitude, longitude, keyword) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/store/getListStore?size=${size}&page=${page}${
      latitude ? `&latitude=${latitude}` : ''
    }${longitude ? `&longitude=${longitude}` : ''}${
      keyword ? `&keyword=${keyword}` : ''
    }`;
  },

  //Lấy danh sách thông báo thường:
  getListNotificationAll: (size, page) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/stamp/all?&size=${size}&deviceId=${DEVICE_ID}&page=${page}&typeScreen=LIST_NOTIFICATION`;
  },
  // Lấy số thông báo trả về:
  getNumberNewNotification: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/pushNotification/countNumberNewNotifications?deviceId=${DEVICE_ID}`;
  },
  //Lấy danh sách video:
  getListVideo: (page, size) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/video/list?page=${page}&size=${size}`;
  },

  //Lấy chi tiết thông báo thường:
  detailNoti: (notificationId) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/notification/detail/${notificationId}?deviceId=${DEVICE_ID}`;
  },

  //Lấy danh sách câu hỏi tường gặp:
  getListQuestions: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/appQuestion/list`;
  },

  //API quên mật khẩu:
  forgotPasswordApp: (email) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/forgotPasswordForApp?email=${email}`;
  },

  //Gửi lại API đăng kí tài khoản :
  resentOTP: (otpType, email) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/reSendOTPMessage?otpType=${otpType}&email=${email}`;
  },

  //API theo dõi cửa hàng.
  setFollowStore: (storeCode) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/store/setBookmarked?storeCode=${storeCode}`;
  },

  //Lấy danh sách cửa hàng đã theo dõi:
  getListBookMarkAPI: (size, page) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/store/getListStoreBookmarked?size=${size}&page=${page}`;
  },

  //API Đổi số điện thoại:
  changePhoneNumberAPI: (oldPhoneNumber, newPhoneNumber) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/changePhoneNumber?oldPhoneNumber=${oldPhoneNumber}&newPhoneNumber=${newPhoneNumber}`;
  },

  //Đếm số lượng người xem video:
  countSeenVideoAPI: (idVideo) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/video/countView?deviceId=${DEVICE_ID}&videoId=${idVideo}`;
  },

  //Kiểm tra mật khẩu thay đổi lần cuối cùng khi vào App ở nhiều máy:
  checkPassWordAppChangeLate: (passWordLate) => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/validatePassword?password=${passWordLate}`;
  },
  //Lấy ảnh barcode :
  getBarCodeFake: () => {
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/getBarcodeUrlForMember`;
  },
  //Đăng kí tài khoản:
  registerAPI: (userName, password, gender, birthday, zipCode) => {
    console.log(
      `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/register?${
        userName ? `email=${userName}` : ''
      }${password ? `&password=${password}` : ''}&gender=${gender}${
        birthday ? `&birthday=${birthday}` : ''
      }${zipCode ? `&zipCode=${zipCode}` : ''}`,
    );
    return `${URL_DOMAIN}/api/v1/app/${APP_ID}/member/register?${
      userName ? `email=${userName}` : ''
    }${password ? `&password=${password}` : ''}&gender=${gender}${
      birthday ? `&birthday=${birthday}` : ''
    }${zipCode ? `&zipCode=${zipCode}` : ''}`;
  },
};
export {Api};
