import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import { styleInApp } from "../../../const/System";
import {
  DEVICE_WIDTH,
  menuInApp,
  sizePage,
  keyAsyncStorage,
} from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";
import { STRING } from "../util/string";
import { Liststore } from "../util/mokup";
import { NetworkError, Loading, HeaderIconLeft, Empty } from "../../../commons";
import ReloadScreen from "../../../service/ReloadScreen";
import StoreItem from "../item/StoreItem";
import { SIZE } from "../../../const/size";
import { Api } from "../util/api";
import MaintainView from "../../../commons/MaintainView";
export default class HistoryStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      error: false,
      isLoading: false,
      isLoadingRefresh: false,
      data: [],
      isMaintain: false,
    };
  }
  componentDidMount() {
    this.getListStoreHistory(false);
  }
  getMaintain = (maintain) => {
    this.setState({
      isMaintain: maintain,
    });
  };
  getListStoreHistory = async (loadRefresh) => {
    console.log("loadRefreshloadRefresh", loadRefresh);
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      this.setState({
        isMaintain: false,
      });
      return;
    }

    try {
      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
          networkError: false,
        });
      } else {
        this.setState({
          isLoading: true,
        });
      }
      const response = await Api.getListStoreHistory();
      if (response.code === 502) {
        this.setState({
          isLoadingRefresh: false,
          isLoading: false,
          isMaintain: true,
        });
        return;
      }
      console.log(response.res.data.content, "response");
      this.setState({
        data: response.res.data.content ? response.res.data.content : [],
        isLoading: false,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    }
  };
  renderContent() {
    const {
      isLoading,
      networkError,
      data,
      isMaintain,
      isLoadingRefresh,
    } = this.state;

    // console.log(data.length)
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getListStoreHistory(true);
          }}
        />
      );
    }
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }
    if (data.length == 0) {
      return (
        <Empty
          description={STRING.empty}
          onRefresh={() => this.getListStoreHistory(false)}
        />
      );
    }
    return (
      <ScrollView
        style={{ marginBottom: 20, marginHorizontal: SIZE.width(5) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getListStoreHistory(true);
            }}
          />
        }
      >
        <Text style={[styleInApp.hkgpronw6_16, { marginTop: 30 }]}>
          {STRING.please_choose_a_store}
        </Text>
        <Text
          style={[
            styleInApp.hkgpronw3_13,
            { marginVertical: 10, color: "#646464" },
          ]}
        >
          {STRING.show_max_3_store}
        </Text>
        {this.state.data.length > 0 &&
          this.state.data.map((store, index) => {
            return (
              <StoreItem
                key={`${index}`}
                store={store}
                index={index}
                getMaintain={this.getMaintain}
              />
            );
          })}
      </ScrollView>
    );
  }
  render() {
    let { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return <MaintainView onPress={() => this.getListStoreHistory(false)} />;
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
          //   title={"fhdhdhdy"}
          goBack={goBack}
          imageUrl={menuInApp.iconNotification}
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
    flex: 1,
  },
  // shadow: {
  //   shadowColor: COLOR_GRAY,
  //   shadowOffset: { width: 2, height: 2 },
  //   shadowOpacity: 0.5,
  //   elevation: 2,
  // },
});
