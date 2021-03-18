//Lybrary:
import React, {Component} from 'react';
import {View, Animated} from 'react-native';

//Setup:
import {SIZE, COLOR} from '../../../utils/resources';

class IntroDot extends Component {
  getInterpolate = () => {
    const {animatedScroll, pageLength} = this.props;
    const inputRange = [];
    const outputRange = [];
    if (pageLength < 2) {
      return animatedScroll.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
    }
    for (let index = 0; index < pageLength; index++) {
      inputRange.push(index * SIZE.device_width);
      outputRange.push(index * (9 + SIZE.padding / 2));
    }
    return animatedScroll.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  };

  render() {
    const {pageLength, style} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          ...style,
        }}>
        {Array.from(Array(pageLength)).map((value, index) => (
          <View
            key={`${index}`}
            style={{
              borderRadius: 4.5,
              width: 9,
              height: 9,
              backgroundColor: COLOR.grey_0,
              margin: SIZE.padding / 4,
            }}
          />
        ))}
        <Animated.View
          style={{
            margin: SIZE.padding / 4,
            position: 'absolute',
            borderRadius: 4.5,
            width: 9,
            height: 9,
            backgroundColor: COLOR.dark,
            transform: [{translateX: this.getInterpolate()}],
          }}
        />
      </View>
    );
  }
}
export default IntroDot;
