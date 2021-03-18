import React, {useContext} from 'react';
import {View, Dimensions, Image, TouchableOpacity} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import hexToRgba from 'hex-to-rgba';

//Setup:
import {COLOR, SIZE} from '../../../utils';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import HomeMenu from './HomeMenu';
import {Loading} from '../../../elements';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
const HomeTabView = ({
  notice,
  index,
  onChangeApp,
  slider,
  checkStatusNotification,
  hasCoupon,
  countPushNoti,
  refreshNotiHome,
}) => {
  const checkMarginSlider = slider ? slider.length : null;
  const [routes] = React.useState([
    {
      key: 'TreeApp',
      image: require('../../../utils/images/treebutton.png').toString(),
    },
    {
      key: 'PetApp',
      image: require('../../../utils/images/petbutton.png').toString(),
    },
  ]);

  const {homeMainMenu, colorApp} = useContext(ContextContainer);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'TreeApp':
        return (
          <HomeMenu
            refreshNotiHome={refreshNotiHome}
            homeMainMenu={homeMainMenu}
            notice={notice}
            index={index}
            checkStatusNotification={checkStatusNotification}
            hasCoupon={hasCoupon}
            countPushNoti={countPushNoti}
          />
        );
      case 'PetApp':
        return (
          <HomeMenu
            refreshNotiHome={refreshNotiHome}
            homeMainMenu={homeMainMenu}
            notice={notice}
            index={index}
            checkStatusNotification={checkStatusNotification}
            hasCoupon={hasCoupon}
            countPushNoti={countPushNoti}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: COLOR.backgroundColor,
        shadowOffset: {height: 0, width: 0},
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      }}
      renderLabel={({route, focused}) => {
        return (
          <View
            style={{
              backgroundColor: focused
                ? hexToRgba(colorApp.activeTabBackground, '0.6')
                : colorApp.backgroundColor,
              height: SIZE.width(12),
              width: SIZE.width(50),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="cover"
              style={{flex: 1, height: SIZE.width(12), width: SIZE.width(50)}}
              source={parseInt(route.image)}
            />
          </View>
        );
      }}
      renderIndicator={() => null}
      activeColor={COLOR.white}
      inactiveColor={COLOR.red}
      tabStyle={{padding: 0}}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        marginTop: checkMarginSlider ? SIZE.width(5) : SIZE.width(-5),
      }}>
      <TabView
        lazy
        renderLazyPlaceholder={() => (
          <Loading style={{backgroundColor: colorApp.backgroundColor}} />
        )}
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        style={{flex: 1, marginTop: SIZE.width(6), width: SIZE.width(100)}}
        onIndexChange={onChangeApp}
        initialLayout={initialLayout}
        swipeEnabled={true}
      />
    </View>
  );
};

export default React.forwardRef(HomeTabView);
