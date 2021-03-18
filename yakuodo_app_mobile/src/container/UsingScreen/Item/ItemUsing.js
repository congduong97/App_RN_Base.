import React, { PureComponent } from 'react';
import { Item, Right, Left, View } from 'native-base';
import Icons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {
    Text, StyleSheet
} from 'react-native';
import { COLOR_GRAY, COLOR_WHITE, COLOR_YELLOW, COLOR_BLACK, COLOR_GRAY_LIGHT, APP_COLOR } from '../../../const/Color';
export class ItemUsing extends PureComponent {
    render() {
        const { title, description } = this.props.data;
        // console.log('this.props.data', this.props.data);
        const { navigation, index, detail } = this.props;
        return (
            <View
                style={[styles.wrapperContainer, { borderColor: APP_COLOR.COLOR_TEXT }]}
            >
                <View style={{ width: '100%', borderBottomColor: COLOR_GRAY_LIGHT, borderBottomWidth: 1, marginBottom: 5 }}>
                    <View style={{ height: 30, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.wrapperIcon, { backgroundColor: COLOR_WHITE }]} >
                            <View style={[styles.wrapperOrder]}>
                                <Text style={styles.textOrder}>{index + 1}</Text>
                            </View>
                        </View>


                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, fontFamily: 'SegoeUI' }}>{title}</Text>

                        </View>

                    </View>


                </View>
                <Text style={{ fontSize: 12, color: COLOR_GRAY, marginTop: 7, marginBottom: 7 }}>{description}</Text>


            </View>
        );
    }
}
const styles = StyleSheet.create({
    wrapperBody: {
        flex: 1,
        backgroundColor: COLOR_WHITE,
        padding: 16
    },

    textOrder: {
        fontSize: 10,
        color: COLOR_YELLOW
    },
    wrapperOrder: {
        height: 18,
        width: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLOR_YELLOW,


    },
    wrapperIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        marginRight: 16,
        borderRadius: 16,
    },


    textTitle: {
        // fontFamily: 'SegoeUI',
        fontSize: 15,
        textAlign: 'center',
        color: COLOR_BLACK,
        paddingBottom: 0

    },

    wrapperContainer: {
        padding: 5,
        backgroundColor: COLOR_WHITE,
        paddingLeft: 15,
        borderColor: COLOR_GRAY_LIGHT,
        borderBottomWidth: 1,
        flexDirection: 'column',
    }
});
