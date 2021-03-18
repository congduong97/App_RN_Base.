//Lybrary:
import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
//Setup:
import {COLOR, SIZE} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {CardInformationUser} from './items/CardInformationUser';
import {AppHeader, AppText} from '../../elements';

//Services:
const MyPage = ({route}) => {
  const refScroll = useRef(null);
  const cardInforUser = useRef(null);
  const navigation = useNavigation();
  useEffect(() => {
    return () => {};
  }, []);

  const changeAccountHeader = () => {
    navigation.navigate(keyNavigation.LOGIN, {});
  };
  const renderRightHeader = () => {
    return (
      <TouchableOpacity onPress={changeAccountHeader}>
        <AppText
          style={{
            color: COLOR.COFFEE_BROWN,
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H5 * 1.05,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: COLOR.COFFEE_BROWN,
          }}>
          ログアウト
        </AppText>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <AppHeader title={'マイアカウント'} leftGoBack />
      <ScrollView showsVerticalScrollIndicator={false} ref={refScroll}>
        <CardInformationUser ref={cardInforUser} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textRightHeader: {
    fontSize: SIZE.H5,
    color: COLOR.black,
    textDecorationLine: 'underline',
  },
  header: {
    backgroundColor: COLOR.main_color_bold,
    marginBottom: 2,
  },
  title: {
    alignSelf: 'center',
    fontSize: SIZE.H4,
    color: COLOR.main_color,
    marginVertical: 12,
  },
});

export default MyPage;
