import React, { PureComponent } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { COLOR_GRAY, COLOR_WHITE } from '../const/Color';
import { STRING } from '../const/String';
import { DEVICE_HEIGHT } from '../const/System';
export default class NoData extends PureComponent {
    render() {
        const { title } = this.props;
        return (
            <ScrollView style={{ flex: 1, height: DEVICE_HEIGHT }} {...this.props}>
                <View style={{ height: DEVICE_HEIGHT / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_WHITE }}>
                    <Text style={{ color: COLOR_GRAY }}>
                        {title || STRING.no_data_available}
                    </Text>

                </View>
            </ScrollView>

        );
    }

}
