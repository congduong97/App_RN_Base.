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
  cityCode: 'provinceId',
  cityName: 'cityName',
  districtCode: 'districtId',
  districtName: 'districtName',
  wardCode: 'wardId',
  wardName: 'wardName',
  areaFullName: 'areaFullName',
});
