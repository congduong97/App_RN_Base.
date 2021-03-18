import React, {PureComponent} from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity, Modal, Image} from 'react-native';
import {URL_IMAGE} from '../../const/Url';
import {Loading} from '../../commons';
import ImageViewer from '../../liberyCustom/react-native-image-zoom-viewer';
import {View} from 'native-base';
import {DEVICE_WIDTH, DEVICE_HEIGHT, urlImageDefault} from '../../const/System';

export class AppImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: true,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  getResizeMode = resizeMode => {
    switch (resizeMode) {
      case 'cover':
        return FastImage.resizeMode.cover;
      default:
        return FastImage.resizeMode.contain;
    }
  };

  render() {
    const {
      resizeMode,
      style,
      url,
      onLoadEnd,
      useZoom,
      onPress,
      notLoading,
      source,
      usingImageReactNative,
    } = this.props;
    const {modalVisible} = this.state;

    const uri = this.props.notDomain ? url : URL_IMAGE + url;
    let sourceImage;
    if (source) {
      sourceImage = source;
    } else {
      sourceImage = {uri: uri || urlImageDefault};
    }
    if (
      sourceImage &&
      sourceImage.uri ===
        'https://s3-ap-northeast-1.amazonaws.com/shop-app-assets/'
    ) {
      return <View style={style} />;
    }
    // console.log('sourceImage', sourceImage);
    if (useZoom) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={style}
          onPress={() => {
            onPress && onPress();
            this.setModalVisible(!this.state.modalVisible);
          }}>
          {this.state.loading ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Loading />
            </View>
          ) : null}

          <FastImage
            style={style}
            onLoadEnd={() => {
              this.setState({loading: false});
              onLoadEnd && onLoadEnd();
            }}
            source={{uri: uri || urlImageDefault}}
            resizeMode={this.getResizeMode(resizeMode)}
          />

          {modalVisible && useZoom ? (
            <Modal
              onRequestClose={() => {
                this.setModalVisible(false);
              }}
              transparent={false}
              visible={this.state.modalVisible}>
              <ImageViewer
                disableNumber
                loadingRender={() => (
                  <Loading
                    style={{width: DEVICE_WIDTH, height: DEVICE_HEIGHT}}
                  />
                )}
                onClick={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                imageUrls={[{url: uri || urlImageDefault}]}
              />
            </Modal>
          ) : null}
        </TouchableOpacity>
      );
    }
    return (
      <View style={style}>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Loading />
          </View>
        ) : null}

        <FastImage
          style={style}
          source={sourceImage}
          onLoadEnd={() => {
            this.setState({loading: false});
            onLoadEnd && onLoadEnd();
          }}
          resizeMode={this.getResizeMode(resizeMode)}
        />
      </View>
    );
  }
}
