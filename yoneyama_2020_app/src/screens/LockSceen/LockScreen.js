import React, {useContext, useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, AsyncStoreKey} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';

const LockScreen = ({navigation}) => {
  const {colorApp} = useContext(ContextContainer);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    return true;
  };

  const onPress = async () => {
    const lockTime = await AsyncStorage.getItem(AsyncStoreKey.lock_app);
    const now = Date.now();

    if (now - lockTime >= 360000) {
      await AsyncStorage.removeItem(AsyncStoreKey.lock_app);
      navigation.goBack();
    }
  };

  return (
    <View>
      <View style={{padding: 20}}>
        <AppText
          style={{
            alignSelf: 'center',
            fontSize: SIZE.H4,
            marginTop: SIZE.height(20),
          }}>
          認証機能が一時無効となっています 10分後にやり直してください。
        </AppText>
        <TouchableOpacity
          onPress={onPress}
          style={{
            marginTop: SIZE.height(10),
            alignSelf: 'center',
            backgroundColor: colorApp.backgroundColorButton,
            borderRadius: SIZE.border_radius,
            paddingVertical: 20,
            width: '100%',
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: colorApp.textColorButton,
              alignSelf: 'center',
            }}>
            更新
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LockScreen;
