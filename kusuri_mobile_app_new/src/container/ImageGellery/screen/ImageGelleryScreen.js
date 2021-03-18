import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import HeaderIconLeft from "../../../commons/HeaderIconLeft";
import { COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { tab, DEVICE_WIDTH, sizePage } from "../../../const/System";

import { Api } from "../util/api";
import NetworkError from "../../../commons/NetworkError";
import Loading from "../../../commons/Loading";
import { ItemImageGellery } from "../Item/ItemImageGellery";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";

export default class ImageGellery extends PureComponent {
  constructor() {
    super();
    this.state = {
      networkError: false,
      data: [],
      page: 1,
      isLoading: false,
      isLoadingRefresh: false,
      iconUrl: false,
      totalPages: 1,
      loadNextPage: false,
      maintain: false,
    };
  }
  componentDidMount() {
    this.getApi();
    const { routeName } = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      this.getApi(true);
    });
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }
  getApi = async (loadRefresh) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    try {
      loadRefresh
        ? this.setState({ isLoadingRefresh: true, page: 1 })
        : this.setState({ isLoading: true });

      const response = await Api.getImageGellery(sizePage, 1);
      if (response.code === 200 && response.res.status.code == 1000) {
        const { totalPages, content } = response.res.data;
        this.state.data = content;
        this.state.totalPages = totalPages;
        this.state.networkError = false;
        this.state.maintain = false;
      } else if (response.code === 502) {
        this.state.maintain = true;
        this.state.networkError = false;
      } else {
        this.state.networkError = true;
        this.state.maintain = false;
      }
    } catch (err) {
      this.state.networkError = true;
      this.state.maintain = false;
    } finally {
      this.setState({ isLoadingRefresh: false, isLoading: false });
    }
  };

  getApiNextPage = async () => {
    try {
      this.setState({ loadNextPage: true });

      const response = await Api.getImageGellery(sizePage, this.state.page + 1);
      this.state.page = this.state.page + 1;
      if (response.code === 200 && response.res.status.code == 1000) {
        this.state.data = [...this.state.data, ...response.res.data.content];
      }
    } catch (err) {
    } finally {
      this.setState({ loadNextPage: false });
    }
  };
  refreshPage() {
    this.getApi(true);
  }

  _renderItem = ({ item }) => (
    <ItemImageGellery data={item} key={`${item.id}`} />
  );
  renderContent = () => {
    const {
      isLoading,
      networkError,
      loadNextPage,
      totalPages,
      page,
    } = this.state;
    if (isLoading) {
      return <Loading />;
    }
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getApi();
          }}
        />
      );
    }

    return (
      <FlatList
        ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        data={this.state.data}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoadingRefresh}
            onRefresh={() => this.getApi(true)}
          />
        }
        extraData={this.state}
        keyExtractor={(item, i) => `${item.id}`}
        renderItem={this._renderItem}
        onEndReached={() => {
          if (totalPages > page && !loadNextPage) {
            this.getApiNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  };
  render() {
    const { goBack } = this.props.navigation;
    const { iconUrlImageGelleryScreen, nameImageGelleryScreen } = tab.screenTab;
    const { disableBackButton } = this.props;
    const { maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.getApi} />;
    }
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />

        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameImageGelleryScreen}
          goBack={goBack}
          imageUrl={iconUrlImageGelleryScreen}
        />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
  },
});
