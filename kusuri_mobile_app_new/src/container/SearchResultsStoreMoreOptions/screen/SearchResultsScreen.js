import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { menuInApp, DEVICE_WIDTH, managerAccount } from "../../../const/System";
import { Loading, NetworkError } from "../../../commons";
import HeaderIconLeft from "../../../commons/HeaderIconLeft";
import AntDesign from "react-native-vector-icons/AntDesign";
import { APP_COLOR, COLOR_RED, COLOR_WHITE } from "../../../const/Color";
import ButtonTypeOne from "../../../commons/ButtonTypeOne";
import { Api } from "../until/api";
import InputSearch from "../item/InputSearch";
import ItemModalSelectCity from "../item/ItemModalSelectCity";
import ItemModalSelectDistrict from "../item/ItemModalSelectDistrict";
import ItemModalSelectOpentime from "../item/ItemModalSelectOpentime";
import ItemModalSelectClose from "../item/ItemModalSelectClose";
import { ServiceCheckTrueandFlaseCheckBox } from "../until/service";
import ItemListSearchResults from "../item/ItemListSearchResults";
import { setNameCheck } from "../../SearchResultsStoreNameAddress/until/service";
import { CheckBoxNameService, CheckBoxSearchService } from "../until/service";
import ProductScreen from "../screen/ProductScreen";
import { STRING } from "../until/string";
import MaintainView from "../../../commons/MaintainView";
export default class SearchResultsScreen extends Component {
  constructor(props) {
    super(props);
    const { initData } = this.props.navigation.state.params;
    const valueDropDown = CheckBoxNameService.get();
    const dataTagStore = CheckBoxSearchService.get();

    this.state = {
      textSearchInput: initData.textSearch,
      dataTagCheck: initData.dataTag,
      valueCities: initData.valueCities,
      valueDistricts: initData.valueDistricts,
      valueTimOpen: initData.valueTimeOpen,
      valueTimClose: initData.valueTimeCLose,
      dataSearchResult: [],
      totalPages: 0,
      totalElements: 0,
      errNetworkTagId: false,
      numberPage: 1,
      page: 1,
      loadingSeacrh: false,
      errNetWork: false,
      // isLoadingTag: false,
      numberPageOne: 1,
      numberPageTwo: 10,
      dataListName: [],
      dataListValueDropDown: valueDropDown,
      checkName: false,
      loadingList: true,
      isMaintain: false,
    };
  }

  componentDidMount() {
    this.onDidMount();
  }
  onDidMount = () => {
    const { onRef } = this.props;
    onRef && onRef(this);
    CheckBoxNameService.onChange("drop", (data) => {
      this.setState({
        dataListValueDropDown: data,
      });
    });
    ServiceCheckTrueandFlaseCheckBox.onChange("checknamebox", (data) => {
      if (data.data.type === "checkedDelete") {
        if (data.data.id && !data.data.click) {
          this.state.dataTagCheck.push(data.data.id);
          this.state.dataListName.push(data.data.name);
          this.setState({
            dataTagCheck: this.state.dataTagCheck,
            dataListName: this.state.dataListName,
          });
        }
        if (data.data.id && data.data.click) {
          for (let i = 0; i < this.state.dataTagCheck.length; i++) {
            if (this.state.dataTagCheck[i] === data.data.id) {
              this.state.dataTagCheck.splice(i, 1);
            }
          }
          const index = this.state.dataListName.indexOf(data.data.name);
          if (index !== -1) {
            this.state.dataListName.splice(index, 1);
          }
          this.setState({
            dataTagCheck: this.state.dataTagCheck,
            dataListName: this.state.dataListName,
          });
        }
      }
      if (data.data.type === "SetNameCheckBox") {
        if (this.state.checkName) return;
        this.state.dataListName.push(data.data.name);
        this.setState({
          dataListName: this.state.dataListName,
        });
      }
    });
    this.getStoreByCityAndDistrictAndClosedTimeAndTagId();
  };
  componentWillUnmount() {
    ServiceCheckTrueandFlaseCheckBox.unChange("checknamebox");
    CheckBoxNameService.unChange("drop");
  }

