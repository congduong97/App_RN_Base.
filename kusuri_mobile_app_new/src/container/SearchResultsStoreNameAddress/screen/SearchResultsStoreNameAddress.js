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
import { STRING } from "../until/string";
import { APP_COLOR, COLOR_RED, COLOR_WHITE } from "../../../const/Color";
import ButtonTypeOne from "../../../commons/ButtonTypeOne";
import { Api } from "../until/api";
import ItemModalSelectCity from "../item/ItemModalSelectCity";
import ItemModalSelectDistrict from "../item/ItemModalSelectDistrict";
import ItemModalSelectOpentime from "../item/ItemModalSelectOpentime";
import InputSearch from "../item/InputSearch";
import ItemModalSelectClose from "../item/ItemModalSelectClose";
import ItemListSearchResults from "../item/ItemListSearchResults";
import { setNameCheck } from "../until/service";
import ProductScreen from "./ProductScreen";
import { ServiceCheckTrueandFlaseCheckBox } from "../../SearchResultsStoreMoreOptions/until/service";
import {
  setValueCheckBox,
  CheckBoxNameService,
} from "../../SearchResultsStoreMoreOptions/until/service";

export default class SearchResultsStoreNameAddress extends Component {
  constructor(props) {
    super(props);
    const { initData } = this.props.navigation.state.params;
    this.state = {
      dataSearchResult: [],
      totalElements: 0,
      totalPages: 0,
      textSearchInput: initData.textSearch,
      dataTagHome: [],
      isLoadingRefreshStoreResult: false,
      valueTimClose: "",
      valueTimOpen: "",
      valueCities: "",
      valueDistricts: "",
      numberPage: 1,
      dataCheckBox: [],
      loadingAddData: false,
      page: 1,
      listq: [],
      numberPageOne: 1,
      numberPageTwo: 10,
      errNetWorkAddData: false,
      dataListName: [],
      dataListValueDropDown: "",
      checkName: false,
      loadingSearchMoreOptions: true,
      clickButton: false,
      loadingByName: false,
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    const { clickButton } = this.state;
    onRef && onRef(this);
    setValueCheckBox.onChange("checkbox", (data) => {
      this.state.dataCheckBox = data;
    });
    CheckBoxNameService.onChange("dropValue", (data) => {
      this.setState({
        dataListValueDropDown: data,
      });
    });

    ServiceCheckTrueandFlaseCheckBox.onChange("checknamebox", (data) => {
      if (data.data.type === "checkedDelete") {
        if (data.data.id && !data.data.click) {
          this.state.dataListName.push(data.data.name);
          this.state.listq.push(data.data.id);
          this.setState({
            listq: this.state.listq,
            dataListName: this.state.dataListName,
          });
          return;
        }
        if (data.data.id && data.data.click) {
          const index = this.state.dataListName.indexOf(data.data.name);
          if (index !== -1) {
            this.state.dataListName.splice(index, 1);
          }
          for (let i = 0; i < this.state.listq.length; i++) {
            if (this.state.listq[i] === data.data.id) {
              this.state.listq.splice(i, 1);
            }
          }
          this.setState({
            listq: this.state.listq,
            dataListName: this.state.dataListName,
          });
        }
      }
    });
    if (!clickButton) {
      this.getSotrebyAdrees();
    }
  }
  componentWillUnmount() {
    ServiceCheckTrueandFlaseCheckBox.unChange("checknamebox");
    setValueCheckBox.unChange("checkbox");
    CheckBoxNameService.unChange("dropValue");
  }

  getSotrebyAdrees = async () => {
    try {
      this.setState({
        loadingByName: true,
      });
      const { textSearchInput, page } = this.state;
      const response = await Api.getStoreByNameOrAddress(
        managerAccount.memberCode ? managerAccount.memberCode : "",
        page,
        textSearchInput,
        10
      );
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.dataSearchResult = response.res.data.content;
        this.state.totalPages = response.res.data.totalPages;
        this.state.totalElements = response.res.data.totalElements;
        this.state.loadingByName = false;
        this.state.errNetWorkAddData = false;
      }
    } catch (err) {
      this.state.errNetWorkAddData = true;
    } finally {
      await this.setState({
        loadingByName: false,
      });
      if (!this.state.errNetWorkAddData) {
        this.gotoTop();
      }
    }
  };

