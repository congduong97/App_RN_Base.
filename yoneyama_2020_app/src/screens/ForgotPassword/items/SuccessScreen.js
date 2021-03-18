//Library:
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {SIZE, COLOR} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppText} from '../../../elements/AppText';

const SuccessScreen = ({closeModal, mode}) => {
  const navigation = useNavigation();
  const onClose = () => {
    if (mode === 'mypage') {
      navigation.reset({
        index: 1,
        routes: [{name: keyNavigation.GUIDE}],
      });
    }
    closeModal();
  };
  return (
    <View
      style={{
        backgroundColor: COLOR.white,
        padding: 20,
        width: SIZE.device_width,
        paddingBottom: 60,
      }}>
      <TouchableOpacity
        hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
        onPress={onClose}
        style={{position: 'absolute', right: 16, top: 16}}>
        <AntDesign name="close" size={SIZE.H1 * 1.2} />
      </TouchableOpacity>
      <AppText
        style={{
          marginVertical: 20,
          alignSelf: 'center',
          fontSize: SIZE.H3,
          fontWeight: 'bold',
        }}>
        登録完了
      </AppText>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingVertical: 40,
          borderColor: COLOR.grey_300,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.2}}>
          パスワードの登録が完了しました。
          携帯電話番号、パスワードのご変更はマイページからご変更可能です。
        </AppText>
      </View>

      <TouchableOpacity
        onPress={onClose}
        style={{
          padding: 14,
          marginTop: 20,
          backgroundColor: COLOR.grey,
          borderRadius: SIZE.border_radius,
        }}>
        <AppText style={{fontSize: SIZE.H4, alignSelf: 'center'}}>
          閉じる
        </AppText>
      </TouchableOpacity>
    </View>
  );
};
export default SuccessScreen;
