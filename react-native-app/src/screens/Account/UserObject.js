export default class UserObject {
  constructor(dataFilter) {
    if (dataFilter) {
      Object.assign(this, dataFilter);
    }
  }
  initialData() {
    return this;
  }
}
