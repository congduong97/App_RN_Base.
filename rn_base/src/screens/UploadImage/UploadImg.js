import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Text, Linking, StyleSheet} from 'react-native';
import {isIos, SIZE} from '@src/utils';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ModalUploadImage from '../../elements/ModalUploadImg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export function UploadImageButton({handleOnPress, title, name}) {
  return (
    <TouchableOpacity
      style={styles.customeUploadButton}
      onPress={handleOnPress}>
      <Text style={styles.customeUploadButtonText}>{title}</Text>
      <FontAwesome name={name} size={18} color="#38C8EC" />
    </TouchableOpacity>
  );
}
export default function UploadImages() {
  const refModalUploadImg = useRef(null);
  const [imgCmtUp, setStateImgCmtUp] = useState('');
  const [imgCmtDown, setStateImgCmtDown] = useState('');
  const listItemCMT = [
    {
      id: 1,
      name: '(+) CMT mặt trước',
    },
    {
      id: 2,
      name: '(+) CMT mặt sau',
    },
  ];
  const alertPermissionGoToPhoto = () => {
    return Alert.alert(
      'Xin cấp quyền truy cập ảnh？',
      '',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            Linking.openURL('app-settings:');
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  // Kiểm tra quyền ghi ảnh IOS:
  const uploadImage = () => {
    if (isIos) {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        if (result === 'granted') {
          refModalUploadImg.current.openModal();
        } else {
          alertPermissionGoToPhoto();
        }
      });
    }
  };
  const handleOpenUploadFile = () => {};
  const renderListItemUploadImgCMT = () => {
    return listItemCMT.map((item, index) => {
      return (
        <TouchableOpacity
          key={`${index}`}
          onPress={uploadImage}
          style={{
            height: SIZE.height(15),
            width: SIZE.width(42),
            borderWidth: 1,
            borderColor: 'black',
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{item.name}</Text>
          <UploadImageButton
            handleOnPress={handleOpenUploadFile}
            title="Tải file lên"
            name="upload"
          />
        </TouchableOpacity>
      );
    });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: SIZE.height(22),
          width: SIZE.width(96),
          borderWidth: 1,
          borderColor: 'red',
          borderStyle: 'dashed',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        {renderListItemUploadImgCMT()}
        <ModalUploadImage ref={refModalUploadImg}> </ModalUploadImage>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customeUploadButton: {
    height: SIZE.height(7.5),
    width: SIZE.width(45),
    borderRadius: SIZE.width(2),
    backgroundColor: '#f4f4f4',
  },
  customeUploadButtonText: {
    fontSize: SIZE.H5,
    color: 'red',
  },
});
