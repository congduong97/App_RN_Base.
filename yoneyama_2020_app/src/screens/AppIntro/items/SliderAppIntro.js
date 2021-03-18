//Lybrary:
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import {View, Animated, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import {PanGestureHandler} from 'react-native-gesture-handler';

//Setup:
import {
  SIZE,
  COLOR,
  AsyncStoreKey,
  FetchApi,
  APP_ID1,
  APP_ID2,
} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import IntroDot from './IntroDot';
import {AppImage, AppTextButton} from '../../../elements';

//Services:
import NotifService from '../../../utils/services/NotifService';
import {AppService} from '../../../utils/services/AppServices';
import {AppIdService} from '../../../utils/services/AppIdService';

const SliderAppIntro = (props) => {
  const {appIntroImage} = props;
  const {setAppData2, setAppData} = useContext(ContextContainer);
  const animatedScroll = useRef(new Animated.Value(0));
  const checkNavigateRef = useRef(false);
  const scrollRef = useRef(null);
  const timeCount = useRef(0);
  const navigation = useNavigation();
  const [checkLausched, setStateChecklauched] = useState('');
  const [checkLogin, setStateCheckLogin] = useState(false);
  const [disableButtonClick, setStateDisableButtonClick] = useState(false);

  useEffect(() => {
    checkHaslauAndLogin();
    AppService.onChange('update-slider-intro', updateApp);
    return () => {
      AppService.deleteKey('update-slider-intro');
      clearTimeout(timeCount.current);
    };
  }, []);

  const setDisableDoubleHandleAndClick = () => {
    timeCount.current = setTimeout(() => {
      setStateDisableButtonClick(false);
    }, 1500);
  };

  //Kiểm tra tính năng mở app và đã login hay chưa Login:
  const checkHaslauAndLogin = async () => {
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    const userLoggin = await AsyncStorage.getItem(AsyncStoreKey.account);
    const alwaysDisplayIntroducingImage = await AsyncStorage.getItem(
      AsyncStoreKey.alwaysDisplayIntroducingImage,
    );
    if (hasLaunched) {
      setStateChecklauched(hasLaunched);
    }
    if (userLoggin) {
      setStateCheckLogin(true);
    }
    if (
      hasLaunched === 'hasLaunched' &&
      alwaysDisplayIntroducingImage === 'always'
    ) {
      new NotifService().configure();
    }
  };

  //Update App khi chọn app ở màn hình Home:
  const updateApp = async (id) => {
    const appId = await AsyncStorage.getItem(AsyncStoreKey.appId);
    if ((id === 1 && appId === APP_ID1) || (id === 2 && appId === APP_ID2)) {
      return;
    } else {
      if (id === 1) {
        await AppIdService.update(APP_ID1);
        setUpApp1();
      } else {
        await AppIdService.update(APP_ID2);
        setUpApp2();
      }
    }
  };

  //Call API thay đổi cấu hình App 1:
  const setUpApp1 = useCallback(async () => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion1,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response && response.success) {
      setAppData(response.data);
    }
  }, []);

  //Call API thay đổi cấu hình App 2:
  const setUpApp2 = useCallback(async () => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion2,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response && response.success) {
      setAppData2(response.data);
    }
  }, []);

  //Mở App:
  const onStartApp = async () => {
    //Nếu login vào thẳng Home:
    if (checkLogin) {
      navigation.reset({
        routes: [
          {
            name: keyNavigation.MAIN_NAVIGATOR,
          },
        ],
      });
      return;
    }
    //Nếu đã đồng ý điều khoản xử dụng thì vào màn diều hướng app:
    if (checkLausched === 'hasLaunched') {
      navigation.reset({
        routes: [{name: keyNavigation.GUIDE}],
      });
      return;
    }
    //Cài app lần đầu sẽ vào màn hình điều khoản:
    navigation.reset({
      routes: [{name: keyNavigation.TERM}],
    });
  };

  const renderImage = () => {
    return appIntroImage.map((image, index) => {
      if (index === appIntroImage.length - 1) {
        return (
          <PanGestureHandler
            key={`${image.id}`}
            onGestureEvent={(event) => {
              if (
                event.nativeEvent.translationX <= -SIZE.width(10) &&
                !checkNavigateRef.current
              ) {
                checkNavigateRef.current = true;
                setStateDisableButtonClick(true);
                setDisableDoubleHandleAndClick();
                onStartApp();
              }
              if (event.nativeEvent.translationX > 0) {
                const backPos = (appIntroImage.length - 2) * SIZE.device_width;
                scrollRef.current.scrollTo({
                  x: backPos,
                  y: 0,
                  animated: true,
                });
              }
            }}>
            <View>
              <AppImage
                source={{uri: image.url}}
                resizeMode={'cover'}
                style={{
                  width: SIZE.device_width,
                  height: '100%',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  alignItems: 'center',
                  bottom: SIZE.width(8),
                  right: 10,
                }}>
                <AppTextButton
                  disabled={disableButtonClick}
                  textStyle={{
                    fontWeight: 'bold',
                    fontSize: SIZE.H5 * 1.1,
                    color: COLOR.color_bottom_app1,
                  }}
                  title={'スキップ'}
                  onPress={onStartApp}
                />
                <AntDesign
                  style={{
                    fontSize: SIZE.H5 * 1.2,
                  }}
                  name="right"
                  color={COLOR.color_bottom_app1}
                  size={SIZE.icon_size}
                />
              </View>
            </View>
          </PanGestureHandler>
        );
      }
      return (
        <View key={`${image.id}`}>
          <AppImage
            source={{uri: image.url}}
            resizeMode={'cover'}
            style={{
              width: SIZE.device_width,
              height: '100%',
            }}
          />
        </View>
      );
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <StatusBar backgroundColor={COLOR.grey_300} barStyle="dark-content" />
      <Animated.ScrollView
        ref={scrollRef}
        bounces={false}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {x: animatedScroll.current},
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}>
        {renderImage()}
      </Animated.ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: SIZE.width(10),
          backgroundColor: COLOR.grey_0,
          paddingHorizontal: 10,
          borderRadius: 10,
        }}>
        <IntroDot
          pageLength={appIntroImage.length}
          animatedScroll={animatedScroll.current}
        />
      </View>
    </View>
  );
};

export default React.memo(SliderAppIntro);
