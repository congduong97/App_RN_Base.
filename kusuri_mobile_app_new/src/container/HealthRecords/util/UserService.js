let user = {
  id: null,
  firstName: "",
  lastName: "",
  firstNameKana: "",
  lastNameKana: "",
  gender: "MALE",
  birthday: new Date(),
  zipCode: "",
  cityId: 0,
  cityName: "",
  address1: "",
  address2: "",
  bloodGroupId: 0,
  bloodGroup: "",
  bodyWeight: "",
  specialInfos: [],
  allergyEntitiesDefault: [],
  allergyEntitiesOther: [],
  phone: "",
};
let listUser = {
  currentUser: {},
  listOtherUser: [],
};
const changeObject = {};
let eventChange = "";
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k]()
  );
}
export const UserService = {
  setPropertyUser: (key, param) => {
    user[key] = param;
  },
  getUser: () => {
    return user;
  },
  resetUser: () => {
    user = {
      id: null,
      firstName: "",
      lastName: "",
      firstNameKana: "",
      lastNameKana: "",
      gender: "MALE",
      birthday: new Date(),
      zipCode: "",
      cityId: 0,
      cityName: "",
      address1: "",
      address2: "",
      bloodGroupId: 0,
      bloodGroup: "",
      bodyWeight: "",
      specialInfos: [],
      allergyEntitiesDefault: [],
      allergyEntitiesOther: [],
      phone: "",
    };
  },
  setListUser: (currentUser, listOtherUser, event) => {
    listUser.currentUser = currentUser;
    listUser.listOtherUser = listOtherUser;
    eventChange = event;
    broadcast();
  },
  getListUser: () => {
    return listUser;
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(listUser, eventChange);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
