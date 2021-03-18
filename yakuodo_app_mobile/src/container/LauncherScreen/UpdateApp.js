import React, { PureComponent } from 'react';
import { STRING } from '../../const/String';
import { COLOR_GRAY, COLOR_BLUE_LIGHT, COLOR_GRAY_LIGHT } from '../../const/Color';
import { ButtonLogin } from '../LoginScreen/Item/ButtonLogin';
import { View, Image, StyleSheet, Text } from 'react-native';
import { DEVICE_WIDTH } from '../../const/System';
export class UpdateApp extends PureComponent {
    render() {
        const { title, onPress } = this.props;
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../images/logoyakuodo.png')} resizeMode={'contain'} />
                <Text style={styles.textUpdate} >{title}</Text>

                <ButtonLogin
                    style={{
                        backgroundColor: COLOR_GRAY_LIGHT
                    }}
                    styleText={{
                        color: COLOR_BLUE_LIGHT
                    }}
                    name={STRING.update_app} onPress={onPress}
                />
            </View>

        );
    }

}
const styles = StyleSheet.create({
    image: {
        width: DEVICE_WIDTH / 1.5,
        height: 100,
        marginBottom: 50,


    },
    container: {
        width: DEVICE_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,

    },
    textUpdate: {
        fontSize: 12,
        fontFamily: 'SegoeUI',
        marginBottom: 100,
        color: COLOR_GRAY

    }
});
