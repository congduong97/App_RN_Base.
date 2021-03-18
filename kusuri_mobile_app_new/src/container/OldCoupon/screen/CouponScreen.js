import React, { PureComponent } from "react";
import {
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
  View
} from "react-native";
import HeaderIconLeft from "../../../commons/HeaderIconLeft";
import { COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { DEVICE_WIDTH, tab } from "../../../const/System";

import { Api } from "../util/api";
import NetworkError from "../../../commons/NetworkError";
import Loading from "../../../commons/Loading";
import { ItemCoupon } from "../item/ItemCoupon";
import { checkVersionAllApp } from "../../Launcher/util/checkVersionAllApp";
import ReloadScreen from "../../../service/ReloadScreen";

export default class Coupon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingRefresh: false,
      networkError: false,
      error: false,
      data: [],
      page: 1,
      name: false,
      iconUrl: false,
      history: false,
      totalPages: 1,
      loadNextPage: false
    };
  }
  componentDidMount() {
    this.onDidMount();
    const { routeName } = this.props.navigation.state;
    ReloadScreen.onChange(routeName, () => {
      // alert('reload')
      this.getApi(true);
    });
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;

    ReloadScreen.unChange(routeName);
  }

  onDidMount = () => {
    this.getApi();
  };

  getApi = async loadRefresh => {
    checkVersionAllApp();
    if (this.state.isLoading || this.state.isLoadingRefresh) {
      return;
    }
    try {
      if (loadRefresh) {
        await this.setState({ isLoadingRefresh: true, page: 1 });
      } else {
        await this.setState({ isLoading: true });
      }

      const response = await Api.getCoupons();
      

      if (response.code === 200) {
        const { data, totalPages } = response.res;
        this.state.data = data;
        this.state.error = false;
        this.state.totalPages = totalPages;
      } else {
        this.state.error = true;
      }
    } catch (err) {
      this.state.error = true;
    } finally {
      this.setState({ isLoadingRefresh: false, isLoading: false });
    }
  };
  upDate = item => {
    item.canUse = false;

    this.setState({ data: this.state.data });
  };

  refreshPage() {
    this.getApi(true);
  }

  _renderItem = ({ item, index }) => {
    const { routeName } = this.props.navigation.state;
    return (
      <ItemCoupon
        navigation={this.props.navigation}
        history={routeName === "HISTORY_COUPON"}
        data={item}
        key={`${item.id}`}
      />
    );
  };
  _keyExtractor = (item, index) => `${item.id}`;
  renderContent() {
    const {
      isLoading,
      data,
      error,
      isLoadingRefresh,
      page,
      totalPages,
      loadNextPage
    } = this.state;
    if (isLoading) {
      return <Loading />;
    }
    if (error) {
      return <NetworkError onPress={this.onDidMount} />;
    }
    if (!data || data.length === 0) {
      return (
        <NetworkError
          title={"現在、利用可能なクーポンはありません"}
          disableIcon
          onPress={() => this.getApi()}
        />
      );
    }
    return (
      <FlatList
        data={data}
        ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => this.refreshPage()}
          />
        }
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        onEndReached={() => {
          if (totalPages > page && !loadNextPage) {
            // this.getApiNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    const { disableBackButton } = this.props;
    const { routeName } = this.props.navigation.state;

    const {
      iconUrlCouPonScreen,
      nameCouPonScreen,
      nameHistoryCouponScreen,
      iconUrlHistoryCouponScreen
    } = tab.screenTab;
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR }
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={
            routeName === "HISTORY_COUPON"
              ? nameHistoryCouponScreen
              : nameCouPonScreen
          }
          goBack={goBack}
          imageUrl={
            routeName === "HISTORY_COUPON"
              ? iconUrlHistoryCouponScreen
              : iconUrlCouPonScreen
          }
        />
        {this.renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1
  }
});
