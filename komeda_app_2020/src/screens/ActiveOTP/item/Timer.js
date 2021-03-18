//Library:
import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';

//Setup:
import {SIZE, COLOR} from '../../../utils';

//Component:
import {AppText} from '../../../elements/AppText';
const Timer = ({setDisableResendOtp}) => {
  const [second, setSecond] = useState(60);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setSecond((prev) => {
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (second === 0) {
      setDisableResendOtp(false);
    }
    return () => {};
  }, [second]);

  return (
    <View>
      {second > 0 ? (
        <AppText style={{fontSize: SIZE.H5 * 1.2, color: COLOR.black}}>
          [
          <AppText style={{color: COLOR.COLOR_BROWN, fontSize: SIZE.H5 * 1.2}}>
            {second}
          </AppText>
          ]秒後に再送可能となります。
        </AppText>
      ) : null}
    </View>
  );
};

export default Timer;