  getStoreByCityAndDistrictAndClosedTimeAndTagId = async (refresh) => {
    try {
      this.setState({
        loadingSeacrh: true,
      });
      const {
        valueCities,
        valueTimClose,
        valueTimOpen,
        valueDistricts,
        dataTagCheck,
        page,
        textSearchInput,
      } = this.state;
      console.log("data store", dataTagCheck);

      let uniqueArray = Array.from(new Set(dataTagCheck));
      const respones = await Api.getStoreByCityAndDistrictAndClosedTimeAndTagId(
        valueCities,
        valueTimClose,
        valueDistricts,
        uniqueArray,
        managerAccount.memberCode ? managerAccount.memberCode : "",
        valueTimOpen,
        page,
        textSearchInput,
        10
      );
      console.log(respones, "response");
      if (respones.code === 502) {
        this.setState({
          isMaintain: true,
        });
        return;
      }
      if (respones.code === 200 && respones.res.status.code === 1000) {
        this.state.dataSearchResult = respones.res.data.content;
        this.state.totalPages = respones.res.data.totalPages;
        this.state.totalElements = respones.res.data.totalElements;
        this.state.loadingSeacrh = false;
        this.state.errNetWork = false;
        this.state.isMaintain = false;
      }
    } catch (err) {
      this.state.errNetWork = true;
      this.state.isMaintain = false;
    } finally {
      this.setState(
        {
          // isLoadingTag: false,
          loadingSeacrh: false,
        },
        () => this.gotoScrollTop()
      );
    }
  };

  gotoScrollTop = () => {
    if (this.search) {
      this.search.scrollTo({ x: 0, y: 250, animated: true });
    }
  };

  onPressPage = (page, index) => {
    this.setState(
      {
        page: page,
        numberPage: page,
        numberPageOne: page * 10 + 1 - 10,
        numberPageTwo: page * 10,
      },
      () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
    );
  };

  renderPageIndex = () => {
    const dataPage = [];
    const { numberPage, totalPages, totalElements } = this.state;
    if (totalElements < 10) {
      for (let i = 1; i <= 1; i++) {
        dataPage.push(i);
      }
    } else if (numberPage === 1 && numberPage === totalPages) {
      for (let i = 1; i <= numberPage; i++) {
        dataPage.push(i);
      }
    } else if (totalPages < 3) {
      for (let i = 1; i <= totalPages; i++) {
        dataPage.push(i);
      }
    } else if (numberPage === totalPages) {
      for (let i = totalPages - 2; i < totalPages + 1; i++) {
        dataPage.push(i);
      }
    } else if (numberPage < totalPages && numberPage < 3) {
      for (let i = 1; i < 4; i++) {
        dataPage.push(i);
      }
    } else {
      for (let i = numberPage - 1; i < numberPage + 2; i++) {
        if (numberPage < totalPages) dataPage.push(i);
      }
    }

    return dataPage.map((page, index) => {
      let backgroundColor = "#F19B9F";
      if (
        index === index &&
        this.state.numberPage === this.state.numberPage &&
        this.state.numberPage === page
      ) {
        backgroundColor = APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
      }
      if (this.state.numberPage === page) {
        backgroundColor = APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
      }
      return (
        <TouchableOpacity
          style={{
            width: 25,
            height: 25,
            borderRadius: 25 / 2,
            alignItems: "center",
            borderWidth: 0.5,
            margin: 4,
            marginTop: 7,
            borderColor: "#F19B9F",
            backgroundColor: backgroundColor ? backgroundColor : "#F19B9F",
            justifyContent: "center",
          }}
          onPress={() => this.onPressPage(page, index)}
          key={index}
        >
          <Text style={{ color: COLOR_WHITE }}>{page}</Text>
        </TouchableOpacity>
      );
    });
  };

  setDataMapStore = () => {
    const { numberPage, totalPages, page } = this.state;
    if (numberPage < totalPages) {
      this.setState(
        {
          page: page + 1,
          numberPage: numberPage + 1,
          numberPageOne: (numberPage + 1) * 10 + 1 - 10,
          numberPageTwo: (numberPage + 1) * 10,
        },
        () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
      );
    }
  };
  setDataMapStorePre = () => {
    const { numberPage, totalPages, page } = this.state;
    if (numberPage < totalPages || numberPage === totalPages) {
      this.setState(
        {
          page: page - 1,
          numberPage: numberPage - 1,
          numberPageOne: (numberPage + 1) * 10 + 1 - 10,
          numberPageTwo: (numberPage + 1) * 10,
        },
        () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
      );
    }
  };

  renderImtemList = ({ item, index }) => {
    const { navigation } = this.props;
    const { dataSearchResult } = this.state;
    return (
      <ItemListSearchResults
        data={item}
        index={index}
        navigation={navigation}
        dataMarker={dataSearchResult}
      />
    );
  };

  showTitemCheckBox = () => {
    const { dataTagHome } = this.state;
    return <ItemListCheckBox dataTagHome={dataTagHome} />;
  };

