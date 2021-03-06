import React, {useState, useRef} from 'react';
import {ScrollView, View} from 'react-native';
import {COLOR, SIZE} from '../../../utils';
//Component:
import SpringSpin from './timing/SpringSpin';
import SpringCubic from './timing/SpringCubic';
import SpringQuad from './timing/SpringQuad';

export default function AnimatedTiming() {
  const [showAnimation, setStateShowAnimation] = useState(false);
  const pressShowAnimation = () => {
    setStateShowAnimation(true);
  };
  if (showAnimation) {
    return <View style={{flex: 1, backgroundColor: 'red'}}></View>;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLOR.milk,
        width: SIZE.width(90),
        marginTop: SIZE.height(10),
      }}>
      <SpringSpin></SpringSpin>
      <SpringCubic></SpringCubic>
      <SpringQuad></SpringQuad>
    </ScrollView>
  );
}
