import React, {PureComponent} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {DEVICE_WIDTH} from '../../../const/System';
import {COLOR_GRAY_LIGHT} from '../../../const/Color';

import Loading from '../../../commons/Loading';

import {ItemMenu} from '../Item/ItemMenu';
import NetworkError from '../../../commons/NetworkError';
import {CheckDataApp} from '../../LauncherScreen/service';

export class ListItemMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
      columnMenu: 2,
      loading: true,
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    onRef && onRef(this);
    this.getAllMenu();

    CheckDataApp.onChange('LIST_MENU', () => {
      this.refresh();
    });
  }
  componentWillUnmount() {
    CheckDataApp.unChange('LIST_MENU');
  }
  getAllMenu = () => {
    AsyncStorage.getItem('menu').then(res => {
      if (Array.isArray(JSON.parse(res).menuEntities)) {
        const lengthMenu = JSON.parse(res).menuEntities.length;
        const columnMenu = JSON.parse(res).rowSize;

        const sum =
          columnMenu -
          (lengthMenu % columnMenu === 0 ? 3 : lengthMenu % columnMenu);
        const listItem = [];
        for (let i = 0; i < sum; i++) {
          listItem.push({name: '', url: 'null', iconUrl: ''});
        }
        // const comlum =  JSON.parse(res).rowSize
        this.setState({
          menu: [...JSON.parse(res).menuEntities, ...listItem],
          columnMenu,
        });
        this.setState({loading: false});
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        // onDataLoadFinish && onDataLoadFinish();
      }
    });
  };
  refresh = () => {
    this.setState({loading: true});
    this.getAllMenu();
  };
  refreshApiCouponNew = () => {
    if (this.ItemMenu && this.ItemMenu.getApiNewCoupon) {
      this.ItemMenu.getApiNewCoupon();
    }
  };
  keyExtractor = (item, index) => `${index}a`;

  renderItem = ({item, index}) => {
    const {navigation, screenProps} = this.props;
    const {columnMenu} = this.state;
    return (
      <ItemMenu
        refreshApiCouponNew={this.refreshApiCouponNew}
        screenProps={screenProps}
        column={columnMenu}
        item={item}
        onRef={ref => {
          this.ItemMenu = ref;
        }}
        index={index}
        key={`${index}a`}
        navigation={navigation}
      />
    );
  };

  render() {
    const {menu, columnMenu, loading} = this.state;
    if (loading) {
      return (
        <Loading
          style={{width: '100%', height: 150, marginVertical: 25}}
          spinkit
        />
      );
    }
    if (menu.length > 0) {
      return (
        <FlatList
          style={styles.wrapperBody}
          columnWrapperStyle={{alignItems: 'flex-start'}}
          numColumns={columnMenu}
          data={menu}
          // extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      );
    }
    return (
      <NetworkError
        onPress={() => this.refresh()}
        iconName={'refresh-cw'}
        iconSize={30}
        textStyle={{fontSize: 14, marginBottom: 20}}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    borderTopWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
    opacity: 1,
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH / 2 + 50,
  },
  imageIcon: {
    width: DEVICE_WIDTH / 10,
    height: DEVICE_WIDTH / 10,
  },

  textButton: {
    fontSize: 14,
  },
});
