const listCheckName = {};
let setDataNameCheck = {
    data: false
};
function broadcastlistenersName() {
    Object.keys(listCheckName).forEach(k => listCheckName[k]());
}
export const setNameCheck = {
    get: () => setDataNameCheck,
    set: data => {
        if (data.type === 'district') {
            setDataNameCheck.data = data
        }
        if (data.type === 'closetime') {
            setDataNameCheck.data = data
        }
        if (data.type === 'opentime') {
            setDataNameCheck.data = data
        }
        if (data.type === 'setplacehoder') {
            setDataNameCheck.data = data
        }
        if (data.type === 'checkDistrict') {
            setDataNameCheck.data = data
        }
        if (data.type === 'checkDistrictName') {
            setDataNameCheck.data = data
        }
        if (data.type === 'SetCheckCityDistrict') {
            setDataNameCheck.data = data
        }
        if (data.type === 'SetCheckCity') {
            setDataNameCheck.data = data
        }
        if (data.type === 'SetCheckOpen') {
            setDataNameCheck.data = data
        }
        if (data.type === 'SetCheckClose') {
            setDataNameCheck.data = data
        }

        broadcastlistenersName();
    },
    onChange: (key, cb) => {
        listCheckName[key] = () => cb(setDataNameCheck);
    },
    unChange: key => {
        delete listCheckName[key];
    }
};


// const listStoreNamOrDistrict = {};
// let listStore = {
//     data: false
// };
// function broadcastlistenerliststorenameoraddress() {
//     Object.keys(listStoreNamOrDistrict).forEach(k => listStoreNamOrDistrict[k]());
// }
// export const ServiceListNamOrAddress = {
//     get: () => listStore,
//     set: data => {
//         if (data.type === 'LoadDataStoreNameorAddress') {
//             listStore.data = data
//         }
//         if (data.type === 'LOAD_NEXT_PAGE_BY_NAME_ADDREESS') {
//             listStore.data = data
//         }
//         if (data.type === 'LoadPageGotoOne') {
//             listStore.data = data
//         }
//         if (data.type === 'NetWorkErrStoreNameOrAddress') {
//             listStore.data = data
//         }
//         if (data.type === 'CallApiNetworkErr') {
//             listStore.data = data
//         }


//         broadcastlistenerliststorenameoraddress();
//     },
//     onChange: (key, cb) => {
//         listStoreNamOrDistrict[key] = () => cb(listStore);
//     },
//     unChange: key => {
//         delete listStoreNamOrDistrict[key];
//     }
// };


// const listCityDropdown = {};
// let listCity = {
//     data: false
// };
// function broadcastlistenerlistCity() {
//     Object.keys(listCityDropdown).forEach(k => listCityDropdown[k]());
// }
// export const ServiceListCityDropdown = {
//     get: () => listCity,
//     set: data => {
//         if (data.type === 'loadDatCityList') {
//             listCity.data = data;
//         }
//         if (data.type === 'loadCityDrodown') {
//             listCity.data = data;
//         }

//         broadcastlistenerlistCity();
//     },
//     onChange: (key, cb) => {
//         listCityDropdown[key] = () => cb(listCity);
//     },
//     unChange: key => {
//         delete listCityDropdown[key];
//     }
// };