  showListSelectCityDistrict = () => {
    return (
      <View
        style={{ justifyContent: "center", alignItems: "center", marginTop: 5 }}
      >
        <ItemModalSelectCity
          valueText={(item) => (this.state.valueCities = item)}
        />
        <ItemModalSelectDistrict
          valueText={(item) => {
            this.state.valueDistricts = item;
          }}
        />
        <ItemModalSelectOpentime
          valueText={(item) => {
            this.state.valueTimOpen = item;
          }}
        />
        <ItemModalSelectClose
          valueText={(item) => {
            this.state.valueTimClose = item;
          }}
        />
      </View>
    );
  };

  showName = () => {
    const { dataListName, dataListValueDropDown } = this.state;
    const paddingVertical =
      (dataListValueDropDown &&
        dataListValueDropDown.city.name === STRING.placehoderCity) ||
      (!dataListValueDropDown.city && dataListValueDropDown.district === "") ||
      (!dataListValueDropDown.district &&
        dataListValueDropDown.startTime === STRING.placehoderOpentime) ||
      (!dataListValueDropDown.startTime &&
        dataListValueDropDown.closeTime === STRING.placehoderClosetime) ||
      !dataListValueDropDown.closeTime
        ? 5
        : 0;
    if (dataListName) {
      const listNameCheckBox = dataListName.map((item, index) => {
        return (
          <Text
            style={{
              fontSize: 14,
              justifyContent: "center",
              // paddingVertical
            }}
            key={`${index}`}
          >
            {item} {this.showGachTwo(index)}
          </Text>
        );
      });
      return (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {listNameCheckBox}
        </View>
      );
    }
  };
  showGachTwo = (index) => {
    const { dataListName } = this.state;
    return <Text>{index === dataListName.length - 1 ? "" : "/"}</Text>;
  };
  showValue = () => {
    const { dataListValueDropDown, dataListName } = this.state;
    if (dataListValueDropDown) {
      if (
        !dataListValueDropDown.city.name &&
        !dataListValueDropDown.district.name &&
        !dataListValueDropDown.startTime.name &&
        !dataListValueDropDown.closeTime.name
      ) {
        return null;
      }
      return (
        <View
          style={{
            flexDirection: "row",
            // flex: 1,
            marginHorizontal: 5,
            justifyContent: "center",
            // paddingTop: dataListName && dataListName.length > 0 ? 5 : 0,
            // paddingBottom: dataListName && dataListName.length > 0 ? 5 : 0,
            // marginTop: dataListName && dataListName.length === 0 ? 5 : 0,
            // marginBottom: dataListName && dataListName.length === 0 ? 10 : 0
          }}
        >
          <Text style={{ fontSize: 14, flex: 1 }}>
            {!dataListValueDropDown.city.name ||
            dataListValueDropDown.city.name === STRING.placehoderCity
              ? ""
              : `${dataListValueDropDown.city.name}${"/"}`}
            {!dataListValueDropDown.district.name ||
            dataListValueDropDown.district.name === STRING.placehoderDistrict
              ? ""
              : `${dataListValueDropDown.district.name}${"/"}`}
            {!dataListValueDropDown.startTime.name ||
            dataListValueDropDown.startTime.name === STRING.placehoderOpentime
              ? ""
              : `${dataListValueDropDown.startTime.name}${"/"}`}
            {!dataListValueDropDown.closeTime.name ||
            dataListValueDropDown.closeTime.name === STRING.placehoderClosetime
              ? ""
              : dataListValueDropDown.closeTime.name}
          </Text>
        </View>
      );
    }
  };
  renderFooter = () => {
    const {
      totalPages,
      errNetWork,
      textSearchInput,
      dataSearchResult,
      totalElements,
      loadingSeacrh,
      errNetworkTagId,
      numberPage,
      dataListValueDropDown,
    } = this.state;
    return (
      <View style={{ marginBottom: 60 }}>
        {loadingSeacrh ? null : (
          <View style={{ marginTop: 32, marginBottom: 16 }}>
            {totalPages === 0 ||
            errNetworkTagId ||
            errNetWork ||
            dataSearchResult.length === 0 ? null : (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  disabled={
                    totalElements === 1 ||
                    totalElements < 10 ||
                    numberPage === 1
                      ? true
                      : false
                  }
                  style={{
                    height: 40,
                    width: 90,
                    borderColor: COLOR_RED,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    left: 16,
                    backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                  }}
                  onPress={this.setDataMapStorePre}
                >
                  <View style={{ marginLeft: 0 }}>
                    <AntDesign name="left" size={15} color={COLOR_WHITE} />
                  </View>
                  <Text
                    style={{
                      color: COLOR_WHITE,
                      fontSize: 10,
                      right: 3,
                      fontWeight: "bold",
                    }}
                  >
                    前のページへ
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  {this.renderPageIndex()}
                </View>

                <TouchableOpacity
                  disabled={
                    totalElements === 1 ||
                    totalElements < 10 ||
                    numberPage === totalPages
                      ? true
                      : false
                  }
                  style={{
                    height: 40,
                    width: 90,
                    borderColor: COLOR_RED,
                    justifyContent: "center",
                    flexDirection: "row",
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: "center",
                    right: 16,
                    alignItems: "center",
                    backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                  }}
                  onPress={this.setDataMapStore}
                >
                  <Text
                    style={{
                      color: COLOR_WHITE,
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    次のページへ
                  </Text>
                  <View>
                    <AntDesign name="right" size={15} color={COLOR_WHITE} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {/* {loadingSeacrh ? null : ( */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <Image
              source={require("../images/cautionSP.png")}
              style={{ width: DEVICE_WIDTH, height: DEVICE_WIDTH / 4 }}
              resizeMode="contain"
            />
          </View>
          <View
            style={{ borderWidth: 1, borderColor: "#A3A4A5", width: "92%" }}
          >
            <View style={styles.containerVertical}>
              <View style={styles.vertical} />
              <View>
                <Text style={styles.textSearch}>検索結果</Text>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 16,
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <Text style={styles.textSearch1}>
                検索結果
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                  {" "}
                  {totalElements}
                  <Text style={{ fontSize: 25, fontWeight: "normal" }}>件</Text>
                </Text>{" "}
                に該当しました。
              </Text>
            </View>

            <View style={styles.containerVertical}>
              <View style={styles.vertical} />
              <View>
                <Text style={styles.textSearch}>現在の検索条件</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <View
                style={{
                  felx: 1,
                  borderWidth: 1,
                  width: "92%",
                  marginTop: 5,
                  borderColor: "#A3A4A5",
                  minHeight: 40,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    marginHorizontal: 5,
                    // marginVertical: 5,
                    justifyContent: "center",
                  }}
                >
                  {this.showName()}
                </View>
                {/* {(dataListValueDropDown &&
                  dataListValueDropDown.city.name === STRING.placehoderCity) ||
                (!dataListValueDropDown.city &&
                  dataListValueDropDown.district === "") ||
                (!dataListValueDropDown.district &&
                  dataListValueDropDown.startTime ===
                    STRING.placehoderOpentime) ||
                (!dataListValueDropDown.startTime &&
                  dataListValueDropDown.closeTime ===
                    STRING.placehoderClosetime) ||
                !dataListValueDropDown.closeTime ? (
                  undefined
                ) : ( */}
                <View>{this.showValue()}</View>
                {/* )} */}
              </View>
            </View>
            <View style={styles.containerVertical}>
              <View style={styles.vertical} />
              <View>
                <Text style={styles.textSearch}>キーワード検索</Text>
              </View>
            </View>

            <InputSearch
              placeholder={textSearchInput}
              changeDataValue={(item) => (this.state.textSearchInput = item)}
            />

            <View style={styles.containerVertical}>
              <View style={styles.vertical} />
              <View>
                <Text style={styles.textSearch}>検索条件を変更</Text>
              </View>
            </View>
            <View>{this.showListSelectCityDistrict()}</View>
            <Text style={{ marginHorizontal: 16, marginTop: 16 }}>
              取扱い商品を絞り込む
            </Text>
            <View
              style={{
                marginTop: 16,
                justifyContent: "center",
              }}
            >
              <ProductScreen />
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ButtonTypeOne
                name="検索条件を変更"
                loading={loadingSeacrh}
                style={{ width: "85%" }}
                loading={loadingSeacrh}
                onPress={this.callApiSearch}
              />
            </View>
          </View>
        </View>
        {/* )} */}
      </View>
    );
  };

  callApiSearch = () => {
    this.setState(
      {
        numberPage: 1,
        page: 1,
        numberPage: 1,
        numberPageOne: 1,
      },
      () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
    );
  };

  checkPageNumber = () => {
    const { numberPage, totalElements } = this.state;
    if (totalElements < 10) {
      return totalElements;
    } else if (totalElements < 10 * numberPage) {
      return totalElements;
    } else {
      return 10 * numberPage;
    }
  };

  renderHeader = () => {
    const {
      totalPages,
      errNetworkTagId,
      errNetWork,
      numberPageOne,
      totalElements,
      dataSearchResult,
      numberPage,
    } = this.state;
    return (
      <View>
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

        {totalPages === 0 ||
        errNetworkTagId ||
        errNetWork ||
        dataSearchResult.length === 0 ? null : (
          <View
            style={{
              marginHorizontal: 16,
              borderColor: "#A3A4A5",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              width: DEVICE_WIDTH / 2 + 100,
              marginTop: 16,
              borderRadius: 2,
            }}
          >
            <Text
              style={{ marginVertical: 5, fontSize: 16, fontWeight: "500" }}
            >
              {totalElements}件中{numberPageOne}~{this.checkPageNumber()}
              件を表示しています
            </Text>
          </View>
        )}
        <View style={{ marginTop: 16 }}>
          {totalPages === 0 ||
          errNetworkTagId ||
          errNetWork ||
          dataSearchResult.length === 0 ? null : (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                disabled={
                  totalElements === 1 || totalElements < 10 || numberPage === 1
                    ? true
                    : false
                }
                style={{
                  height: 40,
                  width: 90,
                  borderColor: COLOR_RED,
                  flexDirection: "row",
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  left: 16,
                  backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                }}
                onPress={this.setDataMapStorePre}
              >
                <View style={{ marginLeft: 0 }}>
                  <AntDesign name="left" size={15} color={COLOR_WHITE} />
                </View>
                <Text
                  style={{
                    color: COLOR_WHITE,
                    fontSize: 10,
                    right: 3,
                    fontWeight: "bold",
                  }}
                >
                  前のページへ
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row" }}>
                {this.renderPageIndex()}
              </View>

              <TouchableOpacity
                disabled={
                  totalElements === 1 ||
                  totalElements < 10 ||
                  numberPage === totalPages
                    ? true
                    : false
                }
                style={{
                  height: 40,
                  width: 90,
                  borderColor: COLOR_RED,
                  justifyContent: "center",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: "center",
                  right: 16,
                  alignItems: "center",
                  backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                }}
                onPress={this.setDataMapStore}
              >
                <Text
                  style={{
                    color: COLOR_WHITE,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  次のページへ
                </Text>
                <View>
                  <AntDesign name="right" size={15} color={COLOR_WHITE} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  renderContainer = () => {
    const { dataSearchResult, errNetWork, loadingSeacrh } = this.state;
    if (loadingSeacrh) {
      return <Loading />;
    }
    if (errNetWork) {
      return (
        <NetworkError
          onPress={() => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()}
        />
      );
    }
    if (dataSearchResult) {
      if (dataSearchResult.length === 0) {
        return (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>
              データがありません
            </Text>
          </View>
        );
      }
    }
    return (
      <FlatList
        data={dataSearchResult}
        extraData={this.state}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderImtemList}
        onEndReachedThreshold={0.8}
      />
    );
  };

  refreshingPage = () => {
    this.setState(
      {
        numberPage: 1,
        page: 1,
        numberPageOne: 1,
        checkName: true,
      },
      () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId(true)
    );
  };

  checkName = () => {
    this.setState(
      {
        checkName: false,
      },
      () => setNameCheck.set({ type: "setplacehoder" }),
      setNameCheck.set({ type: "opentime" }),
      setNameCheck.set({ type: "closetime" }),
      setNameCheck.set({ type: "district" })
    );
  };

  showLoading = () => {
    const { loadingList, errNetWork } = this.state;

    if (loadingList) {
      if (this.timeoutLoading) {
        clearTimeout(this.timeoutLoading);
      }
      this.timeoutLoading = setTimeout(() => {
        this.setState({ loadingList: false });
      }, 1500);
      return <Loading />;
    }
    if (errNetWork) {
      return (
        <NetworkError
          onPress={() => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()}
        />
      );
    }
    return (
      <ScrollView
        ref={(ref) => {
          this.search = ref;
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.refreshingPage} />
        }
      >
        {this.renderHeader()}
        {this.renderContainer()}
        {this.renderFooter()}
      </ScrollView>
    );
  };
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return <MaintainView onPress={this.onDidMount} timeOut={10000} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <HeaderIconLeft
          checkName={this.checkName}
          title={menuInApp.namePushNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconPushNotification}
        />
        {this.showLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    flex: 1,
    height: DEVICE_WIDTH,
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16),
  },
  vertical: {
    height: 30,
    width: 3,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  textSearch1: {
    paddingLeft: 5,
    fontSize: 18,
  },
  textAdress: {
    fontSize: 25,
    fontWeight: "bold",
  },
  containerTextAdress: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  containerBottomInput: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  textBottomInput: {
    fontWeight: "bold",
    lineHeight: 20,
  },
  underLine: {
    width: 50,
    height: 2,
  },
  modalStyle: {
    alignItems: "center",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
