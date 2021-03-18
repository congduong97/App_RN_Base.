//Library:
import {AccountService} from '../services/AccountService';
import ServicesUpdateComponent from '../services/ServicesUpdateComponent';
import DeviceInfo from 'react-native-device-info';
import {btoa} from 'abab';

//Setup:
import {Api} from '../constants/Api';
import {
  TYPE_USER,
  APP_ID,
  COMPANY_ID,
  DEVICE_ID,
  isIos,
} from '../constants/System';
import {STRING} from '../constants/String';
let resetTokenStatus = false;
const CommonCall = async (api, header, needToken = null) => {
  try {
    const account = AccountService.getAccount();
    let headers;
    if (needToken || (needToken === null && account && account.accessToken)) {
      headers = {
        Accept: 'application/json',
        accessToken: `${account.accessToken}`,
        appId: `${APP_ID}`,
        deviceId: `${DEVICE_ID}`,
        typeOs: isIos ? 'IOS' : 'ANDROID',
        email: account.email,
      };
    } else {
      headers = {
        appId: `${APP_ID}`,
        deviceId: `${DEVICE_ID}`,
        typeOs: isIos ? 'IOS' : 'ANDROID',
      };
    }

    if (header.method === 'POST') {
      headers = {
        ...headers,
        'Content-Type': 'application/json',
      };
    }

    let head = {...header, headers};
    const response = await fetch(api, {
      ...head,
      credentials: 'same-origin',
      // credentials: 'omit',
    });
    console.log('[FETCH]', response);
    if (response.status === 200) {
      const result = await response.json();
      console.log('[RESPONSE]', result);
      //Access token hết hạn:
      if (result.status === 900) {
        if (resetTokenStatus) {
          let newResponse = await new Promise((resolve, reject) => {
            setTimeout(async () => {
              resetTokenStatus = false;
              const account = AccountService.getAccount();
              const responseReCallApi = await ReCallApiWhenGetAccessToken(
                head,
                api,
                account.accessToken,
                headers,
              );
              resolve(responseReCallApi);
            }, 1000);
          });
          return newResponse;
        } else {
          resetTokenStatus = true;
          const resToken = await getAccessToken();
          console.log(resToken, 'resToken getAccessToken');
          if (resToken.success) {
            const responseReCallApi = await ReCallApiWhenGetAccessToken(
              head,
              api,
              resToken.accessToken,
              headers,
            );
            resetTokenStatus = false;
            return responseReCallApi;
          }
          if (resToken.code === 401) {
            const account = AccountService.getAccount();
            const {email, password} = account;
            const response = await FetchApi.login(email, password);
            if (response.success) {
              response.data.password = password;
              AccountService.updateAccount(response.data);
              //Call lại API cũ với newAccessToken:
              const newHeaders = {
                ...headers,
                accessToken: `${response.data.accessToken}`,
              };
              const resultAgain = await CommonCall(
                api,
                newHeaders,
                needToken,
                headers,
              );
              resetTokenStatus = false;
              return resultAgain;
            } else {
              // setTimeout(() => {
              ServicesUpdateComponent.set('AUTO_LOGIN_ERROR');
              resetTokenStatus = false;
              return;
              // }, 2000);
            }
          }
        }
      }

      if (result.status.code === 1000) {
        return {
          success: true,
          data: result.data,
          code: result.status.code,
          status_code: response.status,
        };
      } else {
        return {
          success: false,
          data: result.data,
          code: result.status.code,
          message: result.status.message,
          status_code: response.status,
        };
      }
    }

    if (response.status >= 500) {
      return {
        code: null,
        message: STRING.server_maintain,
        success: false,
        status_code: response.status,
      };
    }

    return {
      code: null,
      success: false,
      message: 'Error code: ' + response,
      status_code: response.status,
    };
  } catch (error) {
    return {
      code: null,
      status_code: null,
      success: false,
      message: STRING.network_error_try_again_later,
    };
  }
};
//Goi lai api
const ReCallApiWhenGetAccessToken = async (
  head,
  api,
  newAccessToken,
  headers,
) => {
  const newHeaders = {
    ...headers,
    accessToken: `${newAccessToken}`,
  };
  const newHead = {...head, headers: newHeaders};
  const responseRefeshToken = await fetch(api, newHead);
  const resultRefeshToken = await responseRefeshToken.json();
  if (responseRefeshToken.status == 200) {
    if (resultRefeshToken.status.code === 1000) {
      return {
        success: true,
        data: resultRefeshToken.data,
      };
    } else {
      return {
        code: resultRefeshToken.status.code,
        message: 'error',
        success: false,
        status_code: resultRefeshToken.status,
      };
    }
  } else if (responseRefeshToken.status >= 500) {
    return {
      code: null,
      message: STRING.server_maintain,
      success: false,
      status_code: resultRefeshToken.status,
    };
  }
};

