import React, { PureComponent } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Loading } from './Loading';
import { COLOR, STRINGS, ICONS, SIZE } from '../utils/resources';
import { AppIconButton } from './AppIconButton';
import { FetchApi, Convert } from '../utils/modules';
import { AppText } from './AppText';

/**
 * upload image and display image, retry if error
 */

class AppImageWithUpload extends PureComponent {
  constructor(props) {
    super(props);
    // image:{ imageUrl, uri....}
    const { image } = this.props;
    let uploading = true;
    if (image && image.imageUrl) {
      uploading = false;
    }
    this.state = {
      loading: true,
      uploading,
      error: false, // upload image false
    };
  }
  // componentDidMount() {
  //   this.onDidMount();
  // }
  componentWillUnmount() {
    if (this.image) {
      this.image = undefined;
      delete this.image;
    }
  }
  /**
   * upload image to server
   */
  onDidMount = async () => {
    const { image, onUploadImageSuccess } = this.props;
    const { uploading } = this.state;

    if (!image.imageUrl && image.uri) {
      this.state.error = false;
      if (!uploading) {
        this.setState({ uploading: true });
      }
      this.image = undefined;
      const result = await FetchApi.UploadImage(
        STRINGS.type_report,
        image.uri,
        image.name || STRINGS.type_report
      );
      if (result && result.isSuccess) {
        this.image = {
          ...image,
          imageUrl: result.file.imageUrl,
          imageUrlDetail: result.file.fileUrl,
        };
      } else {
        this.state.error = true;
      }
      this.setState({ uploading: false });
      // setState before onUploadImageSuccess to delete app warning update in mouting or mounted
      if (onUploadImageSuccess && this.image) {
        onUploadImageSuccess({ ...this.image });
      }
    }
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
    const { resizeMode, style, defaultSource, sizeSpinner, image } = this.props;

    const { loading, uploading, error } = this.state;
    //return upload view when image have only uri (local link)
    if (uploading) {
      return (
        <View
          style={[
            {
              width: 86,
              height: 86,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            },
            style,
          ]}
        >
          <AppText style={{ fontSize: SIZE.sub_text_size }}>
            {STRINGS.uploading_image}
          </AppText>
        </View>
      );
    }
    if (error) {
      return (
        <AppIconButton
          onPress={this.onDidMount}
          style={[
            {
              width: 86,
              height: 86,
              borderRadius: 4,
            },
            style,
          ]}
          icon={{
            iconName: ICONS.FontAwesome_refresh,
            iconType: 'FontAwesome',
          }}
          title={STRINGS.Tap_to_retry}
        />
      );
    }
    let source = {};
    if (image && image.require) {
      source = image.require;
    }

    if (image && image.imageUrl) {
      const uri = Convert.image(image.imageUrl);
      source = { uri };
    }
    if (source && source.uri === null) {
      return (
        <View
          style={[
            {
              width: 86,
              height: 86,
              borderRadius: 4,
              backgroundColor: COLOR.dark,
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
            style={[{ width: 86, height: 86, borderRadius: 4 }, style]}
            source={source}
            resizeMode={this.getResizeMode(resizeMode)}
            onLoadEnd={() => {
              this.setState({ loading: false });
            }}
            onError={() => {
              this.setState({ loading: false });
            }}
          />
          <Loading
            sizeSpinner={sizeSpinner}
            style={[
              {
                width: 86,
                height: 86,
                borderRadius: 4,
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
      <FastImage
        defaultSource={defaultSource}
        style={[
          { width: 86, height: 86, borderRadius: 4, backgroundColor: 'red' },
          style,
        ]}
        source={source}
        resizeMode={this.getResizeMode(resizeMode)}
      />
    );
  }
}
export { AppImageWithUpload };
