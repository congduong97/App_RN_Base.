const listCheckBox = {};
let setData = {
    data: false
};
function broadcastlistenersCheckBox() {
    Object.keys(listCheckBox).forEach(k => listCheckBox[k]());
}
export const setValueCheckBox = {
    get: () => setData,
    set: data => {
        setData.data = data
        broadcastlistenersCheckBox();
    },
    onChange: (key, cb) => {
        listCheckBox[key] = () => cb(setData);
    },
    unChange: key => {
        delete listCheckBox[key];
    }
};

const listCheckBoxCheckBox = {};
let data = [];
let checkBox = [];
function broadcastlistenersCheckBoxStore() {
    Object.keys(listCheckBoxCheckBox).forEach(k => listCheckBoxCheckBox[k]());
}
export const CheckBoxSearchService = {
    get: () => data,
    set: newData => {
        if (newData.type === 'setcheckbox') {
            data.push(newData.data)
        }
        if (newData.type === 'addData') {
            data.push(newData.iDCheck)
        }
        if (newData.type === 'checkLoadBox') {
            data = [...checkBox]
        }
        if (newData.type === 'delete') {
            for (let i = 0; i <= data.length; i++) {
                if (data[i] === newData.iDCheck) {
                    data.splice(i, 1);
                }
            }
        }
        broadcastlistenersCheckBoxStore();
    },
    onChange: (key, cb) => {
        listCheckBoxCheckBox[key] = () => cb(data);
    },
    unChange: key => {
        if (listCheckBoxCheckBox[key]) {
            delete listCheckBoxCheckBox[key];
        }
    }
};


const checkListCheckBoxTrueFalse = {};
let datacheckbox = {
    data: false
};
function broadcastlistenersCheckBoxTrueFalse() {
    Object.keys(checkListCheckBoxTrueFalse).forEach(k => checkListCheckBoxTrueFalse[k]());
}
export const ServiceCheckTrueandFlaseCheckBox = {
    get: () => datacheckbox,
    set: data => {
        if (data.type === 'checkedDelete') {
            datacheckbox.data = data
        }
        if(data.type==='SetNameCheckBox'){
            datacheckbox.data = data
        }

        broadcastlistenersCheckBoxTrueFalse();
    },
    onChange: (key, cb) => {
        checkListCheckBoxTrueFalse[key] = () => cb(datacheckbox);
    },
    unChange: key => {
        delete checkListCheckBoxTrueFalse[key];
    }
};






// const listStoreMoreOptions = {};
// let listStoreSumMoreOptions = {
//     data: false
// };
// function broadcastlistenermorestoreoptions() {
//     Object.keys(listStoreMoreOptions).forEach(k => listStoreMoreOptions[k]());
// }
// export const ServiceListStoreMoreOptions = {
//     get: () => listStoreSumMoreOptions,
//     set: data => {
//         // if (data.type === 'LOAD_NEXT_PAGE_BY_NAME') {
//         //     listStoreSumMoreOptions.data = data
//         // }
//         // if (data.type === 'LoadNextPageStoreMoreOptions') {
//         //     listStoreSumMoreOptions.data = data
//         // }
//         // if (data.type === 'LoadPageOneTagId') {
//         //     listStoreSumMoreOptions.data = data
//         // }
//         // if (data.type === 'LoadPageStoreMoreOptionsGotoOne') {
//         //     listStoreSumMoreOptions.data = data
//         // }
//         // if (data.type === 'errLoading') {
//         //     listStoreSumMoreOptions.data = data
//         // }

//         broadcastlistenermorestoreoptions();
//     },
//     onChange: (key, cb) => {
//         listStoreMoreOptions[key] = () => cb(listStoreSumMoreOptions);
//     },
//     unChange: key => {
//         delete listStoreMoreOptions[key];
//     }
// };


const listCheckBoxCheckBoxName = {};
let dataName = {
    city: {
    },
    district: {
    },
    startTime: {
    },
    closeTime: {
    }
}
function broadcastlistenersCheckBoxNameStore() {
    Object.keys(listCheckBoxCheckBoxName).forEach(k => listCheckBoxCheckBoxName[k]());
}
export const CheckBoxNameService = {
    get: () => dataName,
    set: newData => {
        dataName = { ...dataName, ...newData }
        broadcastlistenersCheckBoxNameStore();
    },
    onChange: (key, cb) => {
        listCheckBoxCheckBoxName[key] = () => cb(dataName);
    },
    unChange: key => {
        if (listCheckBoxCheckBoxName[key]) {
            delete listCheckBoxCheckBoxName[key];
        }
    }
};



const listCheckBoxCheckBoxStore = {};
let dataCheck = {
    listCheckBox: {
    },
}
function broadcastlistenersCheckBoxStoreCheck() {
    Object.keys(listCheckBoxCheckBoxStore).forEach(k => listCheckBoxCheckBoxStore[k]());
}
export const CheckBoxService = {
    get: () => dataCheck,
    set: newData => {
        dataCheck = { ...dataCheck, ...newData }
        // console.log(dataCheck)
        broadcastlistenersCheckBoxStoreCheck();
    },
    onChange: (key, cb) => {
        listCheckBoxCheckBoxStore[key] = () => cb(dataCheck);
    },
    unChange: key => {
        if (listCheckBoxCheckBoxStore[key]) {
            delete listCheckBoxCheckBoxStore[key];
        }
    }
};


