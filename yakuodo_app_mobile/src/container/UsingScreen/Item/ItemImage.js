import React, { PureComponent } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { AppImage } from '../../../component/AppImage';
import { COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_YELLOW, COLOR_BLACK, APP_COLOR } from '../../../const/Color';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '../../../const/System';
export const ItemImage = (props) => (
        <View style={[styles.wrapperContainer, { borderColor: APP_COLOR.COLOR_TEXT }]}>
            <View style={styles.wrapperText} >
                <Text style={styles.text}>
                    {props.data.title}
                </Text>
            </View>
          
            <AppImage style={styles.image} resizeMode={'contain'} url={props.data.url} />
            <View style={{ width: '100%' }}>
            <Text style={{ fontSize: 12, color: COLOR_GRAY, marginTop: 7, marginBottom: 7, left: 0 }} >{props.data.description}</Text>

            </View>

        </View>
    );
const styles = StyleSheet.create({
    wrapperContainer: {
        padding: 16,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    image: {
        height: (DEVICE_WIDTH - 50) * 16 / 9,
        width: DEVICE_WIDTH - 50,

    },
    wrapperText: {
        justifyContent: 'center',
        height: 30,
        borderBottomColor: COLOR_GRAY_LIGHT,
        borderBottomWidth: 1,
        width: '100%'

    },
    text: {
        fontSize: 14,
        color: COLOR_BLACK
    }

})
;
