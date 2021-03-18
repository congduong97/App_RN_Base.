import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Platform} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {COLOR, SIZE} from '../utils';
import {AppText} from './AppText';
import {CouponService} from '../screens/Coupon/services/CouponService';

const CountDown = (props) => {
  const [time, setTime] = useState({h: 0, m: props.minutes, s: 0});
  const [totalSeconds, setTotalSeconds] = useState(props.timeCount);

  let timer = useRef(null);
  useEffect(() => {
    if (Platform.OS == 'ios') {
      BackgroundTimer.start();
    }
    timer.current = BackgroundTimer.setInterval(countDownTime, 1000);

    // timer.current = setInterval(countDownTime, 1000);
  }, []);

  useEffect(() => {
    const newTime = secondsToTime(totalSeconds);
    setTime({...newTime});
    if (totalSeconds == 0) {
      if (Platform.OS === 'ios') {
        BackgroundTimer.stop();
      }
      BackgroundTimer.clearInterval(timer.current);
      CouponService.setCouponSate(`${props.id}`, {expired: true});
    }
  }, [totalSeconds]);

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  };

  const countDownTime = () => {
    setTotalSeconds((seconds) => seconds - 1);
  };

  const formatTimeToDisplay = (time) => {
    let hours = time.h + ' : ';
    let minutes = time.m + ' : ';
    let seconds = time.s;
    if (time.h < 10) {
      hours = '0' + time.h + ' : ';
    }
    if (time.m < 10) {
      minutes = '0' + time.m + ' : ';
    }
    if (time.s < 10) {
      seconds = '0' + time.s;
    }
    return hours + minutes + seconds;
  };
  if (totalSeconds == 0) {
    return (
      <AppText
        style={{
          fontSize: SIZE.H5,
          color: COLOR.red,
          fontWeight: 'bold',
          alignSelf: 'flex-end',
          marginHorizontal: SIZE.padding / 2,
        }}>
        COUPON HET HAN
      </AppText>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderWidth: 1,
        borderColor: COLOR.red,
        height: SIZE.height(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.main_background,
      }}>
      <AppText style={{color: COLOR.red}}>クーポン利用中</AppText>
      <AppText style={{color: COLOR.red}}>
        {' '}
        残 {formatTimeToDisplay(time)}
      </AppText>
    </View>
  );
};

export {CountDown};
