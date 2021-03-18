import actions from "../redux/actions";
import { post, get, requestALl, isSuccess } from "./ApiHelper";
import models from "../models";

const SEND_OTP_GENERATOR = "/api/public/otp/generator";
const CHECK_OTP_GENERATOR = "/api/public/otp/verify";

export async function requestOTPGenerator(dispatch, params) {
    dispatch(actions.showLoading());
    let responsesData = await post(
        SEND_OTP_GENERATOR,
        params,
        dispatch,
        "Lỗi khi gửi tin nhắn otp"
    );

    dispatch(actions.hideLoading());
    if (isSuccess(responsesData?.status)) {
        return responsesData?.data;
    }
    return {}
}

export async function requestCheckOTPGenerator(dispatch, params) {
    dispatch(actions.showLoading());
    let responsesData = await post(
        CHECK_OTP_GENERATOR,
        params,
        dispatch,
        "Lỗi khi xác thực tin nhắn otp"
    );

    console.log("responsesData?.data;:    ", responsesData?.data)

    dispatch(actions.hideLoading());
    if (isSuccess(responsesData?.status)) {
        return responsesData?.data;
    }
    return false
}

export default {
    requestOTPGenerator,
    requestCheckOTPGenerator
};
