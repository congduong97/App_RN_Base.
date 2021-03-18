import React, { PureComponent } from 'react';
import { STRING } from '../util/string';
import { COLOR_GRAY, COLOR_RED, COLOR_GRAY_LIGHT } from '../../../const/Color';
import { ButtonTypeOne } from '../../../commons';
import { View, StyleSheet, Text, Image } from 'react-native';
import { DEVICE_WIDTH } from '../../../const/System';
export class UpdateApp extends PureComponent {
    render() {
        const { title, onPress } = this.props;
        return (
            <View style={styles.container}>
                <Image style={{ width: 128, height: 128, marginTop: 20, marginBottom: 10 }} source={require('../images/AppIcon2.png')} resizeMode={'contain'} />

                <Text style={styles.textUpdate} >{title}</Text>

                <ButtonTypeOne
                    style={{
                        backgroundColor: COLOR_GRAY_LIGHT
                    }}
                    styleText={{
                        color: COLOR_RED
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
        marginVertical: 50,
        color: COLOR_GRAY

    }
});
