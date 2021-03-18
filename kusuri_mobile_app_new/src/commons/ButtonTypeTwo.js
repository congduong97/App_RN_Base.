import React, { PureComponent } from 'react';
import ButtonTypeOne from './ButtonTypeOne';
import { APP_COLOR, COLOR_WHITE } from '../const/Color';
import { STRING } from '../const/String';
export default class ButtonTypeTwo extends PureComponent {
    render() {
        const { loading, name, onPress, styleText, style } = this.props;
        return (
            <ButtonTypeOne
            loading={loading}
            styleText={[{ color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_2 }, styleText]}
            style={[{ backgroundColor: COLOR_WHITE, borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_2, borderWidth: 2 },style]}
            name={name} onPress={onPress} 
            />
        );
    }
}
