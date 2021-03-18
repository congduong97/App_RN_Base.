import {
  URL_DOMAIN,
  APP_ID,
  DEVICE_ID,
  COMPANY_ID,
  managerAccount,
  URL,
} from "../../../const/System";
import {
  fetchApiMethodPost,
  fetchApiMethodGet,
  fetchApiMethodGetNotUseToken,
} from "../../../service";

const pushSign = async (memberCode, pass) => {
  // alert('go gin chon nhe');
  try {
    const response = await Promise.race([
      fetch(
        `${URL_DOMAIN}/login?typeUser=MOBILE_USER&email=${memberCode}&password=${pass}&appId=${APP_ID}&deviceId=${DEVICE_ID}&companyId=${COMPANY_ID}`,
        {
          method: "POST",
        }
      ),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);

    let responsepushSign = await response.json();
    console.log("response", responsepushSign);
    const res = response.status === 200 ? responsepushSign : response;
    return { res, code: response.status };
  } catch (error) {
    if (error.message === "timeout") {
      return { res: error };
    }
  }
};
const getImage = async () =>
  await fetchApiMethodGet(`${URL}member/getInformationMyPage`);
const validatePhoneNumber = async (phone) =>
  await fetchApiMethodGet(`${URL}/member/validatePhoneNumber?phone=${phone}`);
const addBirthday = async (birthDay) =>
  await fetchApiMethodGet(`${URL}/member/addBirthday?birthDay=${birthDay}`);
const checkPinCode = async (memberCode) => {
  try {
    const response = await Promise.race([
      fetch(`${URL}/member/checkPinCode?memberCode=${memberCode}`, {
        method: "POST",
      }),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);

    let responseCheck = await response.json();
    console.log("[responseCheck-pincode]", responseCheck);
    const res = response.status === 200 ? responseCheck : response;
    return { res, code: response.status };
  } catch (error) {
    if (error.message === "timeout") {
      return { res: error };
    }
  }
};

const validateBirthday = async (birthDay) =>
  await fetchApiMethodGet(
    `${URL}/member/validateBirthday?birthDay=${birthDay}`
  );
const validateOTPCode = async (phone, otpCode) =>
  await fetchApiMethodGet(
    `${URL}/member/validateOTPCode?phone=${phone}&otpCode=${otpCode}`
  );
const validateOTPForLogin = async (
  memberCode,
  currentPhone,
  newPhone,
  otpCode,
  typeLogin
) =>
  // console.log(
  //   "url validateOTPForLogin",
  //   `${URL}/member/validateOTPForLogin?memberCode=${memberCode}&currentPhone=${currentPhone}&newPhone=${newPhone}&deviceId=${DEVICE_ID}&otpCode=${otpCode}`
  // );
  await fetchApiMethodGetNotUseToken(
    `${URL}/member/validateOTPForLogin?memberCode=${memberCode}&currentPhone=${currentPhone}&newPhone=${newPhone}&deviceId=${DEVICE_ID}&otpCode=${otpCode}&typeLogin=${typeLogin}`
  );

const updatePhoneNumber = async (currentPhone, newPhone) =>
  await fetchApiMethodGet(
    `${URL}member/updatePhoneNumber?currentPhone=${currentPhone}&newPhone=${newPhone}`
  );
const isInActiveMember = async (memberCode) =>
  await fetchApiMethodGet(
    `${URL}member/isInActiveMember?memberCode=${memberCode}`
  );
const updateMyPage = async () =>
  await fetchApiMethodPost(`${URL}/member/updateMyPage`, {
    method: "POST",
    body: JSON.stringify({
      memberCode: managerAccount.memberCode,
      pinCode: managerAccount.password,
    }),
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "application/json",
    },
  });
const getBalance = async () =>
  await fetchApiMethodPost(`${URL}member/getBalance`, {
    method: "POST",
    body: JSON.stringify({
      memberCode: managerAccount.memberCode,
      pinCode: managerAccount.password,
    }),
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "application/json",
    },
  });
const loginWithPhoneNumber = async (
  memberCode,
  currentPhone,
  birthday,
  typeLogin
) => {
  try {
    const response = await Promise.race([
      fetch(`${URL}member/loginByPhoneNumber`, {
        method: "POST",
        body: JSON.stringify({
          memberCode,
          currentPhone,
          birthday,
          deviceId: DEVICE_ID,
          typeLogin,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);

    let responsepushSign = await response.json();
    const res = response.status === 200 ? responsepushSign : response;
    return { res, code: response.status };
  } catch (error) {
    console.log(error);
    if (error.message === "timeout") {
      return { res: error };
    }
  }
};
const loginByAnotherPhone = async (
  memberCode,
  currentPhone,
  birthday,
  typeLogin,
  newPhone
) => {
  try {
    console.log("URL", DEVICE_ID);
    const response = await Promise.race([
      fetch(`${URL}member/loginByAnotherPhone`, {
        method: "POST",
        body: JSON.stringify({
          memberCode,
          currentPhone,
          birthday,
          deviceId: DEVICE_ID,
          typeLogin,
          newPhone,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      new Promise((resolve, reject) =>
        setTimeout(reject, 10000, new Error("timeout"))
      ),
    ]);

    let responsepushSign = await response.json();
    const res = response.status === 200 ? responsepushSign : response;
    return { res, code: response.status };
  } catch (error) {
    console.log(error);
    if (error.message === "timeout") {
      return { res: error };
    }
  }
};

export const Api = {
  loginWithPhoneNumber,
  pushSign,
  updateMyPage,
  getImage,
  getBalance,
  validatePhoneNumber,
  validateOTPCode,
  addBirthday,
  validateBirthday,
  updatePhoneNumber,
  isInActiveMember,
  validateOTPForLogin,
  loginByAnotherPhone,
  checkPinCode,
};
