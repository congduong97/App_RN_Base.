import React, { PureComponent } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaitain from 'react-native-vector-icons/FontAwesome';
import { COLOR_GRAY } from '../const/Color';
import { STRING } from '../const/String';

const { width } = Dimensions.get('window');
export default class NetworkError extends PureComponent {
    render() {
        const { onPress, iconName, iconSize, textStyle, title } = this.props;
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={1}
                style={[styles.wrapperCenter, this.props.style]}
            >
                <View
                    style={[styles.wrapperCenter, { paddingHorizontal: 16 }]}
                >   
                {iconName === 'gears' ?
                <IconMaitain name={iconName} size={iconSize || 80} color={COLOR_GRAY} /> : 
            
                    <Icon name={iconName || 'wifi-off'} size={iconSize || 80} color={COLOR_GRAY} />}
                    <Text
                        // numberOfLines={2}
                        style={[styles.textError, textStyle]}
                    >{title || STRING.please_try_again_later}</Text>
                </View>
            </TouchableOpacity >
        );
    }
}

const styles = StyleSheet.create({
    wrapperCenter: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        // width,
        flex:1
    },
    textError: {
        // paddingHorizontal: 16,

        marginTop: 20,
        color: COLOR_GRAY,
        fontSize: 20,
        textAlign: 'center'
    }
});
