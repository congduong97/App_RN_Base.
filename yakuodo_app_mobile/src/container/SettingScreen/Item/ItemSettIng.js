import React, { PureComponent } from 'react';
import { Right, Left, Item } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, Text } from 'react-native';
import { AppImage } from '../../../component/AppImage';
import { COLOR_BLACK, COLOR_GRAY, COLOR_WHITE, COLOR_GRAY_LIGHT } from '../../../const/Color';


export class ItemSetting extends PureComponent {
    render() {
        const { onPress, iconUrl, name, disibleIonGo } = this.props;
        return (

            <Item
                style={styles.itemStyle}
                onPress={onPress}
            >
                <View style={{ flex: 10 }}>
                    <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        {/* <View style={[styles.wrapperIcon, { backgroundColor: COLOR_WHITE }]}>

                            {iconUrl ?
                                <AppImage
                                onPress={onPress}

                                    url={this.props.iconUrl} style={styles.avatarSetting}
                                    resizeMode={'contain'}
                                /> :
                                <Icon name={this.props.nameIcon} color={COLOR_BLACK} size={30} />}
                        </View> */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textTitle}>{name}</Text>

                        </View>

                    </View>

                </View>

                    <View style={{ flex: 0.3 }} >
                        <Icon name="angle-right" size={20} color={COLOR_GRAY} />
                    </View>

            </Item>

        );
    }

}

const styles = StyleSheet.create({
    wrapperBody: {
        flex: 1,
        backgroundColor: COLOR_WHITE
    },
    avatarSetting: {
        width: 30,
        height: 30,
    },
    wrapperIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        marginRight: 16,
        borderRadius: 16,
    },
    itemStyle: {
        backgroundColor: COLOR_WHITE,
        marginLeft: 0,
        paddingLeft: 15,
        alignItems: 'center',
        height: 54,
        paddingRight: 15,
        borderColor: COLOR_GRAY_LIGHT,
    },
    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    textTitle: {
        // fontFamily: 'SegoeUI',
        fontSize: 15,
        textAlign: 'center',
        color: COLOR_BLACK,
        paddingBottom: 0

    },

    wrapperSpace: {
        height: 50,
    }
});