  getStoreByCityAndDistrictAndClosedTimeAndTagId = async () => {
    try {
      this.setState({
        loadingAddData: true,
        clickButton: true,
      });
      const {
        valueCities,
        valueTimClose,
        valueTimOpen,
        valueDistricts,
        listq,
        page,
        textSearchInput,
      } = this.state;
      let uniqueArray = Array.from(new Set(listq));
      // console.log("valueCities", valueCities);
      // console.log("valueTimClose", valueTimClose);
      // console.log("valueTimOpen", valueTimOpen);
      // console.log("valueDistricts", valueDistricts);
      // console.log("dataTagCheck", uniqueArray);
      // console.log("textSearchInput", textSearchInput);
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
      // console.log("getStoreByCityAndDistrictAndClosedTimeAndTagId", respones);
      if (respones.code === 200 && respones.res.status.code === 1000) {
        this.state.dataSearchResult = respones.res.data.content;
        this.state.totalPages = respones.res.data.totalPages;
        this.state.totalElements = respones.res.data.totalElements;
        this.state.loadingAddData = false;
        this.state.errNetWorkAddData = false;
      }
    } catch (err) {
      this.state.errNetWorkAddData = true;
    } finally {
      await this.setState({
        loadingAddData: false,
      });
      if (!this.state.errNetWorkAddData) {
        this.gotoTop();
      }
    }
  };

