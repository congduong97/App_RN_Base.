import React, {PureComponent} from 'react';
import {View} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import FastImage from 'react-native-fast-image';

import {SIZE, COLOR} from '../utils';
import {TouchableCo} from './TouchableCo';
import {AppImage} from './AppImage';
import {PlaceholderMedia, Placeholder, Fade} from 'rn-placeholder';

const imageSize = SIZE.width(23.5);

export default class AppImageWithResize extends PureComponent {
  constructor(props) {
    super(props);
    const {item, index} = props;
    this.state = {
      selected: false,
      resizing: false,
      error: false,
      loading: true,
      image: {...item},
      index: index,
    };
  }

  componentDidMount() {
    const {index} = this.state;
    this.timeOut = setTimeout(() => {
      this.onDidMount();
    }, (index + 1) * 50);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }

  onDidMount = async () => {
    const {resizingSuccess, item, index} = this.props;
    const {resizing} = this.state;
    if (item && item.uri) {
      this.state.error = false;
      if (!resizing) {
        this.setState({resizing: true});
      }
      const resizeResult = await ImageResizer.createResizedImage(
        item.uri,
        400,
        400,
        'JPEG',
        100,
      );

      if (resizeResult && resizeResult.uri) {
        this.state.image = {uri: resizeResult.uri};
      } else {
        this.state.error = true;
        //if error, image still have uri from CameraRoll, no need to handle
      }
      this.setState({resizing: false});
      // setState before resizingSuccess to delete app warning update in mounting or mounted
      if (resizingSuccess && this.state.image) {
        resizingSuccess(item, index, {uri: resizeResult.uri});
      }
    }
  };

  onPressSelect = () => {
    const {onPress} = this.props;
    const {image, index} = this.state;
    onPress && onPress(this.state.selected, image, index);

    this.setState({
      selected: !this.state.selected,
    });
  };

  getResizeMode = (resizeMode) => {
    switch (resizeMode) {
      case 'contain':
        return FastImage.resizeMode.contain;
      default:
        return FastImage.resizeMode.cover;
    }
  };

  render() {
    const {disabled, defaultSource, resizeMode, size, style} = this.props;
    //Item type: item = {uri: itemUrl}
    const {image, resizing, loading} = this.state;
    const {selected} = this.state;

    const source = {...image};

    const itemSize = {
      width: size || imageSize,
      height: size || imageSize,
      borderRadius: SIZE.border_radius,
    };

    if (loading || resizing) {
      return (
        <TouchableCo disabled={true}>
          <View
            style={[
              itemSize,
              {
                backgroundColor: COLOR.TRANSPARENT,
                borderWidth: 1,
                borderColor: COLOR.white,
              },
              style,
            ]}>
            <FastImage
              style={[itemSize, {}]}
              source={source}
              resizeMode={this.getResizeMode(resizeMode)}
              onLoadEnd={() => {
                this.setState({loading: false});
              }}
              onError={() => {
                this.setState({loading: false});
              }}
              defaultSource={defaultSource}
            />
            <Placeholder
              Animation={Fade}
              style={[
                itemSize,
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
              ]}>
              <PlaceholderMedia size={size || imageSize} />
            </Placeholder>
          </View>
        </TouchableCo>
      );
    }
    return (
      <TouchableCo onPress={this.onPressSelect} disabled={disabled}>
        <View
          style={[
            itemSize,
            {
              backgroundColor: COLOR.TRANSPARENT,
              borderWidth: 1,
              borderColor: COLOR.white,
            },
            style,
          ]}>
          <FastImage
            style={[itemSize, {}]}
            source={source}
            resizeMode={this.getResizeMode(resizeMode)}
            onLoadEnd={() => {
              this.setState({loading: false});
            }}
            onError={() => {
              this.setState({loading: false});
            }}
            defaultSource={defaultSource}
          />

          {selected && (
            <View
              style={[
                styles.dotStyle,
                {
                  backgroundColor: COLOR.white,
                  position: 'absolute',
                  bottom: SIZE.margin / 2,
                  right: SIZE.margin / 2,
                },
              ]}>
              <AppImage
                style={[styles.dotStyle]}
                source={require('../utils/icons/png/sign-green.png')}
              />
            </View>
          )}
        </View>
      </TouchableCo>
    );
  }
}

const styles = {
  dotStyle: {
    width: (SIZE.margin / 4) * 3,
    height: (SIZE.margin / 4) * 3,
    borderRadius: (SIZE.margin / 8) * 3,
  },
};
