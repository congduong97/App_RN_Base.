//Library:
import React, {useContext, useState} from 'react';
import {ImageBackground, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, COLOR, AsyncStoreKey} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import {AppText} from '../../elements/AppText';
import {AppImage} from '../../elements';
import * as Animatable from 'react-native-animatable';

const Entry = ({navigation}) => {
  const {colorApp} = useContext(ContextContainer);
  const [lockButton, setStateLockButton] = useState(false);

  const onStartApp = () => {
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.MAIN_NAVIGATOR}],
    });
    AsyncStorage.setItem(AsyncStoreKey.hasLaunched, 'hasLaunched');
    setStateLockButton(true);
  };

  return (
    <ImageBackground
      source={require('../../utils/images/guide.png')}
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: COLOR.BG_TRANSPARENT_30,
        }}>
        <AppImage
          source={require('../../utils/images/logo2x.png')}
          style={{
            marginTop: SIZE.width(55),
            height: SIZE.width(50),
            width: SIZE.width(70),
          }}
        />
        <Animatable.View
          useNativeDriver={true}
          animation={'fadeInUp'}
          delay={100}
          duration={600}>
          <TouchableOpacity
            disabled={lockButton ? true : false}
            style={{
              paddingVertical: 16,
              width: SIZE.width(70),
              backgroundColor: colorApp.backgroundColorButton,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onStartApp}
            hitSlop={{top: SIZE.width(3)}}>
            <AppText
              style={{
                color: colorApp.textColorButton,
                fontSize: SIZE.H4 * 1.1,
              }}>
              はじめる
            </AppText>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
};

export default Entry;
