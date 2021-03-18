import AsyncStorage from '@react-native-community/async-storage';

import { APP_COLOR } from '../../../const/Color';
import { keyAsyncStorage } from '../../../const/System';

export const setColor = async () => {
    const res = await AsyncStorage.getItem(keyAsyncStorage.appColor);
    // console.log("res",res)
    const color = JSON.parse(res);

    if (color) {
        APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1 = color.buttonColor.textColor;
        APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 = color.buttonColor.borderColor;

        APP_COLOR.COLOR_TEXT_BUTTON_TYPE_2 = color.buttonOutlineColor.textColor;
        APP_COLOR.COLOR_BORDER_BUTTON_TYPE_2 = color.buttonOutlineColor.borderColor;

        APP_COLOR.COLOR_TEXT_TAB_BAR_ACTIVE = color.panelActiveColor.textColor;
        APP_COLOR.COLOR_BORDER_TAB_BAR_ACTIVE = color.panelActiveColor.borderColor;

        APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE = color.panelDeactiveColor.textColor;
        APP_COLOR.COLOR_BORDER_TAB_BAR_UN_ACTIVE = color.panelDeactiveColor.borderColor;

        APP_COLOR.COLOR_TEXT = color.textColor.textColor;
        APP_COLOR.BACKGROUND_COLOR = color.backgroundColor.textColor;
    }
};
