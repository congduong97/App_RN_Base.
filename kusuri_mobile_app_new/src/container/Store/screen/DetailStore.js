import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { menuInApp } from "../../../const/System";
import ItemDetailStore from "../item/ItemDetailStore";
import { managerAccount } from "../../../const/System";
import { HeaderIconLeft, Loading, NetworkError } from "../../../commons";
import { Api } from "../until/api";
import ProductScreen from "../screen/ProductScreen";
import ItemModalSelectCity from "../item/ItemModalSelectCity";
import ItemModalSelectDistrict from "../item/ItemModalSelectDistrict";
import ItemModalSelectTimeOpentime from "../item/ItemModalSelectTimeOpentime";
import ItemModalSelectTimeClose from "../item/ItemModalSelectTimeClose";
import { STRING } from "../until/string";
import { COLOR_BLACK } from "../../../const/Color";
import ButtonTypeOne from "../../../commons/ButtonTypeOne";
import MaintainView from "../../../commons/MaintainView";
export default class DetailStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingDetail: true,
      err: false,
      dataSotreDetail: [],
      valueCities: "",
      valueDistricts: "",
      valueTimeOpen: "",
      valueTimeCLose: "",
      textSearch: "",
      pageTag: 1,
      isMaintain: false,
    };
  }
  componentDidMount() {
    this.getDetailStore();
  }
  getDetailStore = async () => {
    try {
      this.setState({
        loadingDetail: true,
      });
      const storeID = this.props.navigation.state.params;
      const response = await Api.getDetailStore(
        managerAccount.memberCode ? managerAccount.memberCode : "",
        storeID
      );
      console.log(response,"res")
      if (response.code === 502) {
        this.setState({
          isMaintain: true,
        });
        return;
      }
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.dataSotreDetail = response.res.data.content;
        this.state.isMaintain = false;
      } else {
        this.state.err = true;
        this.state.isMaintain = false;
      }
    } catch (err) {
      this.state.err = true;
      this.state.isMaintain = false;
    } finally {
      this.setState({
        loadingDetail: false,
        err: false,
      });
    }
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

  renderItemStore = ({ item, index }) => {
    const { dataSotreDetail } = this.state;
    const { navigation } = this.props;
    return (
      <ItemDetailStore
        data={item}
        index={index}
        key={`${index}`}
        dataMarker={dataSotreDetail}
        navigation={navigation}
      />
    );
  };
  renderFooter = () => {
    return (
      <View>
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
    const { dataSotreDetail, loadingDetail, err } = this.state;
    if (loadingDetail) {
      return <Loading />;
    }
    if (err) {
      return <NetworkError onPress={this.getDetailStore} />;
    }
    if (!dataSotreDetail || dataSotreDetail.length === 0) {
      return (
        <NetworkError
          title={"データなし"}
          iconName={"reload"}
          onPress={this.getDetailStore}
        />
      );
    }
    return (
      <FlatList
        data={dataSotreDetail}
        extraData={this.state}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItemStore}
        ListFooterComponent={this.renderFooter()}
        onEndReachedThreshold={0.8}
      />
    );
  };

  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return <MaintainView onPress={this.getDetailStore} />;
    }
    return (
      <View style={{ flex: 1, marginBottom: 32 }}>
        <HeaderIconLeft
          title={menuInApp.namePushNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconPushNotification}
        />
        {this.renderContainer()}
      </View>
    );
  }
}
