import React, {useRef, useImperativeHandle, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import API from '../networking';
import {Size} from '../commons/constants';
import ServicesUpdateComponent from '../services/ServicesUpdateComponent';

function ModalSelectUpLoadImage(props, ref) {
  const refSheetPreview = useRef(null);
  const {getImgSelectUpToListView, idItemSelect, getImgSelect} = props;
  const [isUpload, setStateIsUpLoad] = useState(false);
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({openSheetPreview, closeSheetPreview}), []);

  const listButtonSelectUploadImg = [
    {id: 1, name: 'Camera', type: 'CAMERA'},
    {
      id: 2,
      name: 'Chọn ảnh trong album',
      type: 'ALBUM',
    },
    {
      id: 3,
      name: 'Hủy bỏ',
      type: 'NONE',
    },
  ];

  const getUriImgCamera = async () => {
    if (Platform.OS == 'android') {
      let getOjbGetImg = {};
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Vui lòng cấp quyền truy cập Camera.',
        message: '',
      }).then((granted) => {
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          const options = {};
          getOjbGetImg = new Promise((res, rej) => {
            launchCamera(options, (response) => {
              if (response.didCancel) {
                res(null);
              } else if (response.error) {
                res(null);
              } else if (response.customButton) {
                res(null);
              } else {
                const {uri, path, fileName, type} = response;
                res({uri, path, fileName, type});
              }
            });
          });
        } else {
          alertGoToSetting();
        }
      });
      return getOjbGetImg;
    } else {
      let imgGet = {};
      await Permissions.request(PERMISSIONS.IOS.CAMERA).then((response) => {
        if (response) {
          const options = {};
          imgGet = new Promise((res, rej) => {
            launchCamera(options, (response) => {
              if (response.didCancel) {
                res(null);
              } else if (response.error) {
                res(null);
              } else if (response.customButton) {
                res(null);
              } else {
                const {uri, path, fileName, type} = response;
                res({uri, path, fileName, type});
              }
            });
          });
        }
      });
      return imgGet;
    }
  };

  const alertGoToSetting = () => {
    return Alert.alert(
      'Vui lòng cấp quyền truy cập Camera.',
      '',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            Permissions.openSettings();
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const getUriImgAlbum = () => {
    const options = {};
    return new Promise((res, rej) => {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          res(null);
        } else if (response.error) {
          res(null);
        } else if (response.customButton) {
          res(null);
        } else {
          const {uri, path, fileName, type} = response;
          res({uri, path, fileName, type});
        }
      });
    });
  };
  function getFormData(item) {
    let formData = new FormData();
    formData.append('reservationId', idItemSelect);
    formData.append('images', {
      uri: (Platform.OS = 'android'
        ? item.uri
        : item.uri.replace('file://', '')),
      type: 'multipart/form-data',
      name: 'image.jpg',
    });
    return formData;
  }

  const activeSelectButton = (key) => async () => {
    if (key == 'CAMERA') {
      setStateIsUpLoad(true);
      let getOjb = await getUriImgCamera();
      getImgSelect && getImgSelect({url: getOjb.uri});
      if (getOjb && getOjb.uri) {
        let formDataImgUpload = getFormData(getOjb);
        const response = await API.requestUploadImage(
          dispatch,
          formDataImgUpload,
        );
        if (response && Array.isArray(response) && response.length > 0) {
          ServicesUpdateComponent.set('Upload_img_success');
          getImgSelectUpToListView({
            id: '',
            reservationId: '',
            url: getOjb.uri,
          });
        }
        closeSheetPreview();
        setStateIsUpLoad(false);
      } else {
        closeSheetPreview();
        setStateIsUpLoad(false);
      }
    }
    if (key == 'ALBUM') {
      setStateIsUpLoad(true);
      let getOjb = await getUriImgAlbum();
      getImgSelect && getImgSelect({url: getOjb.uri});
      if (getOjb && getOjb.uri) {
        let formDataImgUpload = getFormData(getOjb);
        const response = await API.requestUploadImage(
          dispatch,
          formDataImgUpload,
        );
        if (response && Array.isArray(response) && response.length > 0) {
          ServicesUpdateComponent.set('Upload_img_success');
          getImgSelectUpToListView({
            id: '',
            reservationId: '',
            url: getOjb.uri,
          });
        }
        closeSheetPreview();
        setStateIsUpLoad(false);
      } else {
        setStateIsUpLoad(false);
        closeSheetPreview();
      }
    } else {
      setStateIsUpLoad(false);
      closeSheetPreview();
    }
  };

  const renderListButtonSelectImg = () => {
    if (isUpload) {
      return null;
    }
    return listButtonSelectUploadImg.map((item, index) => {
      return (
        <TouchableOpacity
          key={`${index}`}
          onPress={activeSelectButton(item.type)}
          style={{
            height: Size.height(8),
            width: Size.width(100),
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: Size.height(0.1),
            borderTopRightRadius: index == 0 ? 10 : 0,
            borderTopLeftRadius: index == 0 ? 10 : 0,
          }}>
          <Text
            style={{
              fontSize: Size.H4,
              fontWeight: 'bold',
              color: item.type == 'CAMERA' ? 'red' : 'blue',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const openSheetPreview = () => {
    refSheetPreview.current.open();
  };

  const closeSheetPreview = () => {
    setStateIsUpLoad(false);
    refSheetPreview.current.close();
  };

  return (
    <RBSheet
      height={Size.height(100)}
      ref={refSheetPreview}
      animationType="slide"
      closeOnPressMask={true}
      closeOnPressBack={false}
      customStyles={{
        container: {
          width: Size.width(100),
          backgroundColor: 'transparent',
        },
      }}>
      <TouchableOpacity
        onPress={() => {
          closeSheetPreview();
        }}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}>
        <View
          style={{
            backgroundColor: 'transparent',
            marginTop: Size.height(74.5),
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            {renderListButtonSelectImg()}
          </View>
        </View>
      </TouchableOpacity>
    </RBSheet>
  );
}
export default React.forwardRef(ModalSelectUpLoadImage);
