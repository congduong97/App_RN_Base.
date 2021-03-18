import {URL, DEVICE_ID, managerAcount, device} from '../../../const/System';
import {fetchApiMethodGet} from '../../../service';

const getListVideo = async (page, size) => {
  return await fetchApiMethodGet(`${URL}/video/list?page=${page}&size=${size}`);
};
const countVideo = async videoId => {
  return await fetchApiMethodGet(
    `${URL}/video/count_view?deviceId=${device.ADV_ID}&videoId=${videoId}`,
  );
};

export const Api = {
  getListVideo,
  countVideo,
};
