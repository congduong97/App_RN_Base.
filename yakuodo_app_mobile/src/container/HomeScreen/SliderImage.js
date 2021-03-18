import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { IndicatorViewPager, PagerDotIndicator } from '../../liberyCustom/rn-viewpager';
import { DEVICE_WIDTH, managerAcount, isIOS } from '../../const/System';
import { STRING } from '../../const/String';

import { APP_COLOR } from '../../const/Color';

import { AppImage } from '../../component/AppImage';
import NotificationCount from '../../service/NotificationCount';
import { openMenu } from '../../util/module/openMenu';
import { Api } from '../../service';
import { CheckDataApp } from '../LauncherScreen/service';
import { ServiveModal } from './util/service';

export class SliderImage extends PureComponent {
  state = {
    slider: []
  };

  componentDidMount() {

    this.getSlide()
    CheckDataApp.onChange('SLIDER', () => {
      this.getSlide()
    })

  }
  componentWillUnmount() {
    CheckDataApp.unChange('SLIDER')
  }

  getSlide = async () => {
    try {
      const res = await AsyncStorage.getItem('slider')
      const { slider } = this.state
      if (res !== JSON.stringify(slider)) {
        this.setState({ slider: JSON.parse(res) });
      }
    } catch (error) {

    }
  }

  _renderDotIndicator() {
    const { length } = this.state.slider;
    return (
      <PagerDotIndicator
        pageCount={length === 1 ? 0 : length}
        dotStyle={{ height: 8, width: 8, borderRadius: 8 }}
        selectedDotStyle={{
          backgroundColor: APP_COLOR.COLOR_TEXT,
          height: 8,
          width: 8,
          borderRadius: 8
        }}
      />
    );
  }
  onPress = (item) => {
    const { link, typeOpenLink, typeOpen, menuEntity } = item;
    const { navigation } = this.props;
    // console.log('item', item);
    this.callClickSlider(item.id);
    if (typeOpen === 1 && link) {
      if (typeOpenLink == 1) {
        this.props.navigation.navigate('WEB_VIEW', { url: item.link });
      } else {
        Linking.openURL(item.link);
      }
    } else if (typeOpen === 2) {
      openMenu(menuEntity, navigation);
    } else if (typeOpen === 4 || typeOpen === 5) {
      if (managerAcount.memberCode) {
        if (typeOpen === 5 && item.linkApplyBanner) {
          this.props.navigation.navigate('WEB_VIEW', { url: `${item.linkApplyBanner}${managerAcount.memberCode}` });
        } else {
          this.props.navigation.navigate('LIST_BANNER');
        }
      } else {
        Alert.alert(
          STRING.notification,
          STRING.please_login_to_use,
          [
            {
              text: STRING.cancel,
              onPress: () => { },
              style: 'cancel'
            },
            { text: STRING.ok, onPress: () => ServiveModal.set() },
          ],
          { cancelable: false }
        );
      }
    }
  }
  callClickSlider = async (id) => {
    try {
      const response = await Api.clickSlider(id);
      // console.log('responsecallClickSlider', response);
    } catch (error) {

    }
  }


  get _renderSlider() {
    const renderSliderImage = this.state.slider.map((item, index) => (
      <View key={`${index}a`}>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.onPress(item);
          }}
        >

          <AppImage
            url={item.url} style={{ width: '100%', height: '100%' }} resizeMode={'cover'}
          />
        </TouchableOpacity>
      </View >

    ));
    return (
      <IndicatorViewPager
        autoPlayEnable
        stopEnd
        autoPlayInterval={4000}
        pageEnd={this.state.slider.length - 1}
        loop
        keyboardDismissMode={'none'}
        style={styles.imageFeature}
        indicator={this._renderDotIndicator()}
      >
        {renderSliderImage}
      </IndicatorViewPager>
    );
  }

  render() {
    const { slider } = this.state;
    if (slider.length > 0) {
      return <View>{this._renderSlider}</View>;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16)
  }
});
