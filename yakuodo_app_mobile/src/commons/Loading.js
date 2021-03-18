import React, { Component } from 'react';
import {
    View, StyleSheet, ActivityIndicator, Image
} from 'react-native';
import Spinkit from 'react-native-spinkit';

import { APP_COLOR } from '../const/Color';

export default class Loading extends Component {
    render() {
        const { size } = this.props;
        return (
            <View style={[styles.wrapperCenter, this.props.style]} >
                    <Image style={{ height: size ? size * 2 : 50, width: size || 25 }} resizeMode={'cover'} source={require('../images/loaddinggif.gif')} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapperCenter: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
});
