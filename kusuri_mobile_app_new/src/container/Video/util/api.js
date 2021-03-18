import { URL, DEVICE_ID, versionApp } from "../../../const/System";
import { fetchApiMethodGet } from "../../../service";

const getVideo = async (size, page) =>
  await fetchApiMethodGet(
    `${URL}video/list?size=${size}&page=${page}&sortDir=desc&sortField=id&versionApp=${versionApp}`
  );
const countVideoClicked = async (id) =>
  await fetchApiMethodGet(
    `${URL}/video/countView?deviceId=${DEVICE_ID}&videoId=${id}`
  );

export const Api = {
  getVideo,
  countVideoClicked,
};
