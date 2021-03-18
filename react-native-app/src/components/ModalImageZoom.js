import React, {useImperativeHandle, useState, useEffect} from 'react';
import {View, TouchableOpacity, Platform, Alert} from 'react-native';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Permissions, {
  check,
  request,
  PERMISSIONS,
} from 'react-native-permissions';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Size} from '../commons/constants';

const ModalImageZoom = (props, ref) => {
  const [show, setShow] = useState(false);
  const {urlImgZoom} = props;

  const listButton = [
    {id: 1, icon: 'closesquare', size: 38, case: 'close', color: 'white'},
    {id: 2, icon: 'clouddownload', size: 45, case: 'download', color: 'white'},
  ];
  const images = [
    {
      url: urlImgZoom,
      props: {},
    },
  ];

  useEffect(() => {
    return () => {};
  }, []);

  useImperativeHandle(ref, () => ({openModal, closeModal}), []);
  const openModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  const pressButton = (check) => () => {
    switch (check) {
      case 'close':
        closeModal();
        break;
      case 'download':
        checkPermissionAlbumPlatform();
        break;
    }
  };

  const checkPermissionAlbumPlatform = () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          if (result != 'granted') {
            requestPermissionAlbumIOS();
          } else {
            alertSaveImages();
          }
        })
        .catch((error) => {});
    } else {
      check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
        .then((result) => {
          if (result != 'granted') {
            requestPermissionAlbumAndroid();
          } else {
            alertSaveImages();
          }
        })
        .catch((error) => {});
    }
  };

  const requestPermissionAlbumIOS = () => {
    request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then((result) => {
        if (result != 'granted') {
          alertGoToSetting();
        } else {
          alertSaveImages();
        }
      })
      .catch((error) => {});
  };

  const requestPermissionAlbumAndroid = () => {
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        if (result != 'granted') {
          alertGoToSetting();
        } else {
          alertSaveImages();
        }
      })
      .catch((error) => {});
  };

  const alertSaveImages = () => {
    return Alert.alert(
      'Bạn có muốn lưu ảnh này vào anbum ảnh ko？',
      '',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            downLoadImage();
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const alertGoToSetting = () => {
    return Alert.alert(
      'Vui lòng cấp quyền truy cập album ảnh？',
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

  const downLoadImage = async () => {
    try {
      if (Platform.OS === 'android') {
        RNFetchBlob.config({
          fileCache: true,
          appendExt: 'jpg',
        })
          .fetch('GET', urlImgZoom)
          .then((res) => {
            if (res && res.respInfo.status == 200) {
              CameraRoll.save(res.data, 'photo')
                .then((res) => {
                  if (res) {
                  }
                })
                .catch((err) => console.log(err));
            }
            Alert.alert('Lưu ảnh thành công.');
          });
      } else {
        var date = new Date();
        let image_URL = encodeURI(urlImgZoom);
        var ext = getExtention(image_URL);
        ext = '.' + ext[0];
        const {config, fs} = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path:
              PictureDir +
              '/image_' +
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              ext,
            description: 'Image',
          },
        };
        const response = await config(options).fetch('GET', image_URL);
        if (response && response.respInfo && response.respInfo.status == 200) {
          const tag = response.respInfo.redirects;
          let urlImg = tag[0];
          if (tag && Array.isArray(tag)) {
            await CameraRoll.save(`${urlImg}`, 'photo');
            Alert.alert('Lưu ảnh thành công.');
          }
        } else {
          Alert.alert('Có lỗi trong quá trình tải ảnh. Vui lòng thử lại sau!');
        }
      }
    } catch (error) {
      Alert.alert('Có lỗi trong quá trình tải ảnh. Vui lòng thử lại sau!');
    } finally {
    }
  };

  const getExtention = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const renderListButton = () => {
    return listButton.map((item, index) => {
      return (
        <TouchableOpacity
          key={`${index}`}
          onPress={pressButton(item.case)}
          style={{
            height: 50,
            width: 50,
            marginLeft: 8,
            marginBottom: 8,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AntDesign
            name={item.icon}
            color={item.color}
            size={item.size}></AntDesign>
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      animationOut="fadeOut"
      animationInTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      isVisible={show}
      style={{
        margin: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: 50,
          width: Size.width(98),
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        {renderListButton()}
      </View>
      <View
        style={{
          height: Size.height(80),
          width: Size.width(100),
          justifyContent: 'center',
        }}>
        <ImageViewer
          disableNumber={false}
          imageUrls={images}
          onPress={closeModal}
          style={{
            height: Size.height(69),
            width: Size.width(100),
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}></ImageViewer>
      </View>
    </Modal>
  );
};

export default React.forwardRef(ModalImageZoom);
