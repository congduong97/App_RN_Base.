//Library:
import React, {useContext, useRef, useState, useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';

//Setup:
import {checkUserLogin} from '../../utils/modules/CheckLogin';
import {COLOR, SIZE} from '../../utils';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';

//Component:
import {ContextContainer} from '../../contexts/AppContext';
import ListStore from './items/ListStore';
import ListBookMark from '../BookMark/BookMark';
import {AppText} from '../../elements/AppText';
import {AppContainer} from '../../elements';
import {TabViewService} from '../../utils/services/TabViewService';
import {checkPermissionsWhenInUse} from './utils/ConfigLocation';
const initialLayout = {width: Dimensions.get('window').width};
const Store = ({route, navigation}) => {
  const {keyActiveBookMark} = route.params;
  const {colorApp} = useContext(ContextContainer);
  const [index, setIndex] = useState(
    keyActiveBookMark === 'BOOKMARK_STORE' ? 1 : 0,
  );
  const listStore = useRef(null);
  const listBookMark = useRef(null);
  useEffect(() => {
    TabViewService.onChange('BOOK_MARK_ACTIVE', () => {
      setIndex(1);
      return;
    });
    checkPermissionLocaitonPerform();
    return () => {
      TabViewService.deleteKey('BOOK_MARK_ACTIVE');
    };
  }, []);

  //CheckPermission Location
  const checkPermissionLocaitonPerform = () => {
    if (keyActiveBookMark == 'BOOKMARK_STORE') {
      return;
    } else {
      checkPermissionsWhenInUse();
    }
  };

  const [routes] = useState([
    {
      key: 'LIST_STORE',
      title: '店舗',
    },
    {
      key: 'LIST_BOOKMARK',
      title: 'お気に入り',
    },
  ]);

  //Chuyển tabView :
  const onChangeTabView = (index) => {
    const check = checkUserLogin('STORE_BOOKMARKED');
    if (check) {
      if (index == 0) {
        listStore.current.getData();
      } else {
        //Chú ý : listBookMark.current do dùng với lazy nên là nó chưa được mount nếu dùng luôn.
        // listBookMark.current.getData()=> sẽ crash app.
        if (listBookMark.current) {
          listBookMark.current.getData();
        }
      }
      setIndex(index);
    }
  };

  //Chuyển sang TabBookmark khi có sự kiện navigate vào BookMark:
  const activeTabViewBookMark = () => {
    setIndex(1);
  };

  //Các Component:
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'LIST_STORE':
        return (
          <ListStore
            index={index}
            ref={listStore}
            activeTabViewBookMark={activeTabViewBookMark}
            keyActiveBookMark={keyActiveBookMark}
          />
        );
      case 'LIST_BOOKMARK':
        return <ListBookMark ref={listBookMark} index={index} />;
      default:
        return (
          <ListStore
            index={index}
            ref={listStore}
            activeTabViewBookMark={activeTabViewBookMark}
            keyActiveBookMark={keyActiveBookMark}
          />
        );
    }
  };

  //Hiển thị Tabbar:
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: colorApp.backgroundColor,
        shadowOffset: {height: 0, width: 0},
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      }}
      renderLabel={({route, focused, color}) => (
        <View
          style={{
            backgroundColor: focused
              ? colorApp.activeTabBackground
              : COLOR.grey_300,
            width: SIZE.width(46),
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            borderRadius: 6,
          }}>
          <AppText>{route.title}</AppText>
        </View>
      )}
      renderIndicator={() => null}
      activeColor={COLOR.white}
      inactiveColor={COLOR.red}
      tabStyle={{padding: 0}}
    />
  );

  return (
    <AppContainer
      haveTitle
      haveBottom
      goBackScreen
      nameScreen={'店舗・チラシ'}
      style={{backgroundColor: colorApp.backgroundColor}}>
      <TabView
        // lazy
        swipeEnabled={false}
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        style={{flex: 1, width: SIZE.width(100)}}
        onIndexChange={onChangeTabView}
        initialLayout={initialLayout}
      />
    </AppContainer>
  );
};

export default withInteractionsManaged(Store);
