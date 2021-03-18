import React, { PureComponent } from "react";
import {
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { menuInApp, sizePage } from "../../../const/System";
import { Api } from "../util/api";
import { NetworkError, Loading, HeaderIconLeft } from "../../../commons";
import { ItemPushNotification } from "../item/ItemPushNotification";
import ReloadScreen from "../../../service/ReloadScreen";
import { NumberNewNofitification } from "../../Home/util/service";
import MaintainView from "../../../commons/MaintainView";

export default class Notifications extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingRefresh: false,
      networkError: false,
      data: [],
      page: 1,
      namePushNotification: null,
      error: false,
      iconUrl: false,
      totalPages: 1,
      loadNextPage: false,
      maintain: false,
    };
  }
  componentDidMount() {
    this.onDidMount();
    const { routeName } = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
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
  getApi = async (loadRefresh) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    try {
      if (loadRefresh) {
        this.setState({ isLoadingRefresh: true, page: 1 });
      } else {
        this.setState({ isLoading: true });
      }
      const response = await Api.getPushNotification(sizePage, 1);
      if (response.code === 200 && response.res.status.code == 1000) {
        const { content, totalPages } = response.res.data;
        this.state.data = content;
        this.state.error = false;
        this.state.maintain = false;
        this.state.totalPages = totalPages;
        NumberNewNofitification.set(0);
      } else if (response.code == 502) {
        this.state.maintain = true;
        this.state.error = false;
      } else {
        this.state.error = true;
        this.state.maintain = false;
      }
    } catch (e) {
      this.state.error = true;
    } finally {
      this.setState({ isLoading: false, isLoadingRefresh: false });
    }
  };

  getApiNextPage = async () => {
    try {
      this.setState({ loadNextPage: true });

      const response = await Api.getPushNotification(
        sizePage,
        this.state.page + 1
      );
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.page = this.state.page + 1;
        this.state.data = [
          ...this.state.data,
          ...(response.res.data.content || []),
        ];
      }
    } catch (err) {
    } finally {
      this.setState({ loadNextPage: false });
    }
  };

  refreshPage() {
    this.getApi(true);
  }

  keyExtractor = (item, index) => `${item.id}`;

  renderItem = ({ item, index }) => (
    <ItemPushNotification
      key={`${item.id}`}
      item={item}
      navigation={this.props.navigation}
    />
  );
  renderContent() {
    const {
      isLoading,
      error,
      data,
      isLoadingRefresh,
      totalPages,
      page,
      loadNextPage,
    } = this.state;

    if (isLoading) return <Loading />;

    if (error) {
      return <NetworkError onPress={this.onDidMount} />;
    }
    if (!data || data.length === 0) {
      return (
        <NetworkError
          title={"現在、プッシュ通知はありません。"}
          disableIcon
          onPress={() => this.getApi()}
        />
      );
    }

    return (
      <FlatList
        data={data}
        extraData={this.state}
        ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => this.refreshPage()}
          />
        }
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        onEndReached={() => {
          if (totalPages > page && !loadNextPage) {
            this.getApiNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    const { maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.onDidMount} timeOut={10000} />;
    }
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          title={menuInApp.namePushNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconPushNotification}
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
  },
});
