import AsyncStorage from '@react-native-community/async-storage';

import { APP_COLOR } from '../../const/Color';

export const setColor = async () => {
    const res = await AsyncStorage.getItem('appColor');
    const arrayColor = JSON.parse(res);

    if (arrayColor != null && Array.isArray(arrayColor)) {
        APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1 = arrayColor[0].textColor;
        APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 = arrayColor[0].borderColor;

        APP_COLOR.COLOR_TEXT_BUTTON_TYPE_2 = arrayColor[1].textColor;
        APP_COLOR.COLOR_BORDER_BUTTON_TYPE_2 = arrayColor[1].borderColor;

        APP_COLOR.COLOR_TEXT_TAB_BAR_ACTIVE = arrayColor[2].textColor;
        APP_COLOR.COLOR_BORDER_TAB_BAR_ACTIVE = arrayColor[2].borderColor;

        APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE = arrayColor[3].textColor;
        APP_COLOR.COLOR_BORDER_TAB_BAR_UN_ACTIVE = arrayColor[3].borderColor;

        APP_COLOR.COLOR_TEXT = arrayColor[4].textColor;
    }
};
