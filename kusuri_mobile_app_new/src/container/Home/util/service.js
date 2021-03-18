const listeners = {};
let notificationCount = 0;

function broadcast() {
    Object.keys(listeners).forEach(k => listeners[k]());
}

export const NumberNewNofitification = {
    get: () => notificationCount,
    set: count => {
        // console.log('SET-COUNT', count);
        if(Number.isInteger(count)){
            notificationCount = count;
            broadcast();
        }
      
    },
    onChange: (key, cb) => {
        listeners[key] = () => cb(notificationCount);
    },
    unChange: key => {
        delete listeners[key];
    }
};


const listenersdrawerControl = {};
let drawerControl = false;

function broadcastlistenersdrawerControl() {
    Object.keys(listenersdrawerControl).forEach(k => listenersdrawerControl[k]());
}

export const DrawerControl = {
    get: () => drawerControl,
    set: count => {
        // console.log('SET-COUNT', count);
        drawerControl = count;
        broadcastlistenersdrawerControl();
    },
    onChange: (key, cb) => {
        listenersdrawerControl[key] = () => cb(drawerControl);
    },
    unChange: key => {
        delete listenersdrawerControl[key];
    }
};
const listenerClickWhenScreenPasswordNotification = {};
let notification = false;

function broadcastClickWhenScreenPasswordNotification() {
    Object.keys(listenerClickWhenScreenPasswordNotification).forEach(k => listenerClickWhenScreenPasswordNotification[k]());
}

export const ClickWhenScreenPasswordNotification = {
    get: () => drawerControl,
    set: count => {
        // console.log('SET-COUNT', count);
        notification = count;
        broadcastClickWhenScreenPasswordNotification();
    },
    onChange: (key, cb) => {
        listenerClickWhenScreenPasswordNotification[key] = () => cb(notification);
    },
    unChange: key => {
        delete listenerClickWhenScreenPasswordNotification[key];
    }
};
