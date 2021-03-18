//Library:
import React, {useContext, useEffect, useMemo} from 'react';
import {
  FlatList,
  StyleSheet,
  Linking,
  View,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';

//Setup:
import {SIZE, COLOR, versionApp, versionCodePush} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {ContextContainer} from '../../contexts/AppContext';
import {AppText} from '../../elements/AppText';
import {AppHeader} from '../../elements';
import {checkUserLogin} from '../../utils/modules/CheckLogin';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';
import {openUlrBrowser} from '../../utils/modules/OpenURL';

const SubMenu = ({navigation, route}) => {
  const {homeSubMenu, colorApp} = useContext(ContextContainer);

  const AnimatedTouch = Animatable.createAnimatableComponent(TouchableOpacity);
  useEffect(() => {
    //checkSecurityFunctionMenu();
    return () => {};
  }, []);

  //Ấn vào menu:
  const pressItem = (item) => async () => {
    switch (item.typeFunctionMenu) {
      case 'LINK_FUNCTION':
        if (checkUserLogin(item.function)) {
          if (Object.values(keyNavigation).includes(item.function)) {
            navigation.navigate(item.function, {itemMenu: item});
          }
        }
        break;
      case 'WEB_VIEW':
        checkTypeOpenWeb(item);
        break;
      case 'LINK_APP':
        break;
    }
  };

  //Mở bằng trình duyệt:
  const checkTypeOpenWeb = (item) => {
    if (item.typeOpen === 'WEBVIEW') {
      navigation.navigate(keyNavigation.WEBVIEW, {data: {url: item.url}});
    } else {
      Linking.canOpenURL(item.url).then((supported) => {
        if (supported) {
          Linking.openURL(item.url);
        } else {
          openUlrBrowser(item.url);
        }
      });
    }
  };

  //Hiển thị item:
  const renderItem = ({item, index}) => {
    return (
      <AnimatedTouch
        onPress={pressItem(item)}
        style={{
          flexDirection: 'row',
          width: SIZE.width(100),
          justifyContent: 'space-between',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: COLOR.grey_500,
          alignItems: 'center',
          padding: 16,
          alignSelf: 'center',
        }}>
        <AppText style={{fontSize: SIZE.H5, marginVertical: 10}}>
          {item.name}
        </AppText>
        <AntDesign name='right' size={18} />
      </AnimatedTouch>
    );
  };

  const renderFooterList = useMemo(() => {
    const versionAppAndCodePush = `${versionApp}(${versionCodePush})`;
    return (
      <View
        style={{
          padding: 16,
          width: SIZE.device_width,
          backgroundColor: '#F0F0F0',
        }}>
        <AppText
          style={{fontSize: SIZE.H5 * 1.2, color: '#4D4D4D', opacity: 0.5}}>
          Ver.{versionAppAndCodePush}
        </AppText>
      </View>
    );
  }, []);
  return (
    <View style={styles.container}>
      <AppHeader title={'アプリメニュー'} leftGoBack />
      <FlatList
        ListFooterComponent={renderFooterList}
        contentContainerStyle={{
          width: SIZE.device_width,
          backgroundColor: COLOR.white,
        }}
        data={homeSubMenu}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
});

export default withInteractionsManaged(SubMenu);
