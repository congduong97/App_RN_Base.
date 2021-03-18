import actions from "../redux/actions";

import { post, get, requestALl, isSuccess, put } from "./ApiHelper";
import models from "../models";
import Toast from "react-native-simple-toast";

export const RESPONDATA_APPOINTMENTS = "api/doctor-appointments/user";
export const CONFIRM_CHANGE_APPOINTMENT = (id) => `api/doctor-appointments/${id}/confirm`;

export async function respondataAppointments(dispatch, params) {
    dispatch(actions.showLoading())
    let responsesData = await get(
        RESPONDATA_APPOINTMENTS,
        params,
        dispatch,
        "Lỗi khi lấy thông tin phiếu khám"
    );
    dispatch(actions.hideLoading())
    return responsesData?.data || [];
}

export async function requestConfirmChangeAppointment(dispatch, params) {
    dispatch(actions.showLoading())
    let responsesData = await put(
        CONFIRM_CHANGE_APPOINTMENT(params.id),
        params,
        dispatch,
        "Lỗi khi xác nhận chuyển lịch"
    );
    console.log(responsesData);
    dispatch(actions.hideLoading())
    return responsesData?.data || [];
}

export default {
    respondataAppointments,
    requestConfirmChangeAppointment
};
