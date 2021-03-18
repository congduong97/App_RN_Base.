const listenerMap = {};
let setValue = {
  LATITUDE: false,
  LONGITUDE: false,
  id: false
};
function broadcastlistenersMapControl() {
  Object.keys(listenerMap).forEach(k => listenerMap[k]());
}
export const setValueMap = {
  get: () => setValue,
  set: (latitude, longitude, id, data) => {
    setValue.LATITUDE = latitude;
    setValue.LONGITUDE = longitude;
    setValue.id = id;
    broadcastlistenersMapControl();
  },
  onChange: (key, cb) => {
    listenerMap[key] = () => cb(setValue);
  },
  unChange: key => {
    delete listenerMap[key];
  }
};

const listenerBookMark = {};
let dataBookMark = {
  listStore: {},
  listBookMark: {}
};

function broadcastlistenersBookMark() {
  Object.keys(listenerBookMark).forEach(k => listenerBookMark[k]());
}

export const ServiceCheckBookMark = {
  get: () => dataBookMark,
  set: datanew => {
    dataBookMark = { ...dataBookMark, ...datanew };
    broadcastlistenersBookMark();
  },
  onChange: (key, cb) => {
    listenerBookMark[key] = () => cb(dataBookMark);
  },
  unChange: key => {
    delete listenerBookMark[key];
  }
};

const listeneEvent = {};
let setValueAll = {
  idCity: false,
  nameCtity: false,
  map: false,
  time: false,
  setIDDitrict: false,
  dataDistrict: false,
  data: false,
  id: false,
  idTimeClose: false,
  timeClose: false,
  nameDistrict: false,
  nameOpentime: false,
  nameCloseYime: false,
  dataCheck: [],
  checkDistrict: false
};
function broadcastlistenersControl() {
  Object.keys(listeneEvent).forEach(k => listeneEvent[k]());
}
export const setValueAllItem = {
  get: () => setValueAll,
  set: data => {
    if (data.type === "setIDCity") {
      setValueAll.checkDistrict = data.idCheck;
      setValueAll.idCity = data.item.id;
      setValueAll.nameCtity = data.item.name;
      setValueAll.data = data;
    }

    if (data.type === "setIdCitySearchMoreOptions") {
      setValueAll.idCity = data.item.id;
      setValueAll.data = data;
    }
    if (data.type === "setIDCitySearchName") {
      setValueAll.idCity = data.item.id;
      setValueAll.data = data;
    }
    if (data.type === "DataListStore") {
      setValueAll.data = data;
    }
    if (data.type === "setEmtyDistrict") {
      setValueAll.data = data;
    }
    if (data.type === "checkDistrictName") {
      setValueAll.data = data;
    }
    if (data.type === "checkDistrictStoreHome") {
      setValueAll.data = data;
    }
    if (data.type === "SetCheckCity") {
      setValueAll.data = data;
    }
    if (data.type === "closetime") {
      setValueAll.data = data;
    }
    if (data.type === "opentime") {
      setValueAll.data = data;
    }
    if (data.type === "checkDistrict") {
      setValueAll.data = data;
    }
    if (data.type === "setplacehoder") {
      setValueAll.data = data;
    }

    broadcastlistenersControl();
  },
  onChange: (key, cb) => {
    listeneEvent[key] = () => cb(setValueAll);
  },
  unChange: key => {
    if (listeneEvent[key]) {
      delete listeneEvent[key];
    }
  }
};

// serevice lay latitude and longitude cho map
const listeneEventMap = {};
let setValueMapView = {
  latitude: false,
  longitude: false,
  checkRender: false,
  errStore: false,
  dataStore: false
};
function broadcastlistenersControlMap() {
  Object.keys(listeneEventMap).forEach(k => listeneEventMap[k]());
}
export const setValueMapItem = {
  get: () => setValueMapView,
  set: data => {
    if (data.type === "GET_VALUE_MAP") {
      setValueMapView.latitude = data.position.coords.latitude;
      setValueMapView.longitude = data.position.coords.longitude;
      setValueMapView.checkRender = data.checkRender;
    }
    broadcastlistenersControlMap();
  },
  onChange: (key, cb) => {
    listeneEventMap[key] = () => cb(setValueMapView);
  },
  unChange: key => {
    delete listeneEventMap[key];
  }
};

const listeneDataListStore = {};
let setDataStore = {
  dataStore: false
};
function broadcastlistenersControlListStore() {
  Object.keys(listeneDataListStore).forEach(k => listeneDataListStore[k]());
}
export const ServiceListStore = {
  get: () => setDataStore,
  set: data => {
    if (data.type === "DataListStore") {
      setDataStore.dataStore = data;
    }
    if (data.type === "errStore") {
      setDataStore.dataStore = data;
    }

    broadcastlistenersControlListStore();
  },
  onChange: (key, cb) => {
    listeneDataListStore[key] = () => cb(setDataStore);
  },
  unChange: key => {
    delete listeneDataListStore[key];
  }
};
