import { URL, DEVICE_ID } from '../../../const/System';
import { fetchApiMethodGet } from '../../../service';

const getNotificationDetail = async (id) => await fetchApiMethodGet(`${URL}notification/detail/${id}?deviceId=${DEVICE_ID}`);

const getNotification = async (size, page) => await fetchApiMethodGet(`${URL}notification/all?page=${page}&size=${size}&deviceId=${DEVICE_ID}`);


export const Api = {
    getNotificationDetail,
    getNotification
};