//Lấy AccessToken mới từ RefreshToken:
const getAccessToken = async () => {
  try {
    const account = AccountService.getAccount();

    const header = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        deviceId: DeviceInfo.getUniqueId(),
        typeOs: isIos ? 'IOS' : 'ANDROID',
      },
    };
    const api = Api.getAccessToken(account.refreshToken);
    const response = await fetch(api, header);

    const result = await response.json();

    if (response.status === 200) {
      if (result.status.code === 1000) {
        let newAccount = {...account};
        newAccount.accessToken = result.data;
        AccountService.setAccount(newAccount);
        return {
          success: true,
          accessToken: result.data,
        };
      }
      if (result.status.code === 401) {
        return {
          success: false,
          message: result.status.message,
          code: result.status.code,
          status_code: response.status,
        };
      }
    }
    if (response.status >= 500) {
      return {
        code: null,
        message: 'Server is maintaining',
        success: false,
        status_code: response.status,
      };
    }
  } catch (error) {
    return {
      code: null,
      status_code: null,
      success: false,
      message: STRING.network_error_try_again_later,
    };
  }
};

//Đăng nhập:
const Login = async (api, header) => {
  try {
    const response = await fetch(api, header);
    if (response.status === 200) {
      const result = await response.json();
      if (result.access_token !== '') {
        return {
          success: true,
          data: result,
        };
      }
      return {
        success: false,
        message: `Error code: ${response.status || undefined}`,
      };
    }
    if (response.status === 400) {
      return {
        success: false,
        message: 'Login false',
      };
    }
    let resultError = await response.json();
    return {
      success: false,
      code: resultError.error_code,
      message: `Error code: ${resultError.error_code}`,
    };
  } catch (error) {
    return {
      success: false,
      message: STRING.network_error_try_again_later,
    };
  }
};

