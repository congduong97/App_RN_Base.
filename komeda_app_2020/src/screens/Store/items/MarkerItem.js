import React from 'react';
import {View} from 'react-native';
import MapView from 'react-native-maps';
import {AppIcon, AppText} from '../../../elements';
import {COLOR, SIZE} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

const MarkerItem = (props) => {
  const navigation = useNavigation();
  const {latitude15, longitude16, name2, address6} = props.data;
  return (
    <MapView.Marker
      tracksViewChanges={false}
      coordinate={{
        latitude: latitude15,
        longitude: longitude16,
      }}>
      <AppIcon
        icon={'location-on'}
        iconSize={40}
        type={'MaterialIcons'}
        iconColor={'#68463A'}
      />
      <MapView.Callout
        tooltip
        onPress={() =>
          navigation.navigate(keyNavigation.STORE_DETAIL, {data: props.data})
        }>
        <View>
          <View
            style={{
              width: 300,
              paddingVertical: 10,
              paddingHorizontal: 22,
              backgroundColor: 'white',
              borderColor: '#68463A',
              borderWidth: 2,
            }}>
            <AppText
              style={{
                color: COLOR.main_color,
                fontFamily: 'irohamaru-Medium',
                textAlign: 'center',
                fontSize: SIZE.H4,
                marginBottom: 10,
              }}>
              {name2}
            </AppText>
            <AppText
              style={{
                color: '#6D4C40',
                fontSize: SIZE.H6,
                textAlign: 'center',
              }}>
              {address6}
            </AppText>
          </View>
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderBottomWidth: 14,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#6D4C40',
              transform: [{rotate: '180deg'}],
            }}
          />
        </View>
      </MapView.Callout>
    </MapView.Marker>
  );
};

export default MarkerItem;

// (R U) (R’ U) (R U2) R’
// (R U R' F') (R U R' U') (R' F) (R2 U') (R' U')
// R2U RU R'U' R'U' R'UR' - RU'RU RU RU' R'U'R2
