import React, {PureComponent} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Loading} from './Loading';
import {COLOR} from '../utils/resources';
import {TouchableCo} from './TouchableCo';

class AppImageButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  getResizeMode = (resizeMode) => {
    switch (resizeMode) {
      case 'contain':
        return FastImage.resizeMode.contain;
      case 'stretch':
        return FastImage.resizeMode.stretch;
      default:
        return FastImage.resizeMode.cover;
    }
  };

  render() {
    const {
      resizeMode,
      style,
      source,
      defaultSource,
      sizeSpinner,
      onPress,
      styleWrap,
      disabled,
    } = this.props;
    const {loading} = this.state;
    if (source && source.uri === null) {
      return (
        <View
          style={[
            {
              width: 86,
              height: 86,
              backgroundColor: COLOR.grey_300,
            },
            style,
          ]}
        />
      );
    }
    //make loading animation while loading image
    if (loading) {
      return (
        <View>
          <FastImage
            defaultSource={defaultSource}
            style={[{width: 86, height: 86}, style]}
            source={source}
            resizeMode={this.getResizeMode(resizeMode)}
            onLoadEnd={() => {
              this.setState({loading: false});
            }}
            onError={() => {
              this.setState({loading: false});
            }}
          />
          <Loading
            sizeSpinner={sizeSpinner}
            style={[
              {
                width: 86,
                height: 86,
                position: 'absolute',
                top: 0,
                left: 0,
              },
              style,
            ]}
          />
        </View>
      );
    }
    //render image after loading image
    return (
      <TouchableCo
        style={styleWrap}
        disabled={loading || disabled}
        onPress={onPress}>
        <FastImage
          defaultSource={defaultSource}
          style={[{width: 86, height: 86, overflow: 'hidden'}, style]}
          source={source}
          resizeMode={this.getResizeMode(resizeMode)}
        />
      </TouchableCo>
    );
  }
}
export {AppImageButton};
