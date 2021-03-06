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
      Toast.show('S??? ??i???n tho???i sai ?????nh d???ng');
      return false;
    }
    if (refLogin.current['password'] < 6) {
      Toast.show('Kh??ng ???????c ????? tr???ng m???t kh???u');
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
            '????ng nh???p th???t b???i',
            'Vui l??ng ki???m tra l???i th??ng tin ????ng nh???p',
            [
              {
                text: '????ng',
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
          label={<Text>{'S??? ??i???n tho???i'}</Text>}
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
          placeholder="Nh???p s??? ??i???n tho???i..."
          onChangeText={handleChangeValue}
          keyboardType="phone-pad"
          returnKeyType="next"
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng'}
        />

        <InputView
          id={'password'}
          iconLeft={'padlock'}
          iconLeftSize={18}
          // isShowLabel
          label={<Text>{'M???t kh???u'} </Text>}
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nh???p m???t kh???u..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          returnKeyType="done"
          secureTextEntry={true}
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'M???t kh???u kh??ng ????ng ?????nh d???ng'}
        />

        <TextView
          id={'Type-SignIn'}
          onPress={handleOnPress}
          style={styles.styleButton}
          styleValue={styles.styleTextButton}
          value={'????NG NH???P'}
        />

        <TouchableOpacity
          // onPress={this.onPressForotPassword}
          style={{alignSelf: 'flex-end', marginRight: 20}}>
          <Text style={styles.textDecoration}>L???y l???i m???t kh???u</Text>
        </TouchableOpacity>
      </View>
      <TextView
        id={'Type-SignUp'}
        onPress={handleOnPress}
        style={[styles.styleButton, {backgroundColor: Color.Supernova}]}
        styleValue={[styles.styleTextButton, {fontWeight: '200'}]}
        value={'????NG K??'}
      />
    </ScreensView>
  );
}
