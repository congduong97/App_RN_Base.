import React, {PureComponent} from 'react';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity, Modal, View, Image, Animated} from 'react-native';
import LoadingCustom from './LoadingCustom';
import ImageViewer from 'react-native-image-zoom-viewer';
import {SIZE, COLOR} from '../utils';

export class AppImageCustom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: true,
      width: 0,
      height: new Animated.Value(0),
    };
    if (this.props.style && this.props.style.height) {
      this.state.height = new Animated.Value(this.props.style.height);
    }
  }
  componentDidMount() {
    const {onRef} = this.props;
    onRef && onRef(this);
    if (this.props.useAutoHight) {
      const {url, onLoadEnd} = this.props;
      Image.getSize(url, (width, height) => {
        if (
          this.props.useAutoHight &&
          this.props.style &&
          this.props.style.width
        ) {
          const heightImage = (height / width) * this.props.style.width;
          onLoadEnd && onLoadEnd();
          Animated.timing(this.state.height, {
            toValue: heightImage,
            duration: 500,
          }).start();
        }
      });
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  getResizeMode = (resizeMode) => {
    switch (resizeMode) {
      case 'cover':
        return FastImage.resizeMode.cover;
      default:
        return FastImage.resizeMode.contain;
    }
  };
  getUseImage = () => {
    const {resizeMode, style, url, onLoadEnd, useAutoHight} = this.props;
    const uri = url;
    if (useAutoHight) {
      return (
        <Animated.Image
          onLoadEnd={() => {
            this.setState({loading: false});
          }}
          style={[style, {height: this.state.height}]}
          source={{
            uri:
              uri ||
              'https://www.komeda.co.jp/menu/images/coffee/hot_blend.jpg',
          }}
        />
      );
    }

    return (
      <FastImage
        style={style}
        onLoadEnd={() => {
          this.setState({loading: false});
        }}
        source={{
          uri:
            uri || 'https://www.komeda.co.jp/menu/images/coffee/hot_blend.jpg',
        }}
        resizeMode={this.getResizeMode(resizeMode)}
        {...this.props}
      />
    );
  };

  render() {
    const {
      resizeMode,
      style,
      url,
      onLoadEnd,
      useZoom,
      onPress,
      source,
    } = this.props;
    const {modalVisible} = this.state;
    const uri = url;
    let sourceImage;
    if (source) {
      sourceImage = source;
    } else {
      sourceImage = {
        uri: uri || 'https://www.komeda.co.jp/menu/images/coffee/hot_blend.jpg',
      };
    }
    if (useZoom) {
      return (
        <View>
          {this.state.loading && !source ? (
            <View
              style={{
                width: SIZE.width(100),
                height: SIZE.width(100),
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LoadingCustom />
            </View>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[style]}
            onPress={() => {
              onPress && onPress();
              this.setModalVisible(!this.state.modalVisible);
            }}>
            {this.getUseImage()}
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
                    <LoadingCustom
                      style={{width: SIZE.width(100), height: SIZE.height(100)}}
                      color={COLOR.white}
                    />
                  )}
                  onClick={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                  imageUrls={[
                    {
                      url:
                        uri ||
                        'https://www.komeda.co.jp/menu/images/coffee/hot_blend.jpg',
                    },
                  ]}
                />
              </Modal>
            ) : null}
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View>
        {this.state.loading && !source ? (
          <View
            style={[
              this.props.style,
              {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <LoadingCustom />
          </View>
        ) : null}
        {this.getUseImage()}
      </View>
    );
  }
}
