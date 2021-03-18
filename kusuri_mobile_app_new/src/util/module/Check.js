import Permissions from 'react-native-permissions';


const Check = {
    permissions: (permissions, type, callback) => {
        // console.log('checkpermission', permissions, type);
        if (type) {
            Permissions.check(permissions, { type }).then(response => {
                // console.log('response', response);
                if (response !== 'authorized') {
                    Permissions.request(permissions, { type }).then(async (requestRes) => {
                        // console.log('requestRes', requestRes);
                        if (requestRes !== 'authorized') {
                            const canOpenSettings = await Permissions.canOpenSettings();
                            if (canOpenSettings) {
                                callback(false);
                                Permissions.openSettings();
                            }
                        } else callback(true);
                    });
                } else {
                    callback(true);
                }
            });
        } else {
            Permissions.check(permissions).then(response => {
                if (response !== 'authorized') {
                    Permissions.request(permissions).then((requestRes) => {
                        if (requestRes !== 'authorized') {
                            callback(false);
                        } else callback(true);
                    });
                } else {
                    callback(true);
                }
            });
        }
    }
};
export { Check };
