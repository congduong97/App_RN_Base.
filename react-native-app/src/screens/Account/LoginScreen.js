import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import OneSignal from 'react-native-onesignal';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {Color, Font, Icon} from '../../commons/constants';
import {isValidPhoneNumber} from '../../commons/utils/validate';
import {InputView, ScreensView, TextView} from '../../components';
import AppNavigate from '../../navigations/AppNavigate';
import API from '../../networking';
import styles from './styles';
import models from '../../models';

export default function LoginScreen(props) {
  const {} = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isSignOutSuccess = useSelector(
    (state) => state.AccountReducer.isSignOutSuccess,
  );
  const refLogin = useRef({
    username: '',
    password: '',
  });

  useEffect(() => {
    return () => {
      refLogin.current = {};
    };
  }, []);

  useEffect(() => {
    isSignOutSuccess && removeOneSignal();
  }, [isSignOutSuccess]);

  const removeOneSignal = async () => {
    OneSignal.sendOutcomeWithValue('id', '');
    OneSignal.deleteTag('id');
    OneSignal.setSubscription(false);
    OneSignal.removeExternalUserId();
    OneSignal.removeEventListener('received');
    OneSignal.removeEventListener('opened');
    OneSignal.removeEventListener('ids');
  };

  const handleLoginResponse = async () => {
    OneSignal.setSubscription(true);
    //remove tag after user login
    OneSignal.deleteTag('deviceId');
    // send new tag after user login successfull
    OneSignal.sendTag('id', models.getAccountId().toString());
    let isDone = await API.requestDataAfterAuthent(dispatch, {});
    isDone && AppNavigate.navigateWhenAppStart(navigation.dispatch);
  };

  const handleChangeValue = ({id, data}) => {
    refLogin.current[id] = data;
  };

  const checkInput = () => {
    if (!isValidPhoneNumber(refLogin.current['username'])) {
      Toast.show('Số điện thoại sai định dạng');
      return false;
    }
    if (refLogin.current['password'] < 6) {
      Toast.show('Không được để trống mật khẩu');
      return false;
    }
    return true;
  };
  const handleCheckInput = ({id, data}) => {
    if (id === 'username') {
      return isValidPhoneNumber(data);
    } else if (id === 'password') {
      return data.length >= 6;
    }
  };

  const handleOnPress = async ({id}) => {
    if (id === 'Type-SignIn') {
      if (checkInput()) {
        let isSignined = await API.requestAccountSignin(
          dispatch,
          refLogin.current,
        );
        if (isSignined) {
          handleLoginResponse();
        } else {
          OneSignal.sendTag('id', '');
          Alert.alert(
            'Đăng nhập thất bại',
            'Vui lòng kiểm tra lại thông tin đăng nhập',
            [
              {
                text: 'Đóng',
              },
            ],
            {
              cancelable: false,
            },
          );
        }
      }
    } else if (id === 'Type-SignUp') {
      AppNavigate.navigateToSignUpScreen(navigation.dispatch);
    }
  };

  return (
    <ScreensView
      isToolbar={false}
      // styleBackground={{backgroundColor: 'white'}}
      bgColorStatusBar="white">
      <Image source={Icon.logo} style={styles.logoImage} />
      <View style={styles.containsForm}>
        <InputView
          id={'username'}
          iconLeft={'user'}
          iconLeftSize={18}
          label={<Text>{'Số điện thoại'}</Text>}
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            // flex: 1,
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nhập số điện thoại..."
          onChangeText={handleChangeValue}
          keyboardType="phone-pad"
          returnKeyType="next"
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'Số điện thoại không đúng định dạng'}
        />

        <InputView
          id={'password'}
          iconLeft={'padlock'}
          iconLeftSize={18}
          // isShowLabel
          label={<Text>{'Mật khẩu'} </Text>}
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nhập mật khẩu..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          returnKeyType="done"
          secureTextEntry={true}
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'Mật khẩu không đúng định dạng'}
        />

        <TextView
          id={'Type-SignIn'}
          onPress={handleOnPress}
          style={styles.styleButton}
          styleValue={styles.styleTextButton}
          value={'ĐĂNG NHẬP'}
        />

        <TouchableOpacity
          // onPress={this.onPressForotPassword}
          style={{alignSelf: 'flex-end', marginRight: 20}}>
          <Text style={styles.textDecoration}>Lấy lại mật khẩu</Text>
        </TouchableOpacity>
      </View>
      <TextView
        id={'Type-SignUp'}
        onPress={handleOnPress}
        style={[styles.styleButton, {backgroundColor: Color.Supernova}]}
        styleValue={[styles.styleTextButton, {fontWeight: '200'}]}
        value={'ĐĂNG KÝ'}
      />
    </ScreensView>
  );
}
