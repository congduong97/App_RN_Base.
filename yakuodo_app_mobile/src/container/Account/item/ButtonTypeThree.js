import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { COLOR_BLUE_LIGHT, } from '../../../const/Color';
import { ButtonLogin,COLOR_WHITE } from '../../LoginScreen/Item/ButtonLogin';

export  class ButtonTypeThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onPress, name, loading, activebutton,style } = this.props
        return (
            <ButtonLogin
                loadingLogin={loading}
                name={name}
                onPress={onPress}
                styleText={{ color: COLOR_BLUE_LIGHT }}
                style={[{ marginTop: 0, backgroundColor: COLOR_WHITE, borderColor: COLOR_BLUE_LIGHT, borderWidth: 1, width: '100%' },style]}
            />
        );
    }
}
