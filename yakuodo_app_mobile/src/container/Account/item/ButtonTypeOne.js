import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { COLOR_BLUE_LIGHT,COLOR_GRAY } from '../../../const/Color';
import { ButtonLogin } from '../../LoginScreen/Item/ButtonLogin';

export  class ButtonTypeOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onPress, name, loading, activebutton } = this.props
        return (
            <ButtonLogin
                activeOpacity={activebutton ? 0.5 : 1}
                loadingLogin={loading}
                name={name}  onPress={onPress} 
                style={{ marginTop: 0, backgroundColor: activebutton ? COLOR_BLUE_LIGHT : COLOR_GRAY, width: '100%' }}
            />
        );
    }
}
