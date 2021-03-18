import {AccountService} from '../services/AccountService';
import ServicesUpdateComponent from '../services/ServicesUpdateComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {Api} from '../constants/Api';
import {btoa} from 'abab';
import DeviceInfo from 'react-native-device-info';
import {
  TYPE_USER,
  APP_ID,
  COMPANY_ID,
  DEVICE_ID,
  isIos,
  AsyncStoreKey,
} from '../constants/System';
let resetTokenStatus = false;
const CommonCall = async (api, header, needToken = null) => {
  console.log('%c API', 'color:red', api);

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
        memberCode: account.memberCode,
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

    if (response.status === 200) {
      const result = await response.json();
      //Access token hết hạn:
      if (result.status === 900) {
        if (resetTokenStatus) {
          let newResponse = await new Promise((resolve, reject) => {
            setTimeout(async () => {
              resetTokenStatus = false;
              const newAccount = AccountService.getAccount();
              const responseReCallApi = await ReCallApiWhenGetAccessToken(
                head,
                api,
                newAccount.accessToken,
                headers,
              );
              resolve(responseReCallApi);
            }, 1000);
          });
          return newResponse;
        } else {
          resetTokenStatus = true;
          const resToken = await getAccessToken();
          console.log('resToken', resToken);
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
            const typeLogin = 'AUTO_LOGIN'; //Không được phép di chuyển biến này!(Chỉ dùng trong case này!)
            const account = AccountService.getAccount();
            const {phone, password} = account;
            const response = await FetchApi.login(phone, password, typeLogin);
            console.log('%c AutoLogin', 'color:green', response);
            if (response && response.success && response.data.memberId) {
              response.data.password = password;
              AccountService.updateAccount(response.data);
              resetTokenStatus = false;
            } else {
              //Mất mạng:
              if (response && response.message == 'Network request failed') {
                ServicesUpdateComponent.set('AUTO_LOGIN_NETWORK_ERROR');
              }
              //Server lỗi:
              else if (response && response.code >= 500) {
                ServicesUpdateComponent.set('AUTO_LOGIN_CODE_500');
              }
              //Trường hợp xóa member hoặc lỗi tài khoản hoặc mật khẩu dưới máy lí do gì đó sai:
              else {
                await AsyncStorage.removeItem(AsyncStoreKey.account);
                resetTokenStatus = false;
                ServicesUpdateComponent.set('AUTO_LOGIN_ERROR');
              }
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
        message: 'Server is maintaining',
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
      message: error.message,
    };
  }
};

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
  console.log("newHead>>>>",newHead)
  const responseRefreshToken = await fetch(api, newHead);
  const resultRefreshToken = await responseRefreshToken.json();
  console.log('%c resultRefreshToken', 'color:red', resultRefreshToken);
  //Trường hợp hết hạn token gây không có data gây chết API Yone crash màn home: (Đã sửa)
  //Case Code không phải 900 thì có data.
  if (resultRefreshToken && resultRefreshToken.status != 900) {
    return {
      success: true,
      data: resultRefreshToken.data,
    };
  } else {
    //Gọi lại API 1 lần nữa:
    const responseRefreshToken = await fetch(api, newHead);
    const resultRefreshToken = await responseRefreshToken.json();
    return {
      success: true,
      data: resultRefreshToken.data,
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

  // Lấy toàn bộ cấu hình của App:
  getAppData: (appVersion) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getAppData(appVersion);
    return CommonCall(api, header, false);
  },

  //Lấy danh sách Slider:
  getHomeSlider: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getHomeSlider();
    return CommonCall(api, header);
  },

  //Mở Slider Home:
  openHomeSlide: (slideId) => {
    const header = {
      method: 'GET',
    };

    const api = Api.openHomeSlide(slideId);
    return CommonCall(api, header);
  },

  //Lấy danh sách 3 thông báo mới nhất ở màn hình Home:
  getHomeNotice: (typeScreen, needToken) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getHomeNotice(typeScreen);
    return CommonCall(api, header, needToken);
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
  login: (phone, password, typeLogin, birthday) => {
    let data = new FormData();
    data.append('email', phone);
    data.append('password', password);
    data.append('typeUser', TYPE_USER);
    data.append('deviceId', DEVICE_ID);
    data.append('typeLogin', typeLogin);
    data.append('birthday', birthday);
    const header = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ' + btoa('rabiloo:rabiloo'),
      },
      body: data,
    };
    const api = Api.login();
    return Login(api, header);
  },
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
  registerOrUpdateMemberAPI: (
    phoneNumber,
    password,
    gender,
    birthday,
    zipCode,
    listFavoriteCategory,
    typeAction,
    useAccessToken,
  ) => {
    const header = {
      method: 'GET',
    };
    const api = Api.registerOrUpdateMember(
      phoneNumber,
      password,
      gender,
      birthday,
      zipCode,
      listFavoriteCategory,
      typeAction,
      useAccessToken,
    );
    return CommonCall(api, header, useAccessToken);
  },

  //Kích hoạt mã OTP:
  activeOTP_SMS: (otpCode, phoneNumber, otpType, needToken) => {
    const header = {
      method: 'GET',
    };
    let haveToken = needToken ? true : false;
    const api = Api.activeOTP(otpCode, phoneNumber, otpType);
    return CommonCall(api, header, haveToken);
  },

  //Thay đổi mật khẩu:
  setPasswordForApp: (newPass, phoneNumber, OTP) => {
    const header = {
      method: 'GET',
    };
    const api = Api.setNewPasswordApp(newPass, phoneNumber, OTP);
    return CommonCall(api, header, false);
  },
  //Get-Information My Page:
  getInfoMypage: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getInfoMyPage();
    return CommonCall(api, header, true);
  },

  // Certificate Member
  getCertificate: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.getCertification();
    return CommonCall(api, header, true);
  },
  //Lấy danh sách cửa hàng:
  getListStore: (size, page, latitude, longitude, cityID, districtID) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListStore(
      size,
      page,
      latitude,
      longitude,
      cityID,
      districtID,
    );
    return CommonCall(api, header);
  },

  //Đếm số lượng push not ở dánh sách menu:
  checkCountPushNotiMenu: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.countNumberPushOnMenu();
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
  countVideoClicked: (idVieo, needToken) => {
    const header = {
      method: 'GET',
    };
    const api = Api.countSeenVideoAPI(idVieo);
    return CommonCall(api, header, needToken);
  },
  //Lấy danh sách thông báo thường:
  getListNoti: (size, page) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListNotificationAll(size, page);
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
  resentOTP: (otpType, phone, memberId) => {
    const header = {
      method: 'GET',
    };
    const api = Api.reSentOTP(otpType, phone, memberId);
    return CommonCall(api, header, false);
  },
  //Kiểm tra validate số điện thoại:
  isExistPhoneNumber: (numberPhone) => {
    const header = {
      method: 'GET',
    };
    const api = Api.isExistPhoneNumberAPI(numberPhone);
    return CommonCall(api, header, false);
  },

  //Kiểm tra xem menu Noti có thông báo mới không hiển thị chữ New:
  checkStatusNotificationHome: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.checkStatusNotiHome();
    return CommonCall(api, header);
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

  //Kiểm tra xem có coupon mới không:
  checkNewCoupon: () => {
    const header = {
      method: 'GET',
    };
    const api = Api.hasNewCoupon();
    return CommonCall(api, header, true);
  },

  //Theo dõi hoặc bỏ theo dõi cửa hàng:
  storeSetBookmarked: (storeCode, memberCode) => {
    const header = {
      method: 'GET',
    };
    const api = Api.setFollowStore(storeCode, memberCode);
    return CommonCall(api, header);
  },

  //Lấy danh sách bookMark của cửa hàng.
  getListBookMark: (size, page) => {
    const header = {
      method: 'GET',
    };
    const api = Api.getListBookMarkAPI(size, page);
    return CommonCall(api, header);
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
  forgotPasswordApp: (phoneNumber, date) => {
    const header = {
      method: 'GET',
    };
    const api = Api.forgotPasswordApp(phoneNumber, date);
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

  checkQrCode: (api) => {
    const header = {
      method: 'GET',
    };
    return CommonCall(api, header, true);
  },
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
    } else {
      return {
        success: false,
        code: response.status,
        message: 'Wrong phone or password',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
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
      message: error.message,
    };
  }
};

export {FetchApi};
