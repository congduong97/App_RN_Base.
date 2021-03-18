import React, {PureComponent} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import ItemCoupon from '../item/ItemCoupon';
import {COLOR_WHITE} from '../../../const/Color';
import {DEVICE_WIDTH} from '../../../const/System';
import Loading from '../../../commons/Loading';
import {CouponSelectService} from '../util/services/CouponSelectService';
export default class ListItemCouponScreen extends PureComponent {
  constructor(props) {
    super(props);
    const {dataCoupon, dataAllCoupon} = this.props;
    this.state = {
      loadingRefresh: false,
      nextPage: false,
      dataAllCoupon: dataAllCoupon,
      data: dataCoupon,
      elementEnd: 10,
      listDataSlice: [],
      totalElement: dataCoupon.length,
      loadingSet: false,
    };
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutSet);
  }

  onSetDataCoupon = () => {
    const {dataCoupon} = this.props;
    this.setState({
      loadingSet: true,
    });
    this.state.data = [...dataCoupon];
    this.state.elementEnd = 10;
    this.state.totalElement = [...dataCoupon].length;
    if (this.timeOutSet) {
      clearTimeout(this.timeOutSet);
    }
    this.timeOutSet = setTimeout(() => {
      this.setState({
        loadingSet: false,
      });
    }, 150);
  };

  renderItem = ({item, index}) => {
    const {category, couponSettingDescription} = this.props;
    const {dataAllCoupon} = this.state;
    const {navigation} = this.props;
    return (
      <ItemCoupon
        onRef={ref => {
          this.ItemCoupon = ref;
        }}
        dataTextSetting={couponSettingDescription}
        key={`${item.id}`}
        numberDayUseCoupon={dataAllCoupon.numberDayNotifyingBeforeExpiration}
        index={index}
        navigation={navigation}
        data={item}
        category={category}
      />
    );
  };

  onRefreshListCoupon = async () => {
    const {loadingRefreshCoupon} = this.props;
    let data = {};
    let newData = {...data};
    newData.useCoupon = true;
    CouponSelectService.set(newData);
    if (loadingRefreshCoupon) {
      await loadingRefreshCoupon();
    }
  };

  nextPage = () => {
    if (this.state.totalElement > this.state.elementEnd) {
      this.setState({
        nextPage: true,
      });
      this.state.elementEnd = this.state.elementEnd + 10;
      if (this.state.elementEnd > this.state.totalElement) {
        this.state.elementEnd = this.state.totalElement;
      }
      const dataAdd = [];
      this.state.data.map((item, index) => {
        if (index <= this.state.elementEnd) {
          dataAdd.push(item);
        }
      });
      this.setState({
        listDataSlice: [...dataAdd],
        nextPage: false,
      });
    }
  };
  render() {
    const {loading, category, textSearch} = this.props;
    const {loadingRefresh, nextPage, data, elementEnd, loadingSet} = this.state;
    if (loading || loadingSet) {
      return <Loading />;
    }
    if (data && data.length === 0) {
      return (
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={this.onRefreshListCoupon}>
          <Text>現在クーポンがありません。</Text>
        </TouchableOpacity>
      );
    }
    this.state.listDataSlice = data.filter(item => {
      if (category.key === 'all') {
        if (textSearch) {
          return item.name.toLowerCase().includes(textSearch.toLowerCase());
        }
        if (item.filter === 'used') return true;
        return !item.used;
      }
      if (item.categoryCode === category.key) {
        if (textSearch) {
          return item.name.toLowerCase().includes(textSearch.toLowerCase());
        }
        if (item.filter === 'used') return true;
        return !item.used;
      }
    });
    if (this.state.listDataSlice && this.state.listDataSlice.length === 0) {
      return (
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={this.onRefreshListCoupon}>
          <Text>現在クーポンがありません。</Text>
        </TouchableOpacity>
      );
    }
    this.state.listDataSlice = this.state.listDataSlice.slice(0, elementEnd);

    return (
      <View style={[styles.wrapperContainer, {paddingBottom: 0}]}>
        <FlatList
          style={[styles.wrapperContainer, {padding: 0}]}
          data={this.state.listDataSlice}
          ListFooterComponent={nextPage ? <Loading /> : null}
          keyExtractor={(item, index) => `${item.id}${index}`}
          extraData={this.state.listDataSlice}
          refreshControl={
            <RefreshControl
              refreshing={loadingRefresh}
              title={'下に引っ張って更新'}
              onRefresh={this.onRefreshListCoupon}
            />
          }
          onEndReached={this.nextPage}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.8}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: COLOR_WHITE,
  },
  wrapperTitle: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBottom: {
    position: 'absolute',
    bottom: 0,
    width: DEVICE_WIDTH,
  },
});
