import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated, TouchableOpacity} from 'react-native';
// import {useNavigation} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLOR, SIZE} from '../utils/resource';
import {AppText} from './AppText';

// const navigation = useNavigation();
class TabHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.renderTitleLeft = this.renderTitleLeft.bind(this);
    this.renderRight = this.renderRight.bind(this);
    this.renderTopView = this.renderTopView.bind(this);
    this.state = {
      visibleTopView: false,
      animateValue: new Animated.Value(0),
      widthHeader: 0,
      heightHeader: 0,
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  onGoBack = () => {
    const {visibleTopView} = this.state;
    if (visibleTopView) {
      this.showTopView();
      return;
    }
    // navigation.goBack(null);
  };

  getHeaderSize = () => ({
    width: this.state.widthHeader,
    height: this.state.heightHeader,
  });

  showTopView = () => {
    const {animateValue, visibleTopView} = this.state;
    if (!visibleTopView) {
      this.setState({visibleTopView: true});
      Animated.timing(animateValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animateValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => this.setState({visibleTopView: false}));
    }
  };

  renderTitleLeft() {
    const {Title, title, titleStyle, numberOfLines, renderTitle} = this.props;
    if (Title) {
      return Title;
    }
    if (renderTitle) {
      return renderTitle();
    }
    if (title) {
      return (
        <AppText
          numberOfLines={numberOfLines || 1}
          style={[
            {
              fontWeight: '600',
              fontSize: SIZE.header_tab_font_size,
              color: COLOR.black,
            },
            titleStyle,
          ]}>
          {title}
        </AppText>
      );
    }
    return null;
  }
  renderRight() {
    const {Right, renderRight} = this.props;
    if (Right) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            right: SIZE.padding,
          }}>
          {Right}
        </View>
      );
    }
    if (renderRight) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            right: SIZE.padding,
          }}>
          {renderRight()}
        </View>
      );
    }
    return null;
  }

  renderTopView() {
    const {renderView} = this.props;
    const {visibleTopView, heightHeader, animateValue} = this.state;
    const opacity = animateValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1],
    });
    const translateY = animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    if (visibleTopView && renderView) {
      return (
        <Animated.View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: heightHeader,
            width: SIZE.device_width,
            height: SIZE.device_height - heightHeader,
            zIndex: 4,
            minHeight: 50,
            backgroundColor: COLOR.BG_TRANSPARENT_50,
            opacity,
          }}
          pointerEvents={'auto'}>
          <TouchableOpacity style={{flex: 1}} onPress={this.showTopView}>
            <Animated.View
              style={{
                backgroundColor: COLOR.white,
                transform: [{translateY}],
              }}>
              {renderView()}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      );
    }
    return null;
  }

  render() {
    const {style} = this.props;
    return (
      <View
        style={[styles.container, style]}
        onLayout={(event) => {
          const {width, height} = event.nativeEvent.layout;
          // this.setState({ widthHeader: width, heightHeader: height });
          this.state.widthHeader = width;
          this.state.heightHeader = height;
        }}>
        {this.renderTitleLeft()}
        {this.renderRight()}
        {this.renderTopView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    elevation: 2,
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    justifyContent: 'flex-start',
    padding: SIZE.padding,
    alignItems: 'center',
    // borderColor: COLOR.BORDER,
    borderBottomColor: COLOR.grey_500,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // shadowColor: COLOR.grey_0,
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0.5, height: 1 },
    // shadowRadius: 2
    // marginBottom: SIZE.padding / 2,
  },
});
// const AHeader = copilot({
//   animated: true, // Can be true or false
//   overlay: "svg"
// })(Header);
export {TabHeader};
