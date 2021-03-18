import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

import {COLOR, SIZE, ICONS} from '../utils/resource';
import {AppIconButton} from './AppIconButton';
import {AppText} from './AppText';

class AppHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.renderLeft = this.renderLeft.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
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
    this.props.navigation.goBack(null);
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

  renderLeft() {
    const {Left, renderLeft, leftGoBack, onPressLeft} = this.props;
    if (Left) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: SIZE.padding,
          }}>
          {Left}
        </View>
      );
    }
    if (renderLeft) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: SIZE.padding,
          }}>
          {renderLeft()}
        </View>
      );
    }
    if (leftGoBack) {
      const onPress = onPressLeft || this.onGoBack;
      return (
        <View
          style={{
            position: 'absolute',
            left: SIZE.padding,
            top: -2,
          }}>
          <AppIconButton
            hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
            icon={{
              iconName: ICONS.Ionicons_md_arrow_round_back,
              iconType: 'Ionicons',
              iconColor: COLOR.main_color,
              iconSize: SIZE.H1 * 1.3,
            }}
            onPress={onPress}
          />
        </View>
      );
    }
    return null;
  }
  renderTitle() {
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
              fontSize: SIZE.title_size,
              color: COLOR.blue_light_3,
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
    // const translateY = animateValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [50, 0],
    // });
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
          pointerEvents={'auto'}
        />
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
          // getLayout(height, 'AppHeader');
        }}>
        {this.renderLeft()}
        {this.renderTitle()}
        {this.renderRight()}
        {this.renderTopView()}
      </View>
    );
  }
}

const AppHeader1 = (props) => {};

const styles = StyleSheet.create({
  container: {
    width: SIZE.device_width,
    elevation: 2,
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    paddingVertical: 12,
    alignItems: 'center',
    borderColor: COLOR.BG_TRANSPARENT_70,
    borderBottomWidth: 0,
    shadowColor: COLOR.grey_300,
    shadowOpacity: 1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
});

export {AppHeader};
