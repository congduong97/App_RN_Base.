import React, {PureComponent} from 'react';
import {ScrollView, Dimensions, Image, Linking} from 'react-native';
import HTML from 'react-native-render-html';
import { DEVICE_WIDTH } from '../../../const/System';

export default class CustomWebView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      contentHeight: 100,
      reloadWebview: true,
    };
  }

  onLinkPress = (event, link) => {
    if (link) {
      Linking.openURL(link);
    }
  };
  render() {
    const {html} = this.props;

    if (!html) {
      return null;
    }
    return (
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <HTML
          onLinkPress={this.onLinkPress}
          html={html}
          baseFontStyle={{fontSize: 14}}
          imagesMaxWidth={Dimensions.get('window').width}
          renderers={{
            img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              if (Object.keys(convertedCSSStyles).length === 0) {
                return (
                  <Image
                    key={`${Math.random()}`}
                    resizeMode='stretch'
                    source={{ uri: htmlAttribs.src }}
                    style={{
                      width: undefined,
                      height: undefined,
                    }}
                  />
                );
              }

              const maxWidth = DEVICE_WIDTH - 30;

              let customWidth = convertedCSSStyles.width;
              let customHeight = convertedCSSStyles.height;

              if (isNaN(convertedCSSStyles.width)) {
                customWidth =
                  (parseFloat(convertedCSSStyles.width) * maxWidth) / 100;
              }

              if (isNaN(convertedCSSStyles.height)) {
                customHeight =
                  (parseFloat(convertedCSSStyles.height) * maxWidth) / 100;
              }

              const ratio = customWidth / customHeight;

              if (customWidth > maxWidth) {
                customWidth = maxWidth;
              }
              // console.log('maxwidth', maxWidth);
              // console.log('customwidth', customWidth);

              return (
                <Image
                  key={`${Math.random()}`}
                  resizeMode='stretch'
                  source={{ uri: htmlAttribs.src }}
                  style={{
                    width: customWidth,
                    height: undefined,
                    aspectRatio: ratio,
                  }}
                />
              );
            },
          }}
        />
      </ScrollView>
    );
  }
}
