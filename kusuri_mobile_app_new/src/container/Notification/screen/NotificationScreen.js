import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  menuInApp,
  sizePage,
  keyAsyncStorage,
} from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";

import { Api } from "../util/api";
import { NetworkError, Loading, HeaderIconLeft } from "../../../commons";
import ItemNotification from "../item/ItemNotification";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      error: false,
      isLoading: false,
      isLoadingRefresh: false,
      data: [],
      page: 1,
      title: "",
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
      const date = new Date().getTime().toString();
      AsyncStorage.setItem(keyAsyncStorage.timeUpdateCompanyNotification, date);

      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
          page: 1,
          networkError: false,
          error: false,
        });
      } else {
        this.setState({ isLoading: true, networkError: false, error: false });
      }
      const response = await Api.getNotification(sizePage, 1);
      if (response.code === 200 && response.res.status.code === 1000) {
        const { content, totalPages } = response.res.data;
        this.state.data = content;
        this.state.error = false;
        this.state.maintain = false;
        this.state.totalPages = totalPages;
      } else if (response.code === 502) {
        this.state.maintain = true;
        this.state.error = false;
      } else {
        this.state.error = true;
        this.state.maintain = false;
      }
    } catch (err) {
      this.state.error = true;
    } finally {
      this.setState({ isLoading: false, isLoadingRefresh: false });
    }
  };

  getApiNextPage = async () => {
    this.setState({ loadNextPage: true });
    try {
      const response = await Api.getNotification(sizePage, this.state.page + 1);
      if ((response.code === 200, response.res.status.code === 1000)) {
        this.state.page++;
        const { content } = response.res.data;
        this.state.data = [...this.state.data, ...content];
        this.state.loadNextPage = false;
      } else {
      }
    } catch (err) {
    } finally {
      this.setState({ loadNextPage: false });
    }
  };
  refreshPage() {
    this.state.page = 1;
    this.getApi(true);
  }

  keyExtractor = (item, index) => `${item.id}`;
  renderItem = ({ item, i }) => (
    <ItemNotification
      data={item}
      key={`${item.id}`}
      navigation={this.props.navigation}
    />
  );
  renderContent = () => {
    const {
      isLoading,
      isLoadingRefresh,
      data,
      error,
      loadNextPage,
      totalPages,
      page,
    } = this.state;

    if (isLoading) return <Loading />;
    if (error) {
      return <NetworkError onPress={this.onDidMount} />;
    }

    if (!data || data.length === 0) {
      return (
        <NetworkError
          title={"現在、お知らせはありません。"}
          disableIcon
          iconName={"reload"}
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
  };
  render() {
    const { maintain } = this.state;
    const { goBack } = this.props.navigation;
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
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft
          title={menuInApp.nameNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconNotification}
        />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1,
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  shadow: {
    shadowColor: COLOR_GRAY,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
  },
  wrapperSpace: {
    height: 50,
  },
});
