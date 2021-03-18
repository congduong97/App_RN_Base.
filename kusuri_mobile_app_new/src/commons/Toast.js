import React, {PureComponent} from 'react';
import {Animated, StyleSheet,Text} from 'react-native';
import { APP_COLOR } from '../const/Color';



class Toast extends PureComponent {
  constructor(props) {
    super(props);
    this.animateOpacityValue = new Animated.Value(0);
    this.state = {
      ShowToast: false,
    };
    this.ToastMessage = '';
    this.toastTitle = ""
  }

  componentDidMount() {
    const {onRef} = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  componentWillUnmount() {
    this.timerID && clearTimeout(this.timerID);
  }

  clear = () => {
    this.timerID && clearTimeout(this.timerID);
  };

  ShowToastFunction = (
    title="Tilte",
    message = 'Custom React Native Toast',
    duration = 3000,
  ) => {
      
    this.ToastMessage = message;
    this.toastTitle = title;
    this.setState({ShowToast: true}, () => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 1,
        duration: 500,
      }).start(this.HideToastFunction(duration));
    });
  };

  HideToastFunction = (duration) => {
    this.timerID = setTimeout(() => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 0,
        duration: 500,
      }).start();
    }, duration);
  };

  render() {
    if (this.state.ShowToast) {
      return (
        <Animated.View
          style={[
            styles.animatedToastView,
            {
              opacity: this.animateOpacityValue,
              top: "20%",
              backgroundColor: this.props.backgroundColor || "white",
              alignSelf: 'center',
            },
          ]}>
            <Text>{this.toastTitle}</Text>
          <Text
            style={[
              styles.ToastBoxInsideText,
              {color: this.props.textColor || "black"},
            ]}>
            {this.ToastMessage}
          </Text>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  animatedToastView: {
    marginHorizontal: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 9999,
    position: 'absolute',
    justifyContent: 'center',
  },
  ToastBoxInsideText: {
    fontSize: 12,
    color:APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});

export {Toast};
