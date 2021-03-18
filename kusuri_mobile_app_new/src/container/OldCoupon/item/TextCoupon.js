import React from 'react';
import { View, Text } from 'react-native';
import { COLOR_GRAY } from '../../../const/Color';
import { StyleSheet } from 'react-native';
export const TextCoupon = (props) => (
    <View style={[styles.wrapperItem, { alignItems: 'center' }]}>

        <Text style={[styles.textTitleItem]}>
            {props.name} : {props.data}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    textTitleItem: {
        fontFamily: 'SegoeUI',
        color: COLOR_GRAY,
        fontSize: 14,
    },
    wrapperItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
});
