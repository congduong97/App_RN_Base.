//Library:
import React, {useContext, useState, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, COLOR, AsyncStoreKey} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AppContainer, AppHeader, AppTextButton} from '../../elements';
import AppCheckBox from '../../elements/AppCheckBox';
import {AppText} from '../../elements/AppText';

//Screen:
const Policy = ({navigation}) => {
  const {colorApp, policy} = useContext(ContextContainer);
  const [disabledButton, setDisabledButton] = useState(true);
  const [showButtonCheckBox, setStateShowbuttonCheckBox] = useState(true);
  const [checkGotoHome, setStateGotoHome] = useState(false);
  const checkboxRef = useRef(null);

  useEffect(() => {
    checkGotoPolicy();
    onDidMount();
    return () => {};
  }, []);

  const onDidMount = async () => {
    const agree = await AsyncStorage.getItem(AsyncStoreKey.policy);
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    if (agree) {
      checkboxRef.current.setValue(true);
      setDisabledButton(false);
      if (hasLaunched === 'hasLaunched') {
        setStateShowbuttonCheckBox(false);
      }
    }
  };

  const checkGotoPolicy = async () => {
    const agreePo = await AsyncStorage.getItem(AsyncStoreKey.policy);
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    if (agreePo && hasLaunched === 'hasLaunched') {
      setStateGotoHome(true);
    }
  };

  //Đồng ý và bắt đầu dùng app.
  const onPressAcceptPolicy = () => {
    setStateShowbuttonCheckBox(false);
    navigation.reset({
      routes: [{name: keyNavigation.ENTRY}],
    });
  };

  //Đồng ý điều khoản sử dụng App:
  const onChangeCheckBox = (value) => {
    setDisabledButton(!value);
    if (value) {
      AsyncStorage.setItem(AsyncStoreKey.policy, '1');
    } else {
      AsyncStorage.removeItem(AsyncStoreKey.policy);
    }
  };

  //Lấy tên màn hình:
  const renderHeaderNameScreen = () => {
    return (
      <AppText
        style={{
          color: COLOR.color_bottom_app1,
          fontSize: SIZE.title_size,
        }}>
        利用規約
      </AppText>
    );
  };

  return (
    <AppContainer
      goBackScreen
      haveTitle={checkGotoHome ? true : false}
      nameScreen={showButtonCheckBox ? '' : '利用規約'}
      style={{backgroundColor: colorApp.backgroundColor}}>
      {showButtonCheckBox ? (
        <AppHeader
          style={{
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            marginBottom: 16,
            backgroundColor: colorApp.backgroundColor,
          }}
          renderTitle={renderHeaderNameScreen}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={{
          padding: SIZE.padding,
          paddingBottom: showButtonCheckBox ? SIZE.width(35) : SIZE.width(12),
        }}
        style={{
          width: SIZE.device_width,
        }}>
        <HTMLView
          value={`<div>${policy.replace(/(\r\n)/gm, '')}</div>`}
          stylesheet={HTLMstyles}
        />
      </ScrollView>
      {showButtonCheckBox ? (
        <View
          style={{
            paddingBottom: SIZE.width(10),
            paddingTop: SIZE.width(5),
            width: SIZE.device_width,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 0,
            backgroundColor: colorApp.backgroundColor,
          }}>
          <AppCheckBox
            ref={checkboxRef}
            style={{
              backgroundColor: disabledButton
                ? COLOR.grey_500
                : COLOR.color_bottom_app1,
            }}
            containerStyle={{
              marginBottom: 20,
            }}
            size={SIZE.H4 * 1.2}
            onChangeData={onChangeCheckBox}
            text="利用規約に同意する"
          />
          <AppTextButton
            disabled={disabledButton}
            style={styles.touchable}
            title={'同意してアプリを始める'}
            textStyle={{
              color: COLOR.white,
              fontWeight: 'bold',
              fontSize: SIZE.H4,
            }}
            onPress={onPressAcceptPolicy}
          />
        </View>
      ) : null}
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: SIZE.device_width,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: SIZE.width(3),
  },

  touchable: {
    alignSelf: 'center',
    width: SIZE.width(90),
    padding: SIZE.padding / 1.5,
    backgroundColor: COLOR.color_bottom_app1,
  },
});

const HTLMstyles = StyleSheet.create({
  h6: {
    lineHeight: 20,
    fontSize: SIZE.H5 * 1.15,
    fontFamily: 'MotoyaLMaru',
  },
  p: {
    lineHeight: 20,
    fontSize: SIZE.H5 * 1.15,
    fontFamily: 'MotoyaLMaru',
  },
});
export default Policy;
