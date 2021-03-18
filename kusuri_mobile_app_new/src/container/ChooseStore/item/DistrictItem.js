import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import StoreItem from "./StoreItem";
import { NetworkError, Loading, HeaderIconLeft } from "../../../commons";
import { Api } from "../util/api";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import { styleInApp } from "../../../const/System";
import { SIZE } from "../../../const/size";
export default class DistrictItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liststore: [],
      networkError: false,
      error: false,
      isLoading: false,
      isLoadingRefresh: false,
    };
  }
  getListStore = async (id, loadRefresh) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    console.log(id, "id");
    try {
      if (loadRefresh) {
        this.setState({
          ...this.state,
          isLoadingRefresh: true,
        });
      } else {
        this.setState({
          ...this.state,
          isLoading: true,
        });
        const response = await Api.getListStoreByDistrict(id);
        if (response.code === 502) {
          this.props.getMaintainItem(true);
          return;
        }
        console.log(response, "getListStoreByDistrict");
        this.setState({
          ...this.state,
          liststore: response.res.data ? response.res.data : [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
      });
    }
  };
  renderStore() {
    const {
      isLoading,
      isLoadingRefresh,
      error,
      networkError,
      liststore,
    } = this.state;
    console.log(liststore, "liststore");
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getListStore(true);
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

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 20 }}
        data={liststore}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getListStore(false);
            }}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <StoreItem
              store={item}
              index={index}
              getMaintain={this.props.getMaintainItem}
            />
          );
        }}
      />
    );
  }
  render() {
    const {
      item,
      index,
      getItemChoosed,
      indexDistrict,
      indexVillage,
      getVillagechoosed,
    } = this.props;
    console.log(indexDistrict, "indexDistrict");
    return (
      <View style={{ marginHorizontal: SIZE.width(5), marginTop: 10 }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: indexDistrict == index + 1 ? "white" : "#06B050",
            paddingHorizontal: SIZE.width(5),
            paddingVertical: 15,
            borderRadius: 3,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: indexDistrict == index + 1 ? "#06B050" : "white",
          }}
          onPress={() => {
            getItemChoosed(item, index);
          }}
        >
          <Text
            style={[
              styleInApp.hkgpronw3_16,
              {
                color: indexDistrict == index + 1 ? "#06B050" : "white",
              },
            ]}
          >
            {item.cityDto.name} ({item.cityDto.numberStores})
          </Text>
          <AntDesign
            name={indexDistrict == index + 1 ? "up" : "down"}
            size={SIZE.width(4)}
            color={indexDistrict == index + 1 ? "#06B050" : COLOR_WHITE}
          />
        </TouchableOpacity>
        {indexDistrict == index + 1 &&
          item.listDistrictDto.length > 0 &&
          item.listDistrictDto.map((village, i) => (
            <View key={`${i}`}>
              <TouchableOpacity
                style={{
                  marginHorizontal: SIZE.width(2),
                  paddingVertical: 15,
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
                activeOpacity={0.8}
                onPress={() => {
                  getVillagechoosed(village, i);
                  console.log(this.state.liststore, "liststore");
                  this.getListStore(village.id, false);
                }}
              >
                <Text
                  style={[
                    indexVillage == i + 1
                      ? styleInApp.hkgpronw6_16
                      : styleInApp.hkgpronw3_16,
                    {
                      textDecorationLine: "underline",
                      marginLeft: SIZE.width(5),
                    },
                  ]}
                >
                  {village.name} ({village.numberStores})
                </Text>
              </TouchableOpacity>
              {indexVillage == i + 1 &&
                this.state.liststore.length > 0 &&
                this.renderStore()}
            </View>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnDistric: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#06B050",
    paddingHorizontal: SIZE.width(5),
    paddingVertical: 15,
    borderRadius: 3,
  },
});
