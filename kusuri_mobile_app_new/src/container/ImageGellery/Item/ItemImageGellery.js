import React, { PureComponent } from 'react';
import {
    COLOR_BLACK,
    COLOR_BLUE,
    COLOR_GRAY,
    COLOR_GRAY_LIGHT,
    COLOR_WHITE,
} from '../../../const/Color';
import { DEVICE_WIDTH, isIOS, styleInApp } from '../../../const/System';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppImage } from '../../../component/AppImage';


export class ItemImageGellery extends PureComponent {
    onPressVideo = () => {
 
    };
    render() {
        const { data } = this.props;
        return (
            <TouchableOpacity onPress={this.onPressVideo} activeOpacity={0.8} style={styles.wrapperCard}>
                    <AppImage
                        url={data.url}
                        style={styles.wrapperImageAvatarVideo}
                        resizeMode={'cover'}
                        useZoom
                    />
                <View style={styles.wrapperTextVideo}>
                    <Text style={styleInApp.title} >
                        {data.title}
                    </Text>                   
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    wrapperBody: {
        flex: 1,
    },
    wrapperContainer: {
    },
    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textDescriptionCard: {
        fontFamily: 'SegoeUI',
        fontSize: 14
    },
    textTitleCard: {
        color: COLOR_BLACK,
        fontSize: 14,
        fontWeight: 'bold'
    },
    textTimeCard: {
        fontSize: 12,
        color: COLOR_BLUE,
        fontFamily: 'SegoeUI'
    },
    wrapperTextVideo: {
        marginTop: 10,
        width: DEVICE_WIDTH - 40
    },
    wrapperCard: {
        alignItems: 'center',
        padding: 16,
        paddingBottom: 5,
        borderWidth: 1,
        borderColor: COLOR_GRAY_LIGHT
    },
    wrapperImageAvatarVideo: {
        width: DEVICE_WIDTH - 32,
        height: (DEVICE_WIDTH - 32) * (9 / 16),
    },
  
    shadow: isIOS
        ? {
            shadowColor: COLOR_GRAY,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.5
        }
        : {
            elevation: 2
        },
    wrapperSpace: {
        height: 50
    }
});
