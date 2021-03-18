import { Alert, PermissionsAndroid } from 'react-native';
import { STRING } from '../../const/String';
import Permissions from 'react-native-permissions';
import { isIOS } from '../../const/System';

const AlertPermissionsLocation = () => {
    Alert.alert(
        STRING.permission,
        STRING.need_enable_enable_location,
        [{ text: STRING.cancel }, { text: STRING.ok, onPress: () => isIOS ? Permissions.openSettings() : () => { } }],
        { cancelable: false }
    );
};

const AlertPermissionsLocationAndroidRejected = () => {
    Alert.alert(
        STRING.permission,
        STRING.need_enable_location_android_rejected,
        [{ text: STRING.cancel }, { text: STRING.ok, onPress: () => isIOS ? Permissions.openSettings() : () => { } }],
        { cancelable: false }
    );
};


export const checkPermissionsWhenInUse = async () => {
    const response = await Permissions.check('location', { type: 'whenInUse' });
    // console.log('response', response);
    if (response === 'authorized') {
        return true;
    }
    if (response === 'undetermined') {
        // console.log('ooooooo')
        const responsePemissitions = await Permissions.request('location', { type: 'always' });
        // console.log('responsePemissitions',responsePemissitions)
        if (responsePemissitions === 'authorized') {
            return true;
        }
        AlertPermissionsLocation();
        return false;
    }

    if (response === 'denied' && isIOS) {
        return await checkPermissionsAlways();
    }
    if (response === 'restricted' && !isIOS) {
        return await checkPermissionsAlways();
    }
    if (response !== 'authorized') {
        const responsePemissitions = await Permissions.request('location', { type: 'always' });
        if (responsePemissitions === 'authorized') {
            return true;
        }
        AlertPermissionsLocation();
        return false;
    }
};

const checkPermissionsAlways = async () => {
    const response = await Permissions.check('location', { type: 'always' });
    if (response === 'denied' && isIOS) {
        AlertPermissionsLocation();
        return false;
    }
    if (response === 'restricted' && !isIOS) {
        AlertPermissionsLocationAndroidRejected();
        return false;
    }
    if (response !== 'authorized') {
        const responsePemissitions = await Permissions.request('location', { type: 'always' });
        if (responsePemissitions === 'authorized') {
            return true;
        }
        AlertPermissionsLocation();
        return false;
    }
};

export const checkLocationPermissionForAndroid = async () => {
    let granted = await PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION");
    if (granted !== "granted")
        return false;
    return true;
}

export const requestLocationPermissionForAndroid = async () => {
    let granted = await PermissionsAndroid.requestMultiple([
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION"
    ]);
    if (granted["android.permission.ACCESS_FINE_LOCATION"] == "granted" &&
        granted["android.permission.ACCESS_COARSE_LOCATION"] == "granted")
        return true;
    return false;
}


export const checkLocationPermissionForIOS = async () => {
    const response = await Permissions.check('location');
    if (response === "authorized" || response === "restricted") {
        return true;
    }

    if (response === "denied" || response === "undetermined") {
        AlertPermissionsLocation()
        return false;
    }
}