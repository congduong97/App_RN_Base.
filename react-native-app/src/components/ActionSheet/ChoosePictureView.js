import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dimension, Font, Color, fontsValue} from '../../commons/constants';
import {TouchableOpacityEx} from '../../components';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function ChoosePictureView(props) {
  const {
    id: idView,
    title = 'Chọn ảnh từ:',
    styleTitle,
    titleCancel = 'Quay lại',
    styleTitleCancel,
    bottomSheet,
    onPressCancel,
    styleButton,
    heightButton = Dimension.heightDefault,
    onResponses,
  } = props;
  /////

  const handleOnPress = ({id}) => {
    if (id === 'ShowGallery') {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
          // maxHeight: 200,
          // maxWidth: 200,
        },
        (response) => {
          onResponses && onResponses({id: idView, data: response});
        },
      );
    } else if (id === 'ShowCamera') {
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: false,
          // maxHeight: 200,
          // maxWidth: 200,
        },
        (response) => {
          onResponses && onResponses({id: idView, data: response});
        },
      );
    } else {
      onPressCancel && onPressCancel();
      bottomSheet && bottomSheet.close();
    }
  };
  ////
  return (
    <View style={styles.stContain}>
      <View style={styles.stContainContent}>
        <View style={{...styles.stContainButton, ...styleButton, heightButton}}>
          <Text
            style={{
              ...styles.stText,
              ...styles.stTitle,
              ...styleTitle,
            }}>
            {title}
          </Text>
        </View>
        <TouchableOpacityEx
          id={'ShowGallery'}
          onPress={handleOnPress}
          style={{...styles.stContainButton, ...styleButton, heightButton}}>
          <Text style={{...styles.stText, ...styles.stTextGallery}}>
            {'Thư viện ảnh'}
          </Text>
        </TouchableOpacityEx>
        <TouchableOpacityEx
          id={'ShowCamera'}
          onPress={handleOnPress}
          style={{...styles.stContainButton, ...styleButton, heightButton}}>
          <Text style={{...styles.stText, ...styles.stTextTake}}>
            {'Chụp ảnh mới'}
          </Text>
        </TouchableOpacityEx>
      </View>
      <TouchableOpacityEx
        id={'Cancel'}
        onPress={handleOnPress}
        style={{
          ...styles.stContainButtonCancel,
          ...styleButton,
          heightButton,
        }}>
        <Text
          style={{
            ...styles.stText,
            ...styles.stTitleCancel,
            ...styleTitleCancel,
          }}>
          {titleCancel}
        </Text>
      </TouchableOpacityEx>
    </View>
  );
}

const styles = StyleSheet.create({
  stContain: {},
  stContainContent: {
    margin: Dimension.margin,
    borderRadius: Dimension.borderRadius,
    backgroundColor: 'white',
    borderTopRightRadius: Dimension.borderRadius,
    borderTopLeftRadius: Dimension.borderRadius,
  },
  stText: {
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: Font.FiraSansMedium,
    fontSize: Dimension.fontSize16,
  },
  stTextGallery: {
    color: 'red',
    fontFamily: Font.FiraSansBold,
  },
  stTextTake: {
    color: 'blue',
    fontFamily: Font.FiraSansBold,
  },
  stTitle: {
    fontSize: Dimension.fontSize14,
    color: Color.colorText,
  },
  stTitleCancel: {
    fontSize: Dimension.fontSize14,
  },
  stContainButton: {
    justifyContent: 'center',
    // backgroundColor: "white",
    height: Dimension.heightButton,
    borderTopColor: '#B0B3C750',
    borderTopWidth: 0.5,
  },
  stContainButtonCancel: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: Dimension.borderRadius,
    height: Dimension.heightButton,
    margin: Dimension.margin,
  },
});
