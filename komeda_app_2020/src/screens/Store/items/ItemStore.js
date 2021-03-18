import React, {useRef} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SIZE, COLOR} from '../../../utils';
import {AppText, AppIcon} from '../../../elements';

export default function ItemStore(props) {
  const {name2, address6, distance} = props.data;
  const navigation = useNavigation();

  const navToDetail = () => {
    navigation.navigate('STORE_DETAIL', {data: props.data});
  };

  const distanceConvert = useRef('');

  if (distance && distance > 0) {
    if (Math.ceil(distance) < 1000) {
      distanceConvert.current = `${Math.ceil(distance)}m`;
    } else {
      distanceConvert.current = `${Math.ceil(distance / 1000)}km`;
    }
  }

  return (
    <TouchableOpacity
      onPress={navToDetail}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        paddingVertical: 22,
        paddingHorizontal: SIZE.padding,
        backgroundColor: COLOR.white,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: COLOR.grey_300,
        borderBottomWidth: 0.8,
      }}>
      {!!distance && (
        <View
          style={{
            backgroundColor: '#68463A',
            height: 30,
            width: 30,
            borderRadius: 15,
            justifyContent: 'center',
            marginHorizontal: 14,
          }}>
          <AppText
            style={{
              color: COLOR.white,
              alignSelf: 'center',
              fontSize: SIZE.H5,
            }}>
            {props.index + 1}
          </AppText>
        </View>
      )}
      <View style={{flex: 1}}>
        <AppText
          style={{
            fontSize: SIZE.H5,
            marginRight: 10,
            fontFamily: 'irohamaru-Medium',
          }}>
          {name2}{' '}
          {distance && (
            <AppText style={{fontSize: SIZE.H6}}>
              ({distanceConvert.current})
            </AppText>
          )}
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H6,
            marginRight: 10,
            flex: 1,
            color: '#8c8c8c',
            marginTop: 10,
          }}>
          {address6}
        </AppText>
      </View>
      <AppIcon
        type={'Entypo'}
        icon={'chevron-thin-right'}
        iconColor={'#AFAFAF'}
        iconSize={24}
      />
    </TouchableOpacity>
  );
}
