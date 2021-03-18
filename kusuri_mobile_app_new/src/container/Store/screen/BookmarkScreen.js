//Library:
import React, { Component } from "react";
import { View, Text, FlatList, RefreshControl, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

//Setup:
import { Api } from "../until/api";
import { STRING } from "../until/string";
import { managerAccount, DEVICE_WIDTH } from "../../../const/System";

//Conponent:
import { Loading } from "../../../commons";
import ItemBookmark from "../item/ItemBookmark";
import ProductScreen from "../screen/ProductScreen";
import ItemModalSelectCity from "../item/ItemModalSelectCity";
import ItemModalSelectDistrict from "../item/ItemModalSelectDistrict";
import ItemModalSelectTimeOpentime from "../item/ItemModalSelectTimeOpentime";
import ItemModalSelectTimeClose from "../item/ItemModalSelectTimeClose";
import { COLOR_BLACK } from "../../../const/Color";
import ButtonTypeOne from "../../../commons/ButtonTypeOne";
import ServicesMaintainStore from "../until/ServicesMaintainStore";

export default class BookmarkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingBookmark: false,
      err: false,
      dataBookmark: [],
      loading: true,
      isLoadingRefresh: false,
      listCatalogs: [],
      isMount: true,
      valueCities: "",
      valueDistricts: "",
      valueTimeOpen: "",
      valueTimeCLose: "",
      textSearch: "",
      pageTag: 1,
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    this.getListStoreBookmarked();
    this.state.isMount = true;
  }

  componentWillUnmount() {
    this.state.isMount = false;
  }

  getListStoreBookmarked = async (loadRefresh) => {
    try {
      const { isLoadingRefresh, loadingBookmark } = this.state;
      if (isLoadingRefresh || loadingBookmark) {
        return;
      }
      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
        });
      }
      this.setState({
        loadingBookmark: true,
      });
      const respones = await Api.getListStoreBookmarked(
        managerAccount.memberCode ? managerAccount.memberCode : ""
      );
      if (respones.code === 200 && respones.res.status.code === 1000) {
        this.state.dataBookmark = respones.res.data;
        this.state.loadingBookmark = false;
        ServicesMaintainStore.set("NOT_MAINTAIN");
      } else if (respones.code == 502) {
        ServicesMaintainStore.set("MAINTAIN_BOOKMARK");
        this.state.err = false;
      } else {
        ServicesMaintainStore.set("ERROR_BOOKMARK");
        this.state.err = true;
      }
    } catch (err) {
      this.state.err = true;
    } finally {
      this.setState({
        isLoadingRefresh: false,
        loadingBookmark: false,
        err: false,
      });
    }
  };

  setListBookMark = async (code) => {
    const { dataBookmark } = this.state;
    for (let i = 0; i < dataBookmark.length; i++) {
      if (dataBookmark[i].code === code) {
        dataBookmark.splice(i, 1);
        i--;
      }
    }
    if (this.state.isMount) {
      this.setState({
        dataBookmark: dataBookmark,
      });
    }
  };
  renderItemBookmark = ({ item, index }) => {
    return (
      <ItemBookmark
        setListBookMark={this.setListBookMark}
        navigation={this.props.navigation}
        onRef={(ref) => {
          this.ItemBookmark = ref;
        }}
        goBookmark={this.gotoSetMapViewBookmrk}
        data={item}
        index={index}
        dataBookmark={this.state.dataBookmark}
      />
    );
  };

  getStoreByCityAndDistrictAndClosedTimeAndTagId = async () => {
    try {
      const { navigation } = this.props;
      const {
        valueTimeOpen,
        valueCities,
        valueDistricts,
        valueTimeCLose,
        textSearch,
        pageTag,
      } = this.state;
      const dataTag = this.ProductScreen.state.dataCheck;
      const initData = {
        valueCities,
        valueTimeCLose,
        valueDistricts,
        dataTag,
        valueTimeOpen,
        pageTag,
        textSearch,
      };
      navigation.navigate("SearchResult", { initData });
    } catch (err) {}
  };

  renderFooter = () => {
    const { dataBookmark } = this.state;
    if (dataBookmark && dataBookmark.length === 0) {
      return null;
    }
    return (
      <View>
        <View>
          <Image
            source={require("../images/cautionSP.png")}
            style={{
              width: DEVICE_WIDTH,
              height: DEVICE_WIDTH / 4,
              marginBottom: 16,
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ItemModalSelectCity
            valueText={(item) => (this.state.valueCities = item)}
            placehoder={STRING.placehoderCity}
          />
          <ItemModalSelectDistrict
            onRef={(ref) => {
              this.District = ref;
            }}
            valueText={(item) => (this.state.valueDistricts = item)}
            placehoder={STRING.placehoderDistrict}
          />
          <ItemModalSelectTimeOpentime
            valueText={(item) => (this.state.valueTimeOpen = item)}
            placehoder={STRING.placehoderOpentime}
          />
          <ItemModalSelectTimeClose
            valueText={(item) => (this.state.valueTimeCLose = item)}
          />
        </View>
        <ProductScreen ref={(ref) => (this.ProductScreen = ref)} />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            marginTop: 16,
            backgroundColor: "#FCE9E8",
          }}
        >
          <View
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                lineHeight: 20,
                justifyContent: "center",
                alignItems: "center",
                color: COLOR_BLACK,
                textAlign: "center",
              }}
            >
              検索条件を選択して「この条件で検索する」ボタンをクリックしてください。
            </Text>
          </View>
          <ButtonTypeOne
            style={{ marginBottom: 15, width: "90%", marginTop: 10 }}
            name="この条件で検索する"
            onPress={this.getStoreByCityAndDistrictAndClosedTimeAndTagId}
          />
        </View>
      </View>
    );
  };

  renderContainer = () => {
    const { dataBookmark, isLoadingRefresh } = this.state;
    return (
      <FlatList
        data={dataBookmark}
        extraData={this.state}
        keyExtractor={(item, index) => `${item.code}${index}`}
        renderItem={this.renderItemBookmark}
        onEndReachedThreshold={0.2}
        ListFooterComponent={this.renderFooter()}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => this.getListStoreBookmarked(true)}
          />
        }
      />
    );
  };
  render() {
    const { loadingBookmark, dataBookmark } = this.state;
    if (loadingBookmark) {
      return <Loading />;
    } else if (!dataBookmark || dataBookmark.length === 0) {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <TouchableOpacity onPress={() => this.getListStoreBookmarked()}>
            <Text style={{ fontSize: 20, fontWeight: "300" }}>
              お気に入り店舗はありません。
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View style={{ marginBottom: 32 }}>{this.renderContainer()}</View>;
    }
  }
}
