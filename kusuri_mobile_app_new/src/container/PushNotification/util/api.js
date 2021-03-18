import { URL, DEVICE_ID, keyAsyncStorage } from '../../../const/System';
import { fetchApiMethodGet } from '../../../service';
import AsyncStorage from '@react-native-community/async-storage';

const getPushNotificationDetail = async (id) => await fetchApiMethodGet(`${URL}pushNotification/detail/${id}?deviceId=${DEVICE_ID}`);

const getPushNotification = async (size, page) => {
    const time = new Date().getTime()
    AsyncStorage.setItem(keyAsyncStorage.timeUpdateNotification, time.toString());
    return await fetchApiMethodGet(`${URL}pushNotification/list-mobile?size=${size}&page=${page}&deviceId=${DEVICE_ID}&sortDir=desc&sortField=id`);
};


export const Api = {
    getPushNotificationDetail,
    getPushNotification

};