  onPressPage = (page, index) => {
    const { clickButton } = this.state;
    if (!clickButton) {
      this.setState(
        {
          page: page,
          numberPage: page,
          numberPageOne: page * 10 + 1 - 10,
          numberPageTwo: page * 10,
        },
        () => this.getSotrebyAdrees()
      );
    }
    if (clickButton) {
      this.setState(
        {
          page: page,
          numberPage: page,
          numberPageOne: page * 10 + 1 - 10,
          numberPageTwo: page * 10,
        },
        () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
      );
    }
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
    const { numberPage, totalPages, page, clickButton } = this.state;
    if (numberPage < totalPages && !clickButton) {
      this.setState(
        {
          page: page + 1,
          numberPage: numberPage + 1,
          numberPageOne: (numberPage + 1) * 10 + 1 - 10,
          numberPageTwo: (numberPage + 1) * 10,
        },
        () => this.getSotrebyAdrees()
      );
    }
    if (numberPage < totalPages && clickButton) {
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
    const { numberPage, totalPages, page, clickButton } = this.state;
    if (numberPage < totalPages && !clickButton) {
      this.setState(
        {
          page: page - 1,
          numberPage: numberPage - 1,
          numberPageOne: (numberPage + 1) * 10 + 1 - 10,
          numberPageTwo: (numberPage + 1) * 10,
        },
        () => this.getSotrebyAdrees()
      );
    }
    if (numberPage === 1 && !clickButton) {
      this.setState(
        {
          page: page,
          numberPage: page,
          numberPageOne: page * 10 + 1 - 10,
          numberPageTwo: page * 10,
        },
        () => this.getSotrebyAdrees()
      );
    }
    if (
      (numberPage < totalPages && clickButton) ||
      (numberPage === totalPages && clickButton)
    ) {
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
  /// render item Store
  renderImtemList = ({ item, index }) => {
    const { navigation } = this.props;
    const { dataSearchResult } = this.state;
    return (
      <ItemListSearchResults
        key={index}
        data={item}
        index={index}
        navigation={navigation}
        dataMarker={dataSearchResult}
      />
    );
  };
  /// show picker chon search
  showSlectCityDistrictAndMore = () => {
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
          callApiOpentime={this.getListOpenTime}
          valueText={(item) => (this.state.valueTimOpen = item)}
        />
        <ItemModalSelectClose
          valueText={(item) => (this.state.valueTimClose = item)}
        />
      </View>
    );
  };

  showName = () => {
    const { dataListName, dataListValueDropDown } = this.state;
    console.log("dataListName", dataListName);
    const marginTop =
      (dataListValueDropDown &&
        dataListValueDropDown.city.name === STRING.placehoderCity) ||
      (!dataListValueDropDown.city &&
        dataListValueDropDown.district === "" &&
        dataListValueDropDown.startTime === STRING.placehoderOpentime) ||
      (!dataListValueDropDown.startTime &&
        dataListValueDropDown.closeTime === STRING.placehoderClosetime) ||
      !dataListValueDropDown.closeTime
        ? 10
        : 0;
    if (!dataListName || dataListName.length === 0) {
      return null;
    }
    if (dataListName) {
      const listNameCheckBox = dataListName.map((item, index) => {
        return (
          <Text
            style={{
              fontSize: 14,
              // justifyContent: "center",
              marginTop,
              marginHorizontal: 5,
              //   dataListName.length === 0 || dataListName === [] ? 10 : 0
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
            alignItems: "center",
          }}
        >
          {listNameCheckBox}
        </View>
      );
    }
    if (
      dataListName === null ||
      dataListName === undefined ||
      dataListName.length === 0
    ) {
      return;
    }
  };
  showGachTwo = (index) => {
    const { dataListName } = this.state;
    return (
      <Text key={`${index}`}>
        {index === dataListName.length - 1 ? "" : "/"}
      </Text>
    );
  };
  showValue = () => {
    const { dataListValueDropDown, dataListName } = this.state;
    console.log("dataListValueDropDown", dataListValueDropDown);
    const bottom =
      (dataListValueDropDown &&
        dataListValueDropDown.city.name === STRING.placehoderCity) ||
      (!dataListValueDropDown.city &&
        dataListValueDropDown.district === "" &&
        dataListValueDropDown.startTime === STRING.placehoderOpentime) ||
      (!dataListValueDropDown.startTime &&
        dataListValueDropDown.closeTime === STRING.placehoderClosetime) ||
      !dataListValueDropDown.closeTime
        ? 0
        : 0;
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
            flex: 1,
            marginVertical: dataListName.length === 0 ? 10 : 0,
            marginHorizontal: 5,
            bottom,
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
  callApiSearch = async () => {
    this.setState(
      {
        numberPage: 1,
        page: 1,
        dataSearchResult: [],
        numberPageOne: 1,
      },
      () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
    );
  };
  renderFooter = () => {
    if (loadingByName || loadingAddData) {
      return null;
    }
    const {
      totalPages,
      errLoadByName,
      errNetWorkAddData,
      dataSearchResult,
      textSearchInput,
      totalElements,
      loadingAddData,
      numberPage,
      loadingByName,
    } = this.state;
    return (
      <View style={{ marginBottom: 16 }}>
        {loadingAddData || loadingByName ? null : (
          <View style={{ marginTop: 16, width: "100%", marginBottom: 16 }}>
            {totalPages === 0 ||
            errNetWorkAddData ||
            errLoadByName ||
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
        {/* {loadingByName || loadingAddData ? (
          <Loading />
        ) : ( */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
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
          <View
            style={{ borderWidth: 1, borderColor: "#A3A4A5", width: "92%" }}
          >
            <View style={styles.containerVertical}>
              <View style={styles.vertical} />
              <View>
                <Text style={styles.textSearch}>検索条件を変更</Text>
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
                  {dataSearchResult.length === 0 ? 0 : totalElements}
                  <Text style={{ fontWeight: "normal", fontSize: 20 }}>
                    件{" "}
                  </Text>
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
                  flex: 1,
                  borderWidth: 1,
                  width: "92%",
                  borderColor: "#A3A4A5",
                  minHeight: 40,
                  justifyContent: "center",
                  marginHorizontal: 5,
                }}
              >
                {this.showName()}
                {this.showValue()}
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
            {this.showSlectCityDistrictAndMore()}
            <Text
              style={{
                marginHorizontal: 16,
                marginTop: 16,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              取扱い商品を絞り込む
            </Text>
            {/* {this.showCheckBox()} */}
            <View style={{ justifyContent: "center", flex: 1 }}>
              <ProductScreen />
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ButtonTypeOne
                name="検索条件を変更"
                loading={loadingAddData || loadingByName}
                style={{ width: "85%" }}
                onPress={this.callApiSearch}
              />
            </View>
          </View>
        </View>
        {/* )} */}
      </View>
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
      errLoadByName,
      errNetWorkAddData,
      dataSearchResult,
      numberPageOne,
      totalElements,
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
        errNetWorkAddData ||
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
              {dataSearchResult.length === 0 ? 0 : totalElements}件中
              {numberPageOne}~{this.checkPageNumber()}
              件を表示しています
            </Text>
          </View>
        )}
        <View style={{ marginTop: 16, width: "100%" }}>
          {totalPages === 0 ||
          errNetWorkAddData ||
          errLoadByName ||
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
    const {
      dataSearchResult,
      loadingAddData,
      errNetWorkAddData,
      loadingByName,
    } = this.state;
    if (loadingAddData || loadingByName) {
      return <Loading />;
    }
    if (dataSearchResult && dataSearchResult.length === 0) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontWeight: "500", fontSize: 18 }}>
            データがありません
          </Text>
        </View>
      );
    }
    if (errNetWorkAddData) {
      return (
        <NetworkError
          onPress={() => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()}
        />
      );
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
  onRefreshPage = () => {
    const { clickButton } = this.state;
    if (!clickButton) {
      this.setState(
        {
          numberPage: 1,
          page: 1,
          numberPageOne: 1,
        },
        () => this.getSotrebyAdrees()
      );
    }
    if (clickButton) {
      this.setState(
        {
          numberPage: 1,
          page: 1,
          numberPageOne: 1,
        },
        () => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()
      );
    }
  };

  gotoTop = () => {
    if (this.refs && this.refs.search) {
      this.refs.search.scrollTo({ x: 0, y: 250, animated: true });
    }
  };
  checkNameDrop = () => {
    this.setState({
      checkName: false,
    });
    setNameCheck.set({ type: "SetCheckCity", checkCity: true });
    setNameCheck.set({ type: "SetCheckCityDistrict", checkCity: true });
    setNameCheck.set({ type: "SetCheckOpen", checkCity: true });
    setNameCheck.set({ type: "SetCheckClose", checkCity: true });
  };

  showLoading = () => {
    const {
      isLoadingRefreshStoreResult,
      loadingSearchMoreOptions,
      errNetWorkAddData,
    } = this.state;
    if (errNetWorkAddData) {
      return (
        <NetworkError
          onPress={() => this.getStoreByCityAndDistrictAndClosedTimeAndTagId()}
        />
      );
    }
    if (loadingSearchMoreOptions) {
      if (this.timeoutLoading) {
        clearTimeout(this.timeoutLoading);
      }
      this.timeoutLoading = setTimeout(() => {
        this.setState({ loadingSearchMoreOptions: false });
      }, 1500);
      return <Loading />;
    } else {
      return (
        <ScrollView
          ref="search"
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefreshStoreResult}
              onRefresh={() => this.onRefreshPage()}
            />
          }
        >
          {this.renderHeader()}
          {this.renderContainer()}
          {this.renderFooter()}
        </ScrollView>
      );
    }
  };
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <HeaderIconLeft
          checkName={this.checkNameDrop}
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
