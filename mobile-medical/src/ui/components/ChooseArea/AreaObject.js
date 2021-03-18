export default class AreaData {
  constructor(dataFilter) {
    if (dataFilter) {
      Object.assign(this, dataFilter);
    }
  }
  initialData() {
    return this;
  }
}

export const Areakey = Object.freeze({
  cityCode: "cityCode",
  cityName: "cityName",
  districtCode: "districtCode",
  districtName: "districtName",
  wardCode: "wardCode",
  wardName: "wardName",
  areaFullName: "areaFullName",
});
