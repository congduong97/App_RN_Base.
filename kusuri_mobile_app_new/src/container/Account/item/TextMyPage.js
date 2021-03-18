import React from 'react';
import { View, Text } from 'react-native';
import { COLOR_GRAY, APP_COLOR } from '../../../const/Color';
export const TextMyPage = (props) => 
    <View style={[{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, }, props.style ]}>
        <Text style={{ color: COLOR_GRAY, fontSize: 16 }}>{props.textLeft}</Text>
        <Text style={{ color: APP_COLOR.COLOR_TEXT, fontSize: 16 }}>{props.textRight}</Text>
    </View>;