const FetchApi = {
  //Đăng kí deviceID:
  registrationDeviceId: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.registrationDeviceID();
    return CommonCall(api, header, false);
  },

  //Đăng kí token push:
  registrationDeviceToken: (token) => {
    const header = {
      method: 'GET',
    };
    const api = Api.registrationDeviceToken(token);
    return CommonCall(api, header, false);
  },

  //Thay đổi mật khẩu  Mypage:
  changePassWordMyPage: (oldPassword, newPassword) => {
    const header = {
      method: 'POST',
    };
    const api = Api.changePassWordMyPageAPI(oldPassword, newPassword);
    return CommonCall(api, header, true);
  },

  // Lấy toàn bộ cấu hình của App:
  getAppData: (appVersion) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getAppData(appVersion);
    return CommonCall(api, header, false);
  },

  //Update thông tin cá nhân:
  updateInfoMypage: (birthday, gender, zipCode) => {
    const header = {
      method: 'POST',
    };
    const api = Api.updateInfoMyPageAPI(birthday, gender, zipCode);
    return CommonCall(api, header, true);
  },

  //Xóa tài khoản member:
  disableAccount: (email, pass) => {
    const header = {
      method: 'POST',
    };
    const api = Api.disableAccount(email, pass);
    return CommonCall(api, header, true);
  },

  //Lấy danh sách Slider:
  getHomeSlider: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getHomeSlider();

    return CommonCall(api, header);
  },

  //Mở news:
  openItemNews: (newsId) => {
    const header = {
      method: 'GET',
    };

    const api = Api.openItemNews(newsId);
    return CommonCall(api, header);
  },
  openStamps: (stampsId) => {
    const header = {
      method: 'GET',
    };

    const api = Api.openStamps(stampsId);
    return CommonCall(api, header);
  },
  getNewsList: (size, page) => {
    const header = {
      method: 'GET',
    };

    const api = Api.getNewsList(size, page);
    return CommonCall(api, header);
  },

  //Lấy danh sách 3 thông báo mới nhất ở màn hình Home:
  getHomeNotice: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getHomeNotice();
    return CommonCall(api, header);
  },
  getBalanceAndPoint: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getBalanceAndPoint();
    return CommonCall(api, header, true);
  },
  //lấy số thông báo chưa đọc
  getNumberNewNotification: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getNumberNewNotification();
    return CommonCall(api, header);
  },
  // Kiểm tra server có bảo trì hay không đồng thời kiểm tra xem version của app có bắt buộc phải update ?
  checkVerionUpdate: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.checkVersion();
    return CommonCall(api, header, false);
  },

  //Lấy danh sách coupon:
  getDataCoupon: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getDataCoupon();
    return CommonCall(api, header, true);
  },
  //Lấy danh sách push:
  getPushNotification: (page, size) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getPushNotification(page, size);
    return CommonCall(api, header);
  },
  //Đọc chi tiết push:
  openPushNotiItem: (pushNotiId) => {
    const header = {
      method: 'GET',
    };
    const api = Api.openPushNotiItem(pushNotiId);
    return CommonCall(api, header);
  },

  //Sử dụng coupon:
  useCoupon: (pKikakuId, usingList) => {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        deviceId: DEVICE_ID,
        mapKikakuAndListCouponId: {[pKikakuId]: usingList},
      }),
    };
    const api = Api.useCoupon();
    return CommonCall(api, header, true);
  },

  useCouponInDetail: (couponId) => {
    const header = {
      method: 'GET',
    };
    const api = Api.useCouponInDetail(couponId);
    return CommonCall(api, header, true);
  },
  linkingCard: (memberCode, pinCode) => {
    const header = {
      method: 'POST',
    };
    const api = Api.linkingCard(memberCode, pinCode);
    return CommonCall(api, header, true);
  },
  login: (userName, password) => {
    let data = new FormData();
    data.append('email', userName);
    data.append('password', password);
    data.append('typeUser', TYPE_USER);
    data.append('deviceId', DEVICE_ID);
    const header = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        typeOs: isIos ? 'IOS' : 'ANDROID',
        Authorization: 'Basic ' + btoa('rabiloo:rabiloo'),
      },
      body: data,
    };
    const api = Api.login();
    return Login(api, header);
  },

  //Đăng kí bằng phương thức post:
  register: (
    email,
    password,
    gender,
    dateOfBirth,
    zipCode,
    pinCode,
    memberCode,
  ) => {
    let data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('gender', gender);
    data.append('birthday', dateOfBirth);
    data.append('zipCode', zipCode);
    data.append('pinCode', pinCode);
    data.append('memberCode', memberCode);
    data.append('companyId', COMPANY_ID);
    data.append('deviceId', DEVICE_ID);

    const header = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + btoa('rabiloo:rabiloo'),
      },
      body: data,
    };
    const api = Api.register();
    return CommonCall(api, header, false);
  },

  //Danh sách checkbox yêu thích đăng kí tài khoản:
  listFavoriteCategoryRegistrationUser: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.listFavoriteCategoryRegistrationUser();
    return CommonCall(api, header, false);
  },

  //Kiểm tra mật khẩu lần cuối sửa đổi:
  checkPassWordChangeLate: (passLate) => {
    const header = {
      method: 'POST',
    };
    const api = Api.checkPassWordAppChangeLate(passLate);
    return CommonCall(api, header, true);
  },

  //Đăng kí tài khoản đăng nhập bằng API registerOrUpdateMember.
  registerMemberAPI: (
    userName,
    password,
    gender,
    birthday,
    zipCode,
    useAccessToken,
  ) => {
    const header = {
      method: 'POST',
    };
    //Đăng kí thành viên:
    const api = Api.registerAPI(
      userName,
      password,
      gender,
      birthday,
      zipCode,
      useAccessToken,
    );
    return CommonCall(api, header, useAccessToken);
  },

  //Kích hoạt mã OTP:
  activeOTP_SMS: (otpCode, email, otpType, needToken) => {
    const header = {
      method: 'GET',
    };
    let haveToken = needToken ? true : false;
    console.log('Có gắn thêm mã Token không?', needToken);
    const api = Api.activeOTP(otpCode, email, otpType);
    return CommonCall(api, header, haveToken);
  },

  //Thay đổi mật khẩu:
  setPasswordForApp: (newPass, email, OTP) => {
    const header = {
      method: 'GET',
    };
    const api = Api.setNewPasswordApp(newPass, email, OTP);
    return CommonCall(api, header, false);
  },

  //Thay đổi địa chỉ email:
  changeEmail: (oldEmail, newEmail) => {
    console.log('oldEmail, newEmail', oldEmail, newEmail);
    const header = {
      method: 'POST',
    };
    const api = Api.changEmail(oldEmail, newEmail);
    return CommonCall(api, header, true);
  },

  //Lấy thông tin mypage:
  getInfoMypage: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getInfoMyPage();
    return CommonCall(api, header, true);
  },

  // Thông tin thẻ chứng nhận thành viên:
  getCertificate: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getCertificationMemberAPI();
    return CommonCall(api, header, true);
  },

  //Lấy danh sách cửa hàng:
  getListStore: (size, page, latitude, longitude, keyword) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListStore(size, page, latitude, longitude, keyword);
    return CommonCall(api, header);
  },

  //Lấy danh sách video:
  getListVideo: (page, size) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListVideo(page, size);
    return CommonCall(api, header, false);
  },

  //Đếm số lượng xem video:
  countVideoClicked: (idVieo) => {
    const header = {
      method: 'GET',
    };
    const api = Api.countSeenVideoAPI(idVieo);
    return CommonCall(api, header);
  },

  //Lấy danh sách thông báo thường:
  getListNoti: (size, page) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListNotificationAll(size, page);
    console.log('api', api);
    return CommonCall(api, header);
  },

  //Lấy chi tiết detail thông báo thường:
  getDetailNoti: (notificationId) => {
    const header = {
      method: 'GET',
    };
    const api = Api.detailNoti(notificationId);
    return CommonCall(api, header);
  },

  //Lấy danh sách câu hỏi thường gặp:
  getListQuestion: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListQuestions();
    return CommonCall(api, header, false);
  },

  //Gửi lại mã OTP :
  resentOTP: (otpType, email) => {
    const header = {
      method: 'GET',
    };
    const api = Api.resentOTP(otpType, email);
    return CommonCall(api, header, false);
  },

  //Kiểm tra validate số điện thoại:
  validateEmailAPI: (numberPhone) => {
    const header = {
      method: 'GET',
    };
    const api = Api.validateEmail(numberPhone);
    return CommonCall(api, header, false);
  },

  //Kiểm tra validate zipcode:
  validateZipcode: (zipcode) => {
    const header = {
      method: 'GET',
    };
    const api = Api.validateZipCodeAPI(zipcode);
    return CommonCall(api, header, false);
  },

  //API Đọc noti thường:
  notificationDetail: (notificationId) => {
    const header = {
      method: 'GET',
    };
    const api = Api.readNotiAPI(notificationId);
    return CommonCall(api, header);
  },

  //Theo dõi hoặc bỏ theo dõi cửa hàng:
  storeSetBookmarked: (storeCode) => {
    const header = {
      method: 'GET',
    };
    const api = Api.setFollowStore(storeCode);
    return CommonCall(api, header, true);
  },

  //Lấy danh sách bookMark của cửa hàng.
  getListBookMark: (size, page) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListBookMarkAPI(size, page);
    return CommonCall(api, header, true);
  },

  //Lấy danh sách Store:
  getListCityAndDistrict: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListCityAndDistrictAPI();
    return CommonCall(api, header, false);
  },

  //Lấy lại mật khẩu:
  forgotPasswordApp: (email) => {
    const header = {
      method: 'GET',
    };
    const api = Api.forgotPasswordApp(email);
    return CommonCall(api, header, false);
  },

  //Đổi số điện thoại:
  changePhoneNumber: (oldNumberPhone, newNumberPhone, needToken) => {
    const header = {
      method: 'POST',
    };
    const api = Api.changePhoneNumberAPI(oldNumberPhone, newNumberPhone);
    return CommonCall(api, header, needToken);
  },

  //Kiểm tra mã QR:
  checkQrCode: (api) => {
    const header = {
      method: 'GET',
    };
    return CommonCall(api, header, true);
  },

  //Cách dùng app:
  howToUse: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.howToUse();
    return CommonCall(api, header);
  },

  //Lấy ảnh fake barcode của màn hình chứng nhận thành viên:
  getFakeBarCode: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getBarCodeFake();
    return CommonCall(api, header, true);
  },
  removeLinkingCard: () => {
    const header = {
      method: 'POST',
    };
    const api = Api.removeLinkingCard();
    return CommonCall(api, header, true);
  },
};

export {FetchApi};
