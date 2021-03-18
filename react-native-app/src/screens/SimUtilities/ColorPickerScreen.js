import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Color} from '../../commons/constants';
// import Slider from '@react-native-community/slider';
import {ratioW} from '../../commons/utils/devices';

export default function ColorPickerScreen(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const {color, onChangeColor = onChange} = route.params;
  return (
    <View style={{flex: 1, paddingHorizontal: 20 * ratioW}}>
      <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => navigation.goBack()}>
          <Text
            style={{color: Color.MayaBlue, fontSize: 18, fontWeight: 'bold'}}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
}
