//Library:
import React, {useEffect, useRef, useState} from 'react';
import {ImageBackground, View, TouchableOpacity, Animated} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, COLOR, AsyncStoreKey} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AppText} from '../../elements/AppText';

const Entry = ({navigation}) => {
  const skipAnimation = useRef(new Animated.Value(0)).current;
  const [isActiveButton, setStateIsActiveButton] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      actionAnimation();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const actionAnimation = () => {
    Animated.timing(skipAnimation, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };
  const opacity = skipAnimation.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0, 1],
  });

  const translateY = skipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const scale = skipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const onStartApp = () => {
    setStateIsActiveButton(false);
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.GUIDE}],
    });
    AsyncStorage.setItem(AsyncStoreKey.hasLaunched, 'hasLaunched');
  };

  return (
    <ImageBackground
      source={require('../../utils/images/guide.jpg')}
      style={{width: '100%', height: '100%', flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Animated.View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: SIZE.width(65),
            opacity,
            marginTop: SIZE.width(45),
            transform: [{translateY}, {scale}],
          }}>
          <TouchableOpacity
            disabled={isActiveButton ? false : true}
            style={{
              height: SIZE.width(12),
              width: SIZE.width(65),
              backgroundColor: '#b3d3a3',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
            onPress={onStartApp}
            hitSlop={{top: SIZE.width(3)}}>
            <AppText
              style={{
                color: COLOR.black,
                fontSize: SIZE.H4 * 1.1,
              }}>
              アプリをはじめる
            </AppText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default Entry;
