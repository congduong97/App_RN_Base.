import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {useDispatch} from 'react-redux';
import {useApp, useMergeState} from '../../AppProvider';
import {Color} from '../../commons/constants';
import {ScreensView, SwitchView, TextView} from '../../components';
import models from '../../models';
import AppNavigate from '../../navigations/AppNavigate';
import API from '../../networking';
import ChangePasswordView from '../Account/ChangePasswordView';
import ActionsType from './ActionsType';
import HeaderPersonalView from './HeaderPersonalView';
import styles from './styles';
import ServicesUpdateComponent from '../../services/ServicesUpdateComponent';
import SettingView from './SettingView';

export default function PersonalScreen(props) {
  const {} = props;
  const {refDialog} = useApp();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [stateScreen, setStateScreen] = useMergeState({
    isShowSetting: false,
  });
  const {isQuickOrder, isShowWebPrices, isCompactUnit} = models.getAllSetting();
  const isAgency = models.isRoleAgency();
  const {isShowSetting} = stateScreen;
  const [userRender, setStateUserRender] = useState(true);

  useEffect(() => {
    ServicesUpdateComponent.onChange('HeaderPersonalView', (event) => {
      if (event == 'Update_info_success') {
        setStateUserRender(false);
        setTimeout(() => {
          setStateUserRender(true);
        }, 500);
      } else {
        Alert.alert('Lỗi không thay đổi được thông tin! Vui lòng thử lại sau.');
      }
    });
    return () => {};
  }, []);

  const requestChangePassword = async (dataChangePassword) => {
    let isChangePassword = await API.requestChangepassword(
      dispatch,
      dataChangePassword,
    );
    isChangePassword && alertChangePasswordSuccess();
  };

  const alertChangePasswordSuccess = () => {
    Alert.alert(
      'Thông báo',
      'Bạn đã đổi mật khẩu thành công. Vui lòng đăng nhập lại để tiếp tục.',
      [
        {
          text: 'Đồng ý',
          onPress: () => {
            OneSignal.sendTag('id', '');
            API.requestSingOut(dispatch);
            AppNavigate.navigateWhenAppStart(navigation.dispatch);
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Thông báo',
      'Bạn có thực sự muốn đăng xuất?',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: () => {
            OneSignal.cancelNotification(models.getAccountId());
            API.requestSingOut(dispatch);
            AppNavigate.navigateWhenAppStart(navigation.dispatch);
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };
  const handleOnPress = ({id, data}) => {
    try {
      if (id === ActionsType.ShowSetting) {
        setStateScreen({isShowSetting: !isShowSetting});
      } else if (id === ActionsType.ChangePassword) {
        refDialog?.current &&
          refDialog.current
            .configsDialog({
              visibleClose: false,
            })
            .drawContents(drawChangePasswordView(data, id))
            .visibleDialog();
      } else if (id === ActionsType.QuickOrder) {
        models.saveQuickOrder(data);
      } else if (id === ActionsType.ShowWebPrices) {
        models.saveShowWebPrices(data);
      } else if (id === ActionsType.NotificationsScreen) {
        AppNavigate.navigateToNotificationScreen(navigation.dispatch, {});
      } else if (id === ActionsType.CopyUnitsK) {
        models.saveCompactUnit(data);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const drawChangePasswordView = (simData, typeView) => {
    return typeView === ActionsType.ChangePassword ? (
      <ChangePasswordView
        navigation={navigation}
        typeView={typeView}
        onPress={requestChangePassword}
        refDialog={refDialog.current}
      />
    ) : (
      <View />
    );
  };
  return (
    <ScreensView
      styleBackground={{backgroundColor: 'white'}}
      titleScreen={'Thông Tin Cá Nhân'}
      bgColorStatusBar="transparent"
      styleContent={styles.styleContains}
      isShowBack={false}
      end={{x: 0.5, y: -1}}
      start={{x: 0, y: 1}}
      colorsLinearGradient={['#007AFF', '#60BEBE', Color.MayaBlue]}
      styleHeader={styles.styleHeader}
      nameIconRight={'logout'}
      onPressRight={handleSignOut}
      headerBottomView={
        userRender ? <HeaderPersonalView navigation={navigation} /> : null
      }>
      <TextView
        id={ActionsType.NotificationsScreen}
        onPress={handleOnPress}
        nameIconLeft={'bell-ringing-filled'}
        nameIconRight={'next'}
        sizeIconLeft={20}
        style={styles.styleRowText}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTitle}
        styleValue={styles.styleValue}
        value={'Thông báo'}
      />
      <SettingView />
      <TextView
        id={ActionsType.ChangePassword}
        onPress={handleOnPress}
        nameIconLeft={'padlock'}
        nameIconRight={'next'}
        sizeIconLeft={20}
        style={styles.styleRowText}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTitle}
        styleValue={styles.styleValue}
        value={'Đổi mật khẩu'}
      />
    </ScreensView>
  );
}
