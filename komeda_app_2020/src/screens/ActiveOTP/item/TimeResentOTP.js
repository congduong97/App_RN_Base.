//Library:
import React, {useEffect, useState} from 'react';

//Setup:
import {AppText} from '../../../elements/AppText';
import {View} from 'react-native';
import {SIZE, COLOR} from '../../../utils';
let timeCount = 0;
let seconds = 60;
function TimeResentOTP(props) {
  const [startTime, setStateStartTime] = useState(60);
  useEffect(() => {
    timeCount = setInterval(() => {
      runTime();
    }, 1000);
    return () => {
      seconds = 60;
      clearInterval(timeCount);
    };
  }, []);
  const runTime = () => {
    if (seconds > 0 && seconds <= 60) {
      seconds--;
      setStateStartTime(seconds);
    } else {
      seconds = 60;
      const {endWaitingTime} = props;
      endWaitingTime();
      clearInterval(timeCount);
    }
  };

  return (
    <View>
      {seconds > 0 ? (
        <AppText style={{fontSize: SIZE.H5 * 1.2, color: COLOR.black}}>
          [
          <AppText style={{color: COLOR.COLOR_BROWN, fontSize: SIZE.H5 * 1.2}}>
            {seconds}
          </AppText>
          ]秒後に再送可能となります。
        </AppText>
      ) : null}
    </View>
  );
}

export {TimeResentOTP};
