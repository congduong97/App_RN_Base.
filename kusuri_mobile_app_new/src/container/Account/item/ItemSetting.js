import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR_GRAY_LIGHT, COLOR_GRAY } from '../../../const/Color';
import { OpenMenu } from '../../../util/module/OpenMenu';

export class ItemSetting extends PureComponent {
  
    render() {
        const { data, end, navigation } = this.props;
        return (
            <TouchableOpacity
                 onPress={() => {
                     navigation.navigate(data.namFunction)
                 
                }}
            >
                <View style={[{ alignItems: 'center', justifyContent: 'space-between', height: 50, borderBottomWidth: end ? 0 : 1, flexDirection: 'row', borderColor: COLOR_GRAY_LIGHT, },this.props.style]}>
                    <Text style={{ color: COLOR_GRAY }}>
                        {data.name}
                    </Text>
                    <Ionicons name={'ios-arrow-forward'} size={25} color={COLOR_GRAY} />
                </View>
            </TouchableOpacity>
        );
    }

}