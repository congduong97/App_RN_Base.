import React, { Component } from 'react';
import {
    View, StyleSheet
} from 'react-native';
import Spinkit from 'react-native-spinkit';

import { APP_COLOR } from '../const/Color';

export default class Loading extends Component {
    render() {
        return (
            <View style={[styles.wrapperCenter, this.props.style]}>
                    <Spinkit
                        type='ThreeBounce'
                        color={this.props.color ? this.props.color : APP_COLOR.COLOR_TEXT}
                    /> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
});
