//Lybrary:
import React, {useRef, useEffect, useContext} from 'react';
import {
  View,
  Animated,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {AppImage, AppText} from '../../../elements';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import IntroDot from './IntroDot';
import {SIZE, COLOR, AsyncStoreKey} from '../../../utils';

//Services:
import NotifService from '../../../utils/services/NotifService';

const SliderAppIntro = (props) => {
  const {appIntroImage} = props;
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const animatedScroll = useRef(new Animated.Value(0));
  const checkNavigateRef = useRef(false);
  const scrollRef = useRef(null);
  const index = useRef(1);

  useEffect(() => {
    onDidMount();
    return () => {};
  }, []);

  const onDidMount = async () => {
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    const alwaysDisplayIntroducingImage = await AsyncStorage.getItem(
      AsyncStoreKey.alwaysDisplayIntroducingImage,
    );

    if (
      hasLaunched === 'hasLaunched' &&
      alwaysDisplayIntroducingImage === 'always'
    ) {
      new NotifService().configure();
    }
  };

  //Hiển thị ảnh Slider:
  const renderImage = () => {
    return appIntroImage.map((image) => {
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

  //Nút bắt đầu xử dụng app:
  const onStartApp = async () => {
    //Nếu đã đồng ý điều khoản xử dụng thì vào màn diều hướng app:
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    if (hasLaunched === 'hasLaunched') {
      navigation.reset({
        routes: [{name: keyNavigation.MAIN_NAVIGATOR}],
      });
      return;
    }
    //Cài app lần đầu sẽ vào màn hình điều khoản:
    navigation.reset({
      routes: [
        {
          name: keyNavigation.MAIN_NAVIGATOR,
          params: {screen: keyNavigation.POLICY},
        },
      ],
    });
  };

  //Ấn vào nút chuyển slider:
  const onNextSlide = () => {
    if (index.current === appIntroImage.length && !checkNavigateRef.current) {
      onStartApp();
      checkNavigateRef.current = true;
      return;
    }
    scrollRef.current.scrollTo({
      x: index.current * SIZE.device_width,
      y: 0,
      animated: true,
    });
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR.white,
          alignItems: 'center',
        }}>
        <StatusBar backgroundColor={COLOR.grey_300} barStyle='dark-content' />
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
              listener: (e) => {
                index.current =
                  Math.round(
                    e.nativeEvent.contentOffset.x / SIZE.device_width,
                  ) + 1;
              },
            },
          )}>
          {renderImage()}
        </Animated.ScrollView>
        <View
          style={{
            position: 'absolute',
            top: SIZE.height(32),
            paddingHorizontal: 10,
            borderRadius: 10,
          }}>
          <IntroDot
            pageLength={appIntroImage.length}
            animatedScroll={animatedScroll.current}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onNextSlide}
          style={{
            position: 'absolute',
            bottom: SIZE.height(3),
            backgroundColor: colorApp.backgroundColorButton,
            height: SIZE.height(7.5),
            width: SIZE.width(80),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5 * 1.4,
              color: colorApp.textColorButton,
              fontFamily: 'irohamaru-Medium',
            }}>
            次へ
          </AppText>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{backgroundColor: COLOR.white}} />
    </>
  );
};

export {SliderAppIntro};
