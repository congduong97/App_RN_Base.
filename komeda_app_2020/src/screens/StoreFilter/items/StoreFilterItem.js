import React from 'react';
import {View} from 'react-native';
import {AppText, AppIcon} from '../../../elements';
import {SIZE, COLOR} from '../../../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

export default function StoreFilterItem(props) {
  const {name2, address6} = props.data;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('STORE_DETAIL', {data: props.data})}
      activeOpacity={0.8}
      style={{
        flex: 1,
        width: SIZE.device_width,
        flexDirection: 'row',
        padding: SIZE.padding,
        backgroundColor: COLOR.white,
        paddingHorizontal: SIZE.padding,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: COLOR.grey_300,
        borderBottomWidth: 0.8,
      }}>
      <View style={{flex: 1}}>
        <AppText style={{fontSize: SIZE.H5, marginRight: 10}}>{name2}</AppText>
        <AppText
          style={{
            fontSize: SIZE.H6,
            marginRight: 10,
            flex: 1,
            color: '#4D4D4D',
            marginTop: 10,
          }}>
          {address6}
        </AppText>
      </View>
      <AppIcon
        type={'Entypo'}
        icon={'chevron-thin-right'}
        iconColor={COLOR.grey_500}
        iconSize={24}
      />
    </TouchableOpacity>
  );
}
