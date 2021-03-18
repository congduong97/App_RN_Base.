import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  FlatList,
  LayoutAnimation,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import { DEVICE_WIDTH, menuInApp, styleInApp } from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";
import { STRING } from "../util/string";
import { ListDistrict } from "../util/mokup";
import { NetworkError, Loading, HeaderIconLeft, Empty } from "../../../commons";
import ReloadScreen from "../../../service/ReloadScreen";
import AntDesign from "react-native-vector-icons/AntDesign";
import DistrictItem from "../item/DistrictItem";
import { SIZE } from "../../../const/size";
import { Api } from "../util/api";
import MaintainView from "../../../commons/MaintainView";
export default class ListStoreInDistrict extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      error: false,
      isLoading: false,
      isLoadingRefresh: false,
      data: [],
      indexDistrict: 0,
      indexVillage: 0,
      isMaintain: false,
    };
  }
  componentDidMount() {
    this.getListCitiesAndDistricts(false);
  }
  getListCitiesAndDistricts = async (loadRefresh) => {
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
        });
      } else {
        this.setState({
          isLoading: true,
        });
      }
      const response = await Api.getListCitiesAndDistricts();
      if (response.code === 502) {
        this.setState({
          isLoading: false,
          isMaintain: true,
          isLoadingRefresh: false,
        });
        return;
      }
      this.setState({
        data: response.res.data ? response.res.data : [],
        isLoading: false,
        isLoadingRefresh: false,
        isMaintain: false,
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

  getItemChoosed = (item, index) => {
    // console.log(item, "index", index, "item");
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.create(
    //     200,
    //     LayoutAnimation.Types.spring,
    //     LayoutAnimation.Properties.scaleY,
    //   ),
    // );
    this.setState({
      ...this.state,
      indexDistrict: this.state.indexDistrict == index + 1 ? 0 : index + 1,
      indexVillage: 0,
    });
  };
  getVillagechoosed = (item, index) => {
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.create(
    //     200,
    //     LayoutAnimation.Types.easeIn,
    //     LayoutAnimation.Properties.scaleY,
    //   ),
    // );
    this.setState({
      ...this.state,
      indexVillage: this.state.indexVillage == index + 1 ? 0 : index + 1,
    });
  };
  getMaintainItem = (status) => {
    this.setState({
      ...this.state,
      isMaintain: status,
      indexDistrict: 0,
      indexVillage: 0,
      isLoading:false
    });
  };
  renderContent() {
    const { isLoading, networkError, data, isMaintain } = this.state;

    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getListCitiesAndDistricts(true);
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
    if (!data) {
      return (
        <Empty
          description={"まだ都市はありません"}
          onRefresh={() => this.getListCitiesAndDistricts(false)}
        />
      );
    }
    // console.log(this.state.indexDistrict);
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styleInApp.hkgpronw6_16, styles.textContent]}>
          {STRING.choose_from_district}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={this.state.data}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoadingRefresh}
              onRefresh={() => {
                this.getListCitiesAndDistricts(true);
              }}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <DistrictItem
                item={item}
                index={index}
                getItemChoosed={this.getItemChoosed}
                indexDistrict={this.state.indexDistrict}
                indexVillage={this.state.indexVillage}
                getVillagechoosed={this.getVillagechoosed}
                getMaintainItem={this.getMaintainItem}
              />
            );
          }}
        />
      </View>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          onPress={() => this.getListCitiesAndDistricts(false)}
          timeOut={10000}
        />
      );
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

  textContent: {
    marginTop: 30,
    marginLeft: SIZE.width(5),
    marginBottom: 10,
  },
});
