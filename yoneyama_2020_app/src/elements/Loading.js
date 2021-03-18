import React, {useContext} from 'react';
import {View, Dimensions, Platform} from 'react-native';
import Spinner from 'react-native-spinkit';
import {COLOR} from '../utils/resource';
import {ContextContainer} from '../contexts/AppContext';
const {width} = Dimensions.get('window');

const Loading = (props) => {
  const {style, sizeSpinner} = props;
  const {colorApp} = useContext(ContextContainer);
  const isAndroid = Platform.OS === 'android';
  const loadingType = 'Circle';
  const size = isAndroid ? 36 : 24;
  return (
    <View
      style={[
        {
          flex: 1,
          width,
          backgroundColor: COLOR.TRANSPARENT,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      <Spinner
        size={sizeSpinner || size}
        type={loadingType}
        color={colorApp.backgroundColorButton}
      />
    </View>
  );
};

export {Loading};
