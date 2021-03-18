import React, {PureComponent} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import HTML from 'react-native-render-html';
import NavigationService from '../../service/NavigationService';

export default class AutoHeightWebView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      contentHeight: 100,
      reloadWebview: true,
    };
  }

  onLinkPress = (event, link) => {
    if (link) {
      NavigationService.navigate('WEB_VIEW', {url: link});
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
        />
      </ScrollView>
    );
  }
}
