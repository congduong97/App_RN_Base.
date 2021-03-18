import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  APP_COLOR,
  COLOR_GRAY_300,
  COLOR_BLUE_LIGHT,
} from '../../const/Color';
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  managerAcount,
  keyAsyncStorage,
  tracker,
  stateSercurity,
} from '../../const/System';
import {STRING} from '../../const/String';
import {pushResetScreen} from '../../util';
import {AppImage} from '../../component/AppImage';
import {BackButton} from '../../commons';

export default class Over extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slider: [],
      skipAnimation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.checkSlider();
  }
  checkSlider = async () => {
    try {
      AsyncStorage.getItem('introducing').then(res => {
        if (Array.isArray(JSON.parse(res))) {
          this.setState({slider: JSON.parse(res)});
        }
      });
    } catch (err) {}
  };
  clickNext = async () => {
    const {navigation} = this.props;

    const {params, routeName} = navigation.state;

    const isAgree = await AsyncStorage.getItem(keyAsyncStorage.isAgree);
    if (routeName == 'INTRODUCE_IMAGE') {
      navigation.goBack('');
    } else if (!isAgree) {
      this.props.navigation.navigate('Rule', {
        disable: true,
        fromOverScreen: true,
      });
    } else {
      if (managerAcount.enablePasswordOppenApp && stateSercurity.onSecurity) {
        pushResetScreen(this.props.navigation, 'EnterPassMyPageAndOppenApp', {
          nameScreen: 'HomeNavigator',
        });
      } else {
        pushResetScreen(this.props.navigation, 'HomeNavigator');
      }
    }
  };

  renderDotIndicator() {
    const {slider} = this.state;
    const {navigation} = this.props;
    const {params, routeName} = navigation.state;
    if (slider.length > 0) {
      const pageCount =
        routeName !== 'INTRODUCE_IMAGE' ? slider.length + 1 : slider.length;
      return (
        <PagerDotIndicator
          dotStyle={{
            height: 8,
            width: 8,
            marginBottom: isIOS ? 5 : 30,
            borderRadius: 4,
          }}
          selectedDotStyle={{
            backgroundColor: APP_COLOR.COLOR_TEXT,
            height: 8,
            width: 8,
            marginBottom: isIOS ? 5 : 30,
            borderRadius: 4,
          }}
          pageCount={pageCount}
          titles={['one', 'two', 'three', 'four']}
        />
      );
    }
  }
  renderSliderImage = () => {
    const {slider, skipAnimation} = this.state;
    const opacity = skipAnimation.interpolate({
      inputRange: [0.3, 1],
      outputRange: [0, 1],
    });
    const translateY = skipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    const scale = skipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    if (slider.length > 0) {
      const {navigation} = this.props;
      const {routeName} = navigation.state;

      let slide = slider;
      if (routeName !== 'INTRODUCE_IMAGE') {
        slide = [...slider, {source: require('../../images/bg2.png')}];
      }
      return (
        <IndicatorViewPager
          onPageScroll={event => {
            if (event.position === slide.length - 1 && event.offset === 0) {
              Animated.timing(skipAnimation, {
                toValue: 1,
                duration: 500,
                easing: Easing.in(),
                useNativeDriver: true,
              }).start();
            }
          }}
          autoPlayEnable
          style={styles.wrapperBody}
          autoPlayInterval={4000}
          // autoPlayEnable={false}
          indicator={this.renderDotIndicator()}>
          {slide.map((item, index) => {
            if (item.source) {
              return (
                <View key={`${index}`}>
                  <ImageBackground
                    source={item.source}
                    style={{
                      width: DEVICE_WIDTH,
                      height: DEVICE_HEIGHT,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {index === slide.length - 1 &&
                      routeName !== 'INTRODUCE_IMAGE' && (
                        <Animated.View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            width: DEVICE_WIDTH * 0.6,
                            opacity,
                            transform: [{translateY}, {scale}],
                          }}>
                          <TouchableOpacity
                            onPress={this.clickNext}
                            style={{
                              backgroundColor: COLOR_BLUE_LIGHT,
                              borderRadius: 25,
                              width: DEVICE_WIDTH * 0.6,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={{padding: 16, color: COLOR_WHITE}}>
                              {STRING.get_started_aplication}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                  </ImageBackground>
                </View>
              );
            }
            return (
              <View
                key={`${index}`}
                style={[
                  styles.wrapperCenter,
                  {width: DEVICE_WIDTH, height: DEVICE_HEIGHT},
                ]}>
                <AppImage
                  url={item.url}
                  style={{width: DEVICE_WIDTH, height: DEVICE_HEIGHT}}
                  resizeMode={'cover'}
                />
              </View>
            );
          })}
        </IndicatorViewPager>
      );
    }
    return null;
  };
  render() {
    const {navigation} = this.props;
    const {params, routeName} = navigation.state;

    const manufacturer = DeviceInfo.getManufacturerSync();
    const bottomPadding =
      manufacturer.toLowerCase() === 'Meizu'.toLowerCase() ? 40 : 0;
    return (
      <View style={styles.wrapperContainer}>
        {this.renderSliderImage()}
        {routeName !== 'INTRODUCE_IMAGE' ? (
          <View style={[styles.wrapperHeader, {paddingBottom: bottomPadding}]}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={this.clickNext}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: APP_COLOR.COLOR_TEXT}}>
                  {STRING.skipp}{' '}
                </Text>
                <Icon
                  name="arrowright"
                  size={30}
                  color={APP_COLOR.COLOR_TEXT}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{position: 'absolute', left: 0, top: 0}}>
            <BackButton goBack={navigation.goBack} />
          </View>
        )}
      </View>
    );
  }
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperContainer: {
    paddingBottom: isIOS ? 20 : 0,
    backgroundColor: COLOR_GRAY_300,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
  },
  wrapperHeader: {
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: 'blue',
    // paddingTop: isIOS ? 20 : 0,
    width: DEVICE_WIDTH,
    // height :DEVICE_HEIGHT,
    bottom: isIOS ? 0 : 25,
    // marginBottom:3,
    marginBottom: 5,
    position: 'absolute',
  },
  wrapperBody: {
    width: DEVICE_WIDTH,
    backgroundColor: COLOR_WHITE,
    height: DEVICE_HEIGHT,
  },
});
