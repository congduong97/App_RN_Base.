import React, {useState, useImperativeHandle} from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text} from 'react-native-animatable';
import {SIZE, COLOR} from '../utils';
import {AppText} from './AppText';

const Toast = ({backdropStyle, inModal}, ref) => {
  const [isShow, setIsShow] = useState(false);
  const [message, setMessage] = useState('');
  useImperativeHandle(ref, () => ({showToast, closeToast}), []);

  const showToast = (message) => {
    setMessage(message);
    setIsShow(true);
  };

  const closeToast = () => {
    setIsShow(false);
  };
  if (!isShow) {
    return null;
  }

  return (
    <>
      <View
        style={[
          {
            backgroundColor: 'black',
            opacity: 0.2,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
          },
          backdropStyle,
        ]}
      />
      <View
        animation="bounceInUp"
        duration={800}
        useNativeDriver={true}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          position: 'absolute',
          zIndex: 3,
          top: SIZE.height(33),
          width: SIZE.width(70),
          left: SIZE.width(15),
          borderRadius: SIZE.border_radius,
        }}>
        <AppText
          style={{fontSize: SIZE.H5, marginVertical: 30, marginHorizontal: 20}}>
          {message}
        </AppText>
        <TouchableOpacity
          style={{
            width: '100%',
            paddingVertical: 16,
            borderTopWidth: 1,
            borderColor: COLOR.gray_light,
          }}
          onPress={closeToast}>
          <AppText
            style={{
              fontSize: SIZE.H4,
              fontWeight: 'bold',
              color: COLOR.blue_light_3,
              textAlign: 'center',
            }}>
            OK
          </AppText>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default React.forwardRef(Toast);
