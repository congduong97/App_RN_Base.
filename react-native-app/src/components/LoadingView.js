import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import * as devices from '../commons/utils/devices';
import {Icon} from '../commons/constants';
import {Bounce} from 'react-native-animated-spinkit';

const AppStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default function LoadingView(props) {
  const isShowLoading = useSelector(
    (state) => state.CommonsReducer.isShowLoading,
  );
  return (
    <Modal
      transparent={true}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      visible={isShowLoading}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      backdropOpacity={0.1}
      backdropColor={'#000000'}>
      <View style={[styles.modalBackground, {}]}>
        <SafeAreaView backgroundColor={'gray'} />
        <AppStatusBar
          backgroundColor="#00000059"
          style={{height: StatusBar.currentHeight}}
        />
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Bounce
            size={100}
            color="#F79600"
            style={{height: 100, width: 100, position: 'absolute'}}
          />
          <View
            style={{
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              backgroundColor: 'white',
              borderColor: '#FFFFFF90',
              borderWidth: 1,
              position: 'absolute',
            }}>
            <Image
              resizeMode="contain"
              sty
              style={{
                width: 80,
                height: 80,
                padding: 20,
                borderRadius: 60,
              }}
              source={Icon.logo}
            />
          </View>
        </View>

        <Text
          style={[
            {color: '#FFFFFF', fontSize: 21, fontWeight: '700', marginTop: 50},
          ]}>
          vui lòng chờ...
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: devices.SCREEN_WIDTH,
    height: devices.SCREEN_HEIGHT,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },

  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  statusBar: {
    height: StatusBar.currentHeight,
  },
});
