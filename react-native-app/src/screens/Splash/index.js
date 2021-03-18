import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useMergeState} from '../../AppProvider';
import {Icon} from '../../commons/constants';
import AppNavigate from '../../navigations/AppNavigate';
import API from '../../networking';

export default function SplashScreen(props) {
  const {} = props;
  const [stateScreen, setStateScreen] = useMergeState({});
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isFinishedSyncData} = useSelector((state) => state.CommonsReducer);

  useEffect(() => {
    API.requestDataAppLaunch(dispatch, {});
  }, []);

  useEffect(() => {
    if (isFinishedSyncData) {
      AppNavigate.navigateWhenAppStart(navigation.dispatch);
    }
  }, [isFinishedSyncData]);

  return (
    <View style={styles.container}>
      <Image source={Icon.logo} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
  },
});
