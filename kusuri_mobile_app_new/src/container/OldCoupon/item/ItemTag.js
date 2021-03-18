import React, { PureComponent } from 'react';
import { STRING } from '../../../const/String';
import { COLOR_RED_LIGHT, COLOR_YELLOW, } from '../../../const/Color';

import { View, Text, StyleSheet } from 'react-native';
import Triangle from 'react-native-triangle';

export default class ItemTag extends PureComponent {
    convertName=(usageScope) => {
        switch (usageScope) {
            case 'GACHA':
            return 'ガチャ';
            case 'STAMP_RALLY':
            return 'スタンプラリー';
            case 'MEMBER':
            return STRING.member_only;
            default :
            return STRING.shop_only;

        }
    }
    render() {
        const { usageScope } = this.props;
        return (
            <View style={{ flexDirection: 'row' }}>
            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: usageScope == 'MEMBER' ? COLOR_YELLOW : COLOR_RED_LIGHT,
                    justifyContent: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginBottom: 10,
                    height: 24,
                    // width:100,
                }}

            >
                <View>
                    <Text style={[styles.textDescription, { color: 'white' }]}>{this.convertName(usageScope)}</Text>
                </View>
            </View>
                <Triangle
                    width={12}
                    height={24}
                    color={this.props.usageScope == 'MEMBER' ? COLOR_YELLOW : COLOR_RED_LIGHT}
                    direction={'right'}
                />
            </View>

        );
    }
}
const styles = StyleSheet.create({
    textDescription: {
        fontFamily: 'SegoeUI',
        fontSize: 11,
    },
});
