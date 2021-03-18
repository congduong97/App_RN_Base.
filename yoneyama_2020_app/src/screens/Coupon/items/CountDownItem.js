//Library:
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, AppState} from 'react-native';
import moment from 'moment';

//Setup:
import {COLOR, SIZE, getCurrentTime} from '../../../utils';

//Component:
import {AppText} from '../../../elements/AppText';

//Services:
import {CouponService} from '../services/CouponService';

export default function CountDownItem(props) {
  const {used, usedTime} = props.data;
  const {style, expired, inModal} = props;
  const end = useRef(moment(usedTime).add(props.limitTime, 'm').valueOf()); //add minutes to countdown
  const timer = useRef(null);
  const [time, setTime] = useState({
    minutes: moment(end.current - getCurrentTime()).format('mm') || '0',
    seconds: moment(end.current - getCurrentTime()).format('ss') || '00',
  });

  useEffect(() => {
    AppState.addEventListener('change', () => {
      if (AppState.currentState === 'background') {
        timer.current && clearInterval(timer.current);
      } else if (AppState.currentState === 'active') {
        run();
      }
    });
    if (AppState.currentState === 'active') {
      run();
    }
    return () => {
      AppState.removeEventListener('change');
      timer.current && clearInterval(timer.current);
    };
  }, []);

  const run = () => {
    if (used && end.current < getCurrentTime()) {
      return;
    }
    setTime({
      minutes: moment(end.current - getCurrentTime()).format('mm') || '0',
      seconds: moment(end.current - getCurrentTime()).format('ss') || '00',
    });
    timer.current = setInterval(() => {
      if (
        moment(getCurrentTime()).diff(end.current, 'seconds') === 0 &&
        moment(getCurrentTime()).diff(end.current, 'minutes') === 0
      ) {
        clearInterval(timer.current);
        if (props.setExpired) {
          props.setExpired();
        }
        let couponExpired = {...props.data};
        couponExpired.expired = true; //coupon nao dc su dung nhieu lan se set true tai tab do
        CouponService.set(couponExpired);
        return;
      }
      setTime({
        minutes: moment(end.current - getCurrentTime()).format('mm') || '0',
        seconds: moment(end.current - getCurrentTime()).format('ss') || '00',
      });
    }, 1000);
  };
  if (expired) {
    return null;
  }

  if (inModal) {
    return (
      <View>
        <AppText style={style}>
          残り時間 {time.minutes}分{time.seconds}秒
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.wrapContent, {...style}]}>
      <AppText
        style={{fontSize: SIZE.H5, color: COLOR.red, fontWeight: 'bold'}}>
        利用中
      </AppText>
      <AppText
        style={{fontSize: SIZE.H5, color: COLOR.red, fontWeight: 'bold'}}>
        残り{time.minutes}:{time.seconds}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapContent: {
    backgroundColor: COLOR.white,
    opacity: 0.8,
    width: SIZE.width(100, 4 * SIZE.padding) / 2,
    height: SIZE.width(12),
    borderWidth: 2,
    borderColor: COLOR.red,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
});
