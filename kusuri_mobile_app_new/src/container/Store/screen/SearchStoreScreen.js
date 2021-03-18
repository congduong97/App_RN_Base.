//Library:
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//Setup:
import { DEVICE_WIDTH } from "../../../const/System";
import {
  APP_COLOR,
  COLOR_RED,
  COLOR_WHITE,
  COLOR_BLACK,
  COLOR_PINK_LIGHT,
} from "../../../const/Color";

import ItemSearchButton from "../item/ItemSearchButton";
import { Loading } from "../../../commons";
import { STRING } from "../until/string";
import { Api } from "../until/api";

//Component:
import StoreMap from "./StoreMap";
import InputSearch from "../item/InputSearch";
import { HeightLayout } from "../until/HeightLayout";
import ListStoreScreen from "../screen/ListStoreScreen";
import ButtonTypeOne from "../../../commons/ButtonTypeOne";
import ItemModalSelectCity from "../item/ItemModalSelectCity";
import ProductScreen from "../../Store/screen/ProductScreen";
import ItemModalSelectDistrict from "../item/ItemModalSelectDistrict";
import ItemModalSelectTimeOpentime from "../item/ItemModalSelectTimeOpentime";
import ItemModalSelectTimeClose from "../item/ItemModalSelectTimeClose";
import ServicesMaintainStore from "../until/ServicesMaintainStore";

