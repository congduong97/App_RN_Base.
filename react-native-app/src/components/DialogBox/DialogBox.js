import React, {PureComponent} from 'react';
import {View, TouchableWithoutFeedback, Animated, Modal} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import {ratioW, windowSize} from '../../commons/utils/devices';

export default class DialogBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      animation: new Animated.Value(0),
    };
    props.onRef(this);
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  open = () => {
    this.setState({isShow: true}, () => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 500,
      }).start();
    });
  };

  close = async () => {
    return await Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 500,
    }).start(() => {
      if (this.mounted) {
        this.setState({isShow: false});
      }
      // this.props.onClose();
    });
  };

  render() {
    const {width, children, onClose, styleContainer, padding0} = this.props;
    const {animation, isShow} = this.state;
    const animationStyle = {
      top: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [800, 0],
      }),
    };
    const overlayAnimationStyle = {
      opacity: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    };
    const paddingStyle = {
      width,
      paddingVertical: padding0 ? 0 : 15,
      paddingHorizontal: padding0 ? 0 : 30 * ratioW,
    };
    return isShow ? (
      <Modal onRequestClose={() => {}} transparent>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={onClose || this.close}>
            <Animated.View
              style={[styles.overlayStyle, overlayAnimationStyle]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.dialogStyle,
              paddingStyle,
              animationStyle,
              styleContainer,
            ]}>
            <View>{children}</View>
          </Animated.View>
        </View>
      </Modal>
    ) : null;
  }
}

DialogBox.propTypes = {
  width: PropTypes.number,
  children: PropTypes.any,
  onRef: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

DialogBox.defaultProps = {
  width: windowSize.width * 0.9,
  children: null,
  onClose: () => {},
};
