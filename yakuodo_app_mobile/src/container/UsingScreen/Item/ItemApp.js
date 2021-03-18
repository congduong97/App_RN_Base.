import React, { PureComponent } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_YELLOW, APP_COLOR } from '../../../const/Color';
import { STRING } from '../../../const/String';
import { versionApp, isIOS } from '../../../const/System';
export const ItemApp = () => (
        <View style={[styles.wrappperContaner, { borderColor: APP_COLOR.COLOR_TEXT }]}>
            <View style={styles.top} >
                <Image style={styles.image} resizeMode={'contain'} source={require('../../../images/playstore-icon.png')} />
                <View style={styles.wrappperTextTop} >
                    <Text>{`薬王堂アプリ ${isIOS ? 'IOS' : 'Android'} 版アプリ`}</Text>
                    <Text>{`${STRING.version} ${versionApp}`}</Text>

                    </View>

            </View >

            <Text style={styles.textBottom} >{'このアプリは薬王堂公式アプリです。'}</Text>
            
        </View>
    );
const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,

    },
    wrappperContaner: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: COLOR_YELLOW,

    },
    wrappperTextTop: {
        paddingLeft: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 50,

    },
    top: {
    
        flexDirection: 'row',

    },
    textBottom: {
        fontSize: 14,
        color: COLOR_GRAY,
        marginTop: 5,
    }


});
