import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import ListCouponScreen from '../screen/ListCouponScreen';
import Header from '../item/Header';
import {tab, DEVICE_WIDTH, isIOS} from '../../../const/System';
import Loading from '../../../commons/Loading';
import {TabBar} from '../../../nativelib/react-native-tab-view';
import TabView from '../../../nativelib/react-native-tab-view/src/TabView';
import {COLOR_WHITE, APP_COLOR} from '../../../const/Color';
import NetworkError from '../../../commons/NetworkError';
import ButtonUseListCoupons from '../item/ButtonUseListCoupons';
import {API} from '../util/api';
import {checkBlackList} from '../../Account/util/checkBlackList';
import {
  serviceDeeplink,
  serviceDeeplinkReferralCoupon,
} from '../../HomeScreen/util/service';
import {CouponSelectService} from '../util/services/CouponSelectService';
export default class CouponScreen extends PureComponent {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    let keySearch = '';
    let detailId = '';
    let checkQpon = false;
    if (params && params.keyWord) {
      keySearch = params.keyWord;
      this.addKeySearchCoupon(keySearch);
    }
    if (params && params.detailId) {
      detailId = params.detailId;
      checkQpon = params.qrCode;
    }
    this.ListCoupon = {};
    this.state = {
      index: 0,
      loading: true,
      keySearch: keySearch,
      detailId: detailId,
      checkQpon: checkQpon,
      data: {
        listAllMemberCoupon: [],
        listLimitCoupon: [],
        listUsedCoupon: [],
      },
      routes: [],
      couponSettingDescription: '',
      indexTabBottom: 0,
      dataAllCoupon: {},
      listCouponSelected: [],
      totalElement: 0,
      textSearch: '',
      category: [],
      loadingDeeplink: false,
      loadingRefresh: false,
      error: false,
    };
  }
  checkMemberInBlackList = async () => {
    try {
      const blackList = await checkBlackList();
      if (blackList) {
        return;
      }
    } catch (error) {}
  };

  gotoDetailCoupon = () => {
    const {detailId, couponSettingDescription, checkQpon} = this.state;
    let dataTextSetting = couponSettingDescription;
    const {navigation} = this.props;
    let data;
    if (checkQpon && detailId) {
      this.state.data.listUsedCoupon.map(items => {
        if (items.id === parseInt(detailId)) {
          data = items;
        }
      });
      if (data) {
        navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
      }
    }
    if (this.state.data.listAllMemberCoupon.length !== 0 && detailId) {
      this.state.data.listAllMemberCoupon.map(items => {
        if (items.id === parseInt(detailId)) {
          data = items;
        }
      });
      if (data) {
        navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
      }
    }
    if (this.state.data.listLimitCoupon.length !== 0 && detailId) {
      this.state.data.listLimitCoupon.map(items => {
        if (items.id === parseInt(detailId)) {
          data = items;
        }
      });
      if (data) {
        navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
      }
    }
    if (this.state.data.listUsedCoupon.length !== 0 && detailId) {
      this.state.data.listUsedCoupon.map(items => {
        if (items.id === parseInt(detailId)) {
          data = items;
        }
      });
      if (data) {
        navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
      }
    }
  };
  gotoDeatail = () => {
    const {detailId, couponSettingDescription} = this.state;
    const {navigation} = this.props;
    let dataTextSetting = couponSettingDescription;
    let data;
    this.state.data.listAllMemberCoupon.map(items => {
      if (items.id === parseInt(detailId)) {
        data = items;
      }
    });
    if (data) {
      navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
    }
    this.state.data.listLimitCoupon.map(items => {
      if (items.id === parseInt(detailId)) {
        data = items;
      }
    });
    if (data) {
      navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
    }
    this.state.data.listUsedCoupon.map(items => {
      if (items.id === parseInt(detailId)) {
        data = items;
      }
    });
    if (data) {
      navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
    }
  };
  addKeySearchCoupon = async text => {
    try {
      const response = await API.addHistoryCoupon(text ? text : '');
    } catch (e) {}
  };
  componentDidMount() {
    this.checkMemberInBlackList();
    this.onDidMount();
    serviceDeeplinkReferralCoupon.onChange('ReferralCouponDeeplink', data => {
      if (data.referralCode) {
        this.onDidMount();
      }
    });
    serviceDeeplink.onChange('DeepLink', data => {
      this.setState({
        loadingDeeplink: true,
        textSearch: '',
      });
      if (data) {
        if (data.nameFunction === 'COUPON') {
          if (this.timOut) {
            clearTimeout(this.timOut);
          }
          this.timOut = setTimeout(() => {
            this.setState({
              loadingDeeplink: false,
              keySearch: '',
              index: 0,
              indexTabBottom: 0,
            });
          }, 150);
        } else if (data.referralCode) {
          if (this.timOut) {
            clearTimeout(this.timOut);
          }
          this.timOut = setTimeout(() => {
            this.setState({
              loadingDeeplink: false,
              keySearch: '',
              index: 0,
              indexTabBottom: 0,
            });
            this.onDidMount();
          }, 0);
        } else if (data.keySeach && data.search) {
          this.addKeySearchCoupon(data.keySeach);
          if (this.timOut) {
            clearTimeout(this.timOut);
          }
          this.timOut = setTimeout(() => {
            this.setState(
              {
                keySearch: data.keySeach,
                loadingDeeplink: false,
              },
              () => this.searchCoupon(data.keySeach),
            );
          }, 150);
        } else if (data.detailId) {
          if (this.timOut) {
            clearTimeout(this.timOut);
          }
          this.timOut = setTimeout(() => {
            this.setState(
              {
                detailId: data.detailId,
                loadingDeeplink: false,
              },
              () => this.gotoDeatail(),
            );
          }, 150);
        }
      } else {
        return;
      }
    });
    const {keySearch} = this.state;
    if (keySearch) {
      this.searchCoupon(keySearch);
    }
    CouponSelectService.onChangeUseCoupon(
      'DELETE_COUPON_IS_USED',
      dataUseCoupon => {
        if (dataUseCoupon.length > 0) {
          const {data} = this.state;
          const {listAllMemberCoupon, listLimitCoupon, listUsedCoupon} = data;
          for (let i = 0; i < dataUseCoupon.length; i++) {
            const indexALlMemberCoupon = listAllMemberCoupon.findIndex(item => {
              return item.id === dataUseCoupon[i].id;
            });
            if (indexALlMemberCoupon > -1) {
              listAllMemberCoupon.splice(indexALlMemberCoupon, 1);
            }
            const indexTarget = listLimitCoupon.findIndex(item => {
              return item.id === dataUseCoupon[i].id;
            });
            if (indexTarget > -1) {
              listLimitCoupon.splice(indexTarget, 1);
            }
            const indexUseCoupon = listUsedCoupon.findIndex(item => {
              return item.id === dataUseCoupon[i].id;
            });
            if (indexUseCoupon === -1 && dataUseCoupon[i].used) {
            } else if (indexUseCoupon === -1) {
              listUsedCoupon.unshift({
                ...dataUseCoupon[i],
                filter: 'used',
              });
            }
          }
          this.state.data = {...data};

          Object.keys(this.ListCoupon).forEach(key => {
            this.ListCoupon[key].onSetDataCoupon();
          });
        }
      },
    );
  }

  componentWillUnmount() {
    if (this.timOut) {
      clearTimeout(this.timOut);
    }
    CouponSelectService.unChange('DELETE_COUPON_IS_USED');
    serviceDeeplink.unChange('DeepLink');
    serviceDeeplinkReferralCoupon.unChange('ReferralCouponDeeplink');
  }

  onDidMount = async () => {
    const {loading} = this.state;
    console.log('loading', loading);
    this.state.error = false;
    if (!loading) {
      this.setState({
        loading: true,
      });
    }
    await this.getCoupon();
    this.setState({
      loading: false,
    });
  };
  onReloadApi = async () => {
    this.setState({
      detailId: '',
      loadingRefresh: true,
    });
    await this.onDidMount();
    this.setState({
      loadingRefresh: false,
    });
  };

  getCoupon = async () => {
    try {
      const {detailId} = this.state;
      const responseCategoryCoupon = await API.getCategoryCoupon();
      console.log('responseCategoryCoupon', responseCategoryCoupon);
      const responseListALLCoupon = await API.getListAllCoupon();
      console.log('responseListALLCoupon', responseListALLCoupon);
      if (
        responseCategoryCoupon.code == 200 &&
        responseCategoryCoupon.res.status.code == 1000 &&
        responseListALLCoupon.code === 200 &&
        responseListALLCoupon.res.status.code === 1000
      ) {
        const routes = responseCategoryCoupon.res.data.map(item => ({
          key: `${item.categoryCode}`,
          title: item.categoryName,
        }));
        this.state.couponSettingDescription =
          responseListALLCoupon.res.data.couponSettingDescription;
        this.state.dataAllCoupon = responseListALLCoupon.res.data;
        const {listUsedCoupon} = responseListALLCoupon.res.data;
        if (listUsedCoupon) {
          const listUsed = listUsedCoupon.map(item => {
            return {...item, filter: 'used'};
          });
          responseListALLCoupon.res.data.listUsedCoupon = [...listUsed];
        }
        this.state.data = {...responseListALLCoupon.res.data};
        this.state.routes = [{key: 'all', title: 'すべて'}, ...routes];
        if (detailId) {
          this.gotoDetailCoupon();
        }
      } else if (responseListALLCoupon.res.status === 900) {
      } else {
        this.state.error = true;
      }
    } catch (e) {
      console.log(e);
      this.state.error = true;
    }
  };

  renderListCouponBottomTabIndex = () => {
    const {indexTabBottom, data} = this.state;
    if (indexTabBottom === 0) {
      return data.listAllMemberCoupon || [];
    }
    if (indexTabBottom === 1) {
      return data.listLimitCoupon || [];
    }
    if (indexTabBottom === 2) {
      return data.listUsedCoupon || [];
    }
  };

  checkStyleTabar = () => {
    const {routes} = this.state;
    if (routes.length === 2) {
      return DEVICE_WIDTH / 2;
    }
    if (routes.length === 3) {
      return DEVICE_WIDTH / 3;
    }
    if (routes.length > 3) {
      return DEVICE_WIDTH / 4;
    }
  };
  renderItemRefreshControl = () => {
    const {loadingRefresh} = this.state;
    if (loadingRefresh && !isIOS) {
      return (
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: COLOR_WHITE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: APP_COLOR.COLOR_TEXT}}>
            {'下に引っ張って更新'}
          </Text>
        </View>
      );
    }
    return null;
  };

  setTabBottomCatagory = index => {
    this.setState(
      {
        indexTabBottom: index,
      },
      () =>
        Object.keys(this.ListCoupon).forEach(key => {
          this.ListCoupon[key].onSetDataCoupon();
        }),
    );
  };

  onIndexChange = index => {
    this.setState({index});
  };

  renderContent = () => {
    const {
      loading,
      error,
      indexTabBottom,
      textSearch,
      dataAllCoupon,
      couponSettingDescription,
      loadingDeeplink,
      routes,
      data,
      loadingRefresh,
    } = this.state;
    console.log('error', error);
    if (!isIOS && loadingRefresh) {
      return (
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: COLOR_WHITE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: APP_COLOR.COLOR_TEXT}}>
            {'下に引っ張って更新'}
          </Text>
        </View>
      );
    }
    if (loading || loadingDeeplink) {
      return <Loading />;
    }
    if (
      !data.listAllMemberCoupon &&
      !data.listLimitCoupon &&
      !data.listUsedCoupon &&
      routes.length <= 1
    ) {
      return (
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={this.onDidMount}>
          <Text>現在クーポンがありません。</Text>
        </TouchableOpacity>
      );
    }
    if (error) {
      return <NetworkError onPress={this.onDidMount} />;
    }

    let dataGet = this.renderListCouponBottomTabIndex();
    return (
      <View style={{flex: 1}}>
        <TabView
          active={indexTabBottom}
          scrollEnabled={true}
          lazy={true}
          changeTab={index => this.setTabBottomCatagory(index)}
          onRef={ref => {
            this.tabbar = ref;
          }}
          ref={ref => (this.tab = ref)}
          navigationState={this.state}
          useNativeDriver
          renderTabBar={props => {
            return (
              <TabBar
                scrollEnabled
                {...props}
                tabStyle={{
                  width: this.checkStyleTabar(),
                  height: 40,
                  padding: 0,
                }}
                labelStyle={{color: APP_COLOR.COLOR_TEXT, fontSize: 14}}
                style={{backgroundColor: COLOR_WHITE}}
                indicatorStyle={{
                  backgroundColor: APP_COLOR.COLOR_TEXT,
                  width: this.checkStyleTabar(),
                }}
              />
            );
          }}
          renderScene={routes => {
            return (
              <ListCouponScreen
                onRef={ref => {
                  this.ListCoupon[routes.route.key] = ref;
                }}
                
                couponSettingDescription={couponSettingDescription}
                textSearch={textSearch}
                indexTabBottom={indexTabBottom}
                navigation={this.props.navigation}
                category={routes.route}
                dataCoupon={dataGet}
                loading={loading}
                dataAllCoupon={dataAllCoupon}
                loadingRefreshCoupon={this.onReloadApi}
              />
            );
          }}
          onIndexChange={index => this.onIndexChange(index)}
          initialLayout={{width: DEVICE_WIDTH}}
        />

        <View style={styles.buttonBottom}>
          <ButtonUseListCoupons navigation={this.props.navigation} />
        </View>
      </View>
    );
  };
  searchCoupon = textSearch => {
    this.setState(
      {
        textSearch: textSearch,
      },
      () =>
        Object.keys(this.ListCoupon).forEach(key => {
          // this.ListCoupon[key].onSetDataCoupon();
        }),
    );
  };
  onPressDeleteKeySearch = () => {
    this.setState({
      textSearch: '',
    });
    this.renderListCouponBottomTabIndex();
  };
  onPressSearch = () => {
    const {navigation} = this.props;
    navigation.navigate('SEARCH_COUPON', {searchCoupon: this.searchCoupon});
  };
  setDataEmpty = () => {
    let data = {};
    let newData = {...data};
    newData.useCoupon = true;
    CouponSelectService.set(newData);
  };

  render() {
    const {textSearch, loadingDeeplink} = this.state;
    const {goBack} = this.props.navigation;
    const {iconUrlCouPonScreen, nameCouPonScreen} = tab.screenTab;
    return (
      <View style={{flex: 1, backgroundColor: COLOR_WHITE}}>
        <Header
          setDataEmpty={this.setDataEmpty}
          keySearch={textSearch}
          onPressDelete={this.onPressDeleteKeySearch}
          navigation={this.props.navigation}
          onPressSearch={this.onPressSearch}
          title={nameCouPonScreen}
          goBack={goBack}
          imageUrl={iconUrlCouPonScreen}
        />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBottom: {
    position: 'absolute',
    bottom: 0,
    width: DEVICE_WIDTH,
  },
});
