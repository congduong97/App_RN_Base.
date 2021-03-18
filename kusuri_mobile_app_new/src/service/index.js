import AsyncStorage from "@react-native-community/async-storage";

import {
  APP_ID,
  DEVICE_ID,
  isIOS,
  managerAccount,
  keyAsyncStorage,
  URL_DOMAIN,
  URL_LOGIN,
  COMPANY_ID,
} from "../const/System";
import CookieManager from "react-native-cookies";
import { Api as ApiAccount } from "../container/Account/util/api";
import NetInfo from "@react-native-community/netinfo";
import { AlertNotifyUserDeletedService } from "../container/HealthRecords/util/AlertNotifyUserDeletedService";
// import console = require('console');
let resetTokenStatus = 0;

export async function fetchApiMethodPost(URL, confix, timeOut = true) {
  try {
    let newConfix = confix;
    newConfix.credentials = "include";
    newConfix.headers.appId = APP_ID;
    newConfix.headers.deviceId = DEVICE_ID;
    newConfix.headers.typeOs = isIOS ? "IOS" : "ANDROID";
    newConfix.headers.memberCode = managerAccount.memberCode;
    console.log(URL);
    console.log("new confix", newConfix);
    let response = {};
    if (timeOut) {
      response = await Promise.race([
        fetch(URL, newConfix),
        new Promise((resolve, reject) =>
          setTimeout(reject, 10000, new Error("timeout"))
        ),
      ]);
    } else {
      response = await fetch(URL, newConfix);
    }
    console.log("[ FETCH POST ]", response);
    let responseFetchApiMethodPost =
      response.status == 200 ? await response.json() : {};
    if (response.status == 200 && responseFetchApiMethodPost.status === 900) {
      return await pushResetToken(URL, newConfix);
    } else {
      const res =
        (await response.status) === 200 ? responseFetchApiMethodPost : response;
      // console.log("res method post", res);
      if (res.status.code === 1405) {
        AlertNotifyUserDeletedService.ableModal();
      }
      return { res: res, code: response.status };
    }
  } catch (error) {
    console.log("Lỗi sml???", error);
    if (error.message === "timeout") {
      return { res: error.message };
    }
  }
}
export async function fetchApiMethodGet(URL) {
  console.log(URL);
  try {
    const headerFetch = managerAccount.accessToken
      ? {
          method: "GET",
          credentials: "include",
          headers: {
            accessToken: `${managerAccount.accessToken}`,
            appId: `${APP_ID}`,
            deviceId: `${DEVICE_ID}`,
            typeOs: isIOS ? "IOS" : "ANDROID",
            memberCode: managerAccount.memberCode,
          },
        }
      : {
          method: "GET",
          headers: {
            appId: `${APP_ID}`,
            deviceId: `${DEVICE_ID}`,
            typeOs: isIOS ? "IOS" : "ANDROID",
            memberCode: managerAccount.memberCode,
          },
        };

    // new Promise((resolve, reject) => {
    //   setTimeout(resolve, 1000, 'OKE');
    // })
    const response = await Promise.race([
      fetch(URL, headerFetch),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);
    // const response = await fetch(URL, headerFetch);
    console.log("[ GET FETCH ]", response);
    let responseFetchApiMethodGet =
      response.status == 200 ? await response.json() : {};
    console.log(`responseFetchApiMethodGet ${URL}`, responseFetchApiMethodGet);

    if (
      response.status == 200 &&
      responseFetchApiMethodGet.status === 900 &&
      managerAccount.accessToken
    ) {
      return await pushResetToken(URL, {
        method: "GET",
        credentials: "include",
        headers: {
          accessToken: managerAccount.accessToken,
          appId: `${APP_ID}`,
          deviceId: `${DEVICE_ID}`,
          typeOs: isIOS ? "IOS" : "ANDROID",
          memberCode: managerAccount.memberCode,
        },
      });
    } else {
      const res =
        (await response.status) === 200 ? responseFetchApiMethodGet : response;
      // console.log("res method post", res);
      if (res.status.code === 1405) {
        AlertNotifyUserDeletedService.ableModal();
      }
      return { res: res, code: response.status };
    }
  } catch (error) {
    if (error.message === "timeout") {
      console.log("time-out");
      return { res: error.message };
    }
  }
}

export async function fetchApiMethodGetNotUseToken(URL) {
  console.log("URL:", URL);
  try {
    const response = await Promise.race([
      fetch(URL, {
        method: "GET",
        headers: {
          appId: `${APP_ID}`,
          deviceId: `${DEVICE_ID}`,
          typeOs: isIOS ? "IOS" : "ANDROID",
          memberCode: managerAccount.memberCode,
        },
      }),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);
    // let response = await fetch(URL, {
    //   method: 'GET',
    //   headers: {
    //     appId: `${APP_ID}`,
    //     deviceId: `${DEVICE_ID}`,
    //     typeOs: isIOS ? 'IOS' : 'ANDROID',
    //     memberCode: managerAccount.memberCode,
    //   },
    // });
    console.log("response URL", response);

    let fetchApiMethodGetNotUseToken =
      response.status === 200 ? await response.json() : {};
    console.log("fetchApiMethodGetNotUseToken", fetchApiMethodGetNotUseToken);

    const res =
      response.status === 200 ? fetchApiMethodGetNotUseToken : response;
    return { res: res, code: response.status };
  } catch (error) {
    if (error.message === "timeout") {
      return { res: error.message };
    }
  }
}
const pushResetToken = async (URL, confix) => {
  console.log("refresh toke"), URL;
  try {
    if (resetTokenStatus == 1) {
      let newResponse = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          resetTokenStatus = 0;
          const newConfix = confix;
          newConfix.headers.accessToken = managerAccount.accessToken;
          const newResponse = await Promise.race([
            fetch(URL, newConfix),
            new Promise((resolve, reject) =>
              setTimeout(reject, 10000, new Error("timeout"))
            ),
          ]);

          const res =
            newResponse.status === 200 ? await newResponse.json() : newResponse;

          resolve({ res: res, code: newResponse.status });
        }, 1000);
      });

      return newResponse;
    } else {
      resetTokenStatus = 1;
    }

    const responseRefreshToken = await Promise.race([
      fetch(
        `${URL_DOMAIN}/api/v1/app/${APP_ID}/user/getAccessToken?refreshToken=${
          managerAccount.refreshToken
        }`,
        {
          method: "POST",
          headers: {
            appId: `${APP_ID}`,
            deviceId: `${DEVICE_ID}`,
            typeOs: isIOS ? "IOS" : "ANDROID",
            memberCode: managerAccount.memberCode,
          },
        }
      ),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);

    let responsePushResetToken = await responseRefreshToken.json();
    console.log("[responsePushResetToken]", responsePushResetToken);
    if (
      responseRefreshToken.status == 200 &&
      responsePushResetToken.status.code === 1000
    ) {
      const newToken = await responsePushResetToken.data;
      managerAccount.accessToken = newToken;
      const newConfix = confix;
      newConfix.headers.accessToken = newToken;

      const newResponse = await Promise.race([
        fetch(URL, newConfix),
        new Promise((resolve, reject) =>
          setTimeout(reject, 10000, new Error("timeout"))
        ),
      ]);

      // const newResponse = await fetch(URL, newConfix);

      let responseNewResponse =
        newResponse.status === 200 ? await newResponse.json() : {};
      // console.log('newResponseresponseRefreshToken',newResponse)
      await AsyncStorage.setItem(
        keyAsyncStorage.managerAccount,
        JSON.stringify(managerAccount)
      );
      resetTokenStatus = 0;
      const res =
        (await newResponse.status) === 200 ? responseNewResponse : newResponse;

      return { res: res, code: newResponse.status };
    } else {
      if (
        responseRefreshToken.status == 200 &&
        responsePushResetToken.status.code === 401
      ) {
        const response = await ApiAccount.pushSign(
          managerAccount.memberCode,
          managerAccount.password
        );

        if (response.code === 200) {
          const {
            accessToken,
            username,
            memberDto,
            refreshToken,
            userId,
          } = response.res;
          managerAccount.accessToken = accessToken;
          managerAccount.username = username;
          managerAccount.memberCode = memberDto.memberCode;
          managerAccount.refreshToken = refreshToken;
          managerAccount.point = memberDto.point;
          managerAccount.money = memberDto.money;
          managerAccount.password = managerAccount.password;
          managerAccount.userId = userId;
          AsyncStorage.setItem(
            keyAsyncStorage.managerAccount,
            JSON.stringify(managerAccount)
          );
          resetTokenStatus = 0;
          const newConfix = confix;
          newConfix.headers.accessToken = accessToken;

          const newResponse = await Promise.race([
            fetch(URL, newConfix),
            new Promise((resolve, reject) =>
              setTimeout(reject, 10000, new Error("timeout"))
            ),
          ]);
          const res =
            newResponse.status === 200 ? await newResponse.json() : newResponse;

          return { res: res, code: newResponse.status };
        } else if (response.code === 400) {
          resetTokenStatus = 0;
        }
      } else {
        resetTokenStatus = 0;
        return { res: responseRefreshToken, code: responseRefreshToken.status };
      }
    }
  } catch (error) {
    resetTokenStatus = 0;
    if (error.message === "timeout") {
      return { res: error.message };
    }
  }
};