export default class SearchStoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSearch: "",
      valueCities: "",
      valueDistricts: "",
      valueTimeOpen: "",
      valueTimeCLose: "",
      loadingListItem: true,
      checkHasCatalog: { hasStoreCatalog: false, idCatalogTag: null },
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    this.checkHasCatalog();
  }

  componentWillUnmount() {
    if (this.timeoutLoading) {
      clearTimeout(this.timeoutLoading);
    }
  }
  checkHasCatalog = async () => {
    const res = await Api.checkHasCatalog();
    if (res && res.code == 200) {
      this.setState({
        loadingListItem: false,
        checkHasCatalog: { ...res.res.data },
      });
      ServicesMaintainStore.set("NOT_MAINTAIN");
    } else if (res && res.code == 502) {
      ServicesMaintainStore.set("MAINTAIN_STORE");
      this.setState({ loadingListItem: false });
    } else {
      ServicesMaintainStore.set("ERROR_STORE");
      this.setState({ loadingListItem: false });
    }
  };
  // search store by name store
  goToScreenSearchStoreName = async () => {
    const { textSearch } = this.state;
    const { navigation } = this.props;
    const initData = { textSearch };
    navigation.navigate("SearchResultStoreName", { initData });
  };

  // search store equal more options
  goToScreenSearchStoreMoreOptions = async () => {
    const { navigation } = this.props;
    const {
      valueTimeOpen,
      valueCities,
      valueDistricts,
      valueTimeCLose,
      textSearch,
    } = this.state;
    const dataTag = this.ProductScreen.state.dataCheck;

    const initData = {
      valueCities,
      valueTimeCLose,
      valueDistricts,
      dataTag,
      valueTimeOpen,
      textSearch,
    };
    navigation.navigate("SearchResult", { initData });
  };

  goToScreenSearchStoreWithCatalog = async () => {
    const { navigation } = this.props;
    const {
      valueTimeOpen,
      valueCities,
      valueDistricts,
      valueTimeCLose,
      textSearch,
    } = this.state;
    const dataTag = [this.state.checkHasCatalog.idCatalogTag];

    const initData = {
      valueCities,
      valueTimeCLose,
      valueDistricts,
      dataTag,
      valueTimeOpen,
      textSearch,
    };
    navigation.navigate("SearchResult", { initData });
  };

  // Go to search with many options
  gotoSeachMoreOptions = () => {
    this.search.scrollTo({
      x: 0,
      y: HeightLayout.heighOneProduct + HeightLayout.heightMaps,
      animated: true,
    });
  };

  // Go to search by name
  gotoSeachTextInput = async () => {
    await this.search.scrollTo({
      x: 0,
      y:
        HeightLayout.heighOneProduct +
        HeightLayout.heightMaps +
        HeightLayout.heightListStore,
      animated: true,
    });
  };
  // Go to search by map
  gotoSearchMap = () => {
    this.search.scrollTo({
      x: 0,
      y: HeightLayout.heighOneProduct,
      animated: true,
    });
  };

  //  Layout of map
  onLayOutMapHeight = (e) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = e;
    HeightLayout.heightMaps = height;
  };
  // Layout text Input
  onLayOutTextInputSearch = (e) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = e;
    HeightLayout.heightListStore = height;
  };
  // LayOut three button
  onLayThreeButtonSelectionSearch = (e) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = e;
    HeightLayout.heighOneProduct = height;
  };
  // Show list near store
  showListNearStore = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ListStoreScreen
          navigation={this.props.navigation}
          onRef={(ref) => {
            this.ListStoreScreen = ref;
          }}
        />
      </View>
    );
  };
  // refresh load list near store
  refreshLoadListStoreNear = () => {
    this.StoreMapCheck.getsearchStoreNearestMap(true);
    this.ProductScreen.getListTag();
  };

  // show all list item store
  showListItemStore = () => {
    const { loadingListItem } = this.state;
    if (loadingListItem) {
      return <Loading />;
    }

    return (
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        style={{ marginBottom: 0 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.refreshLoadListStoreNear}
          />
        }
        innerRef={(ref) => (this.search = ref)}
      >
        <View style={styles.container}>
          <View onLayout={this.onLayThreeButtonSelectionSearch}>
            <Image
              source={require("../images/store.png")}
              style={styles.imageFeature}
            />
            <View style={styles.containerVertical}>
              <View style={styles.vertical} />
              <View>
                <Text style={styles.textSearch}>店舗検索</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              {this.state.checkHasCatalog.hasStoreCatalog ? (
                <ItemSearchButton
                  gotoSearch={this.goToScreenSearchStoreWithCatalog}
                  map={STRING.btnSearchCatalog}
                  hideIcon={true}
                  style={{ paddingVertical: 16 }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: COLOR_PINK_LIGHT,
                    padding: 16,
                    width: "94%",
                  }}
                >
                  <Text style={{ fontSize: 16, color: COLOR_RED }}>
                    {STRING.noCatalogtext}
                  </Text>
                </View>
              )}
              <ItemSearchButton
                gotoSearch={this.gotoSearchMap}
                map={STRING.btnSearch}
                style={{ marginTop: 10 }}
              />
              <ItemSearchButton
                gotoSearch={this.gotoSeachMoreOptions}
                map={STRING.btnProduct}
                style={{ marginTop: 10 }}
              />
              <ItemSearchButton
                gotoSearch={this.gotoSeachTextInput}
                map={STRING.btnAddress}
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
          <View onLayout={this.onLayOutMapHeight}>
            <View
              style={styles.containerTextAdress}
              onLayout={this.StoreNearTitle}
            >
              <Text style={styles.textAdress}>近くのアオキを探す</Text>
              <View
                style={[
                  styles.underLine,
                  {
                    backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                    borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                  },
                ]}
              />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <StoreMap
                navigation={this.props.navigation}
                onRef={(ref) => {
                  this.StoreMapCheck = ref;
                }}
              />
              <View
                style={{
                  borderWidth: 1,
                  width: "94%",
                  marginTop: 20,
                  padding: 5,
                  backgroundColor: COLOR_WHITE,
                  borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                }}
              >
                <Text
                  style={{
                    color: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                    lineHeight: 20,
                    fontSize: 13,
                  }}
                >
                  位置情報を許可いただかないとマップ表示されません。
                </Text>
                <Text
                  style={{
                    color: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                    lineHeight: 20,
                    fontSize: 13,
                  }}
                >
                  ★お気に入りをクリックすると上部、お気に入りタブに最大5店舗ご登録できます。
                </Text>
              </View>
            </View>
            {this.showListNearStore()}
          </View>
          <View onLayout={this.onLayOutTextInputSearch}>
            <View style={styles.containerTextAdress}>
              <Text style={styles.textAdress}>エリア・取扱商品で探す</Text>
              <View
                style={{
                  width: 50,
                  height: 2,
                  backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                  borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                }}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  ご注意下さい
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 16,
                marginTop: 16,
              }}
            >
              <Text style={{ lineHeight: 20 }}>
                要指導医薬品、第一類医薬品は、調剤薬局にて販売しておりま
                す。(クスリのアオキ新鮮館灯明寺薬局を除く) 販売時間は
                調剤薬局営業時間でご確認ください。
                ※処方せんの受付時間については、各店詳細画面でご確認ください
              </Text>
            </View>
            <ImageBackground
              source={require("../images/background1.png")}
              style={{
                height: DEVICE_WIDTH * 1.21,
                width: DEVICE_WIDTH,
                marginTop: 16,
                justifyContent: "center",
              }}
              resizeMode="cover"
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
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
                  onPress={this.goToScreenSearchStoreMoreOptions}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    color: COLOR_BLACK,
                    textAlign: "center",
                    fontSize: DEVICE_WIDTH * 0.07,
                    width: DEVICE_WIDTH,
                  }}
                >
                  取扱い商品をお選びください
                </Text>
              </View>
            </ImageBackground>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProductScreen ref={(ref) => (this.ProductScreen = ref)} />
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>
        <View style={styles.containerTextAdress1}>
          <Text style={styles.textAdress}>店舗名・住所で探す</Text>
          <View
            style={{
              width: 50,
              height: 2,
              backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
            }}
          />
        </View>
        <InputSearch
          submit={this.goToScreenSearchStoreName}
          changeDataValue={(item) => (this.state.textSearch = item)}
          ref={(ref) => (this.textinput = ref)}
        />
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
              検索条件を選択して「この条件で検索する」ボタンを
              クリックしてください。
            </Text>
          </View>
          <ButtonTypeOne
            style={{ marginBottom: 15, width: "90%", marginTop: 10 }}
            name="この条件で検索する"
            onPress={this.goToScreenSearchStoreMoreOptions}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };
  render() {
    return <View>{this.showListItemStore()}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16),
  },
  vertical: {
    height: 30,
    width: 5,
    backgroundColor: COLOR_RED,
    borderWidth: 1,
    borderColor: COLOR_RED,
    marginLeft: 16,
  },
  containerVertical: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  textSearch: {
    paddingLeft: 5,
    fontWeight: "bold",
  },
  textAdress: {
    fontSize: 25,
    fontWeight: "bold",
  },
  containerTextAdress: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  containerTextAdress1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  underLine: {
    width: 50,
    height: 2,
  },
});
