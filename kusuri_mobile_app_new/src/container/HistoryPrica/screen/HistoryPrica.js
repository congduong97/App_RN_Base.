import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { HeaderIconLeft, Loading, NetworkError } from "../../../commons";
import {
  COLOR_WHITE,
  APP_COLOR,
  COLOR_RED,
  COLOR_BLUE,
} from "../../../const/Color";
import { STRING } from "../util/string";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Api } from "../util/api";
import MaintainView from "../../../commons/MaintainView";

const DEVICE_WIDTH = Dimensions.get("window").width;

export class HistoryPrica extends Component {
  constructor() {
    super();
    this.state = {
      networkError: false,
      data: [],
      isLoading: true,
      numberPage: 1,
      totalPage: 0,
      noData: false,
      maintain: false,
    };
  }

  componentDidMount() {
    this.getApi();
  }

  getApi = async () => {
    const { numberPage } = this.state;
    this.setState({ isLoading: true });
    try {
      const response = await Api.getHistoryPrica(numberPage);
      if (response.code === 200 && response.res.status.code == 1000) {
        this.state.data = response.res.data.cardUsageInfoDtoForApps;
        this.state.totalPage = response.res.data.totalPage;
        this.state.networkError = false;
        this.state.maintain = false;
      } else if (response.code == 502) {
        this.state.networkError = false;
        this.state.maintain = true;
      } else {
        this.state.networkError = true;
        this.state.maintain = false;
      }
    } catch (err) {
      this.state.networkError = true;
    }
    this.setState({ isLoading: false });
  };

  renderItem = ({ item }) => {
    let time = item.usageDatetime.replace(" ", "\n");
    let mountColor = item.moneyUsage.indexOf("-") >= 0 ? COLOR_RED : COLOR_BLUE;
    return (
      <View
        style={{
          flexDirection: "row",
          width: DEVICE_WIDTH - 20,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1.6,
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {time}
        </Text>
        <Text
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1.8,
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {item.storeName}
        </Text>
        <Text
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1.2,
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {item.settlementKBNString}
        </Text>
        <Text
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1,
            fontSize: 10,
            color: mountColor,
            textAlign: "center",
          }}
        >
          {item.moneyUsage}
        </Text>
      </View>
    );
  };

  //Thông tin bảng :
  headerTableList = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: DEVICE_WIDTH - 20,
          justifyContent: "center",
          backgroundColor: "#F19B9F",
          marginTop: 5,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1.6,
            fontWeight: "bold",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          {STRING.date}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1.8,
            fontWeight: "bold",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          {STRING.use_store}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1.2,
            fontWeight: "bold",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          {STRING.transaction_type}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            borderWidth: 1,
            padding: 10,
            flex: 1,
            fontWeight: "bold",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          {STRING.transaction_amount}
        </Text>
      </View>
    );
  };

  renderPageIndex = () => {
    const dataPage = [];
    for (let i = 1; i < this.state.totalPage + 1; i++) {
      dataPage.push(i);
    }
    return dataPage.map((page, index) => {
      let backgroundColor = "#F19B9F";
      if (this.state.numberPage === page) {
        backgroundColor = APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
      }
      if (this.state.numberPage === page) {
        backgroundColor = APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
      }
      return (
        <TouchableOpacity
          style={{
            width: DEVICE_WIDTH*0.05,
            height:  DEVICE_WIDTH*0.05,
            borderRadius: DEVICE_WIDTH*0.025,
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
          <Text style={{ color: COLOR_WHITE ,fontSize:DEVICE_WIDTH*0.03}}>{page}</Text>
        </TouchableOpacity>
      );
    });
  };
  onPressPage = async (page, index) => {
    this.state.numberPage = page;
    this.getApi();
  };

  onNextPress = () => {
    const { numberPage, totalPage } = this.state;
    if (numberPage < totalPage) {
      this.state.numberPage = numberPage + 1;
      this.getApi();
    }
  };
  onPrevPress = () => {
    const { numberPage } = this.state;
    if (numberPage > 1) {
      this.state.numberPage = numberPage - 1;
      this.getApi();
    }
  };

  renderPagination = () => {
    const { numberPage, totalPage } = this.state;
    let disablePrevBtn = numberPage === 1;
    let disableNextBtn = numberPage === totalPage;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 16,
          width: DEVICE_WIDTH - 20,
        }}
      >
        <TouchableOpacity
          disabled={disablePrevBtn}
          style={{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 8,
            backgroundColor: disablePrevBtn
              ? "#F19B9F"
              : APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
          }}
          onPress={this.onPrevPress}
        >
          <View style={{ marginLeft: 0 }}>
            <AntDesign name='left' size={15} color={COLOR_WHITE} />
          </View>
          <Text
            style={{
              color: COLOR_WHITE,
              fontSize: 10,
              right: 3,
              fontWeight: "bold",
              paddingHorizontal: 10,
            }}
          >
            前のページへ
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          {this.renderPageIndex()}
        </View>

        <TouchableOpacity
          disabled={disableNextBtn}
          style={{
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            paddingRight: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: disableNextBtn
              ? "#F19B9F"
              : APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
          }}
          onPress={this.onNextPress}
        >
          <Text
            style={{
              color: COLOR_WHITE,
              fontSize: 10,
              fontWeight: "bold",
              paddingHorizontal: 10,
            }}
          >
            次のページへ
          </Text>
          <View>
            <AntDesign name='right' size={15} color={COLOR_WHITE} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { goBack } = this.props.navigation;
    const { isLoading, networkError, data, maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.getApi} timeOut={10000} />;
    }
    if (isLoading) {
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <HeaderIconLeft
            stylesView={{ borderColor: COLOR_WHITE }}
            goBack={goBack}
          />
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {STRING.title}
          </Text>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Loading size={40} />
          </View>
        </View>
      );
    }
    if (networkError) {
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <HeaderIconLeft
            stylesView={{ borderColor: COLOR_WHITE }}
            goBack={goBack}
          />
          <NetworkError onPress={this.getApi} />
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <HeaderIconLeft
            stylesView={{ borderColor: COLOR_WHITE }}
            goBack={goBack}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 12,
              marginTop: 4,
            }}
          >
            {STRING.title}
          </Text>
          {/* {totalPage == 1 ? null : this.renderPagination()} */}
          {this.headerTableList()}
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 30 }}>
            プリカ利用履歴がありません。
          </Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <HeaderIconLeft
          stylesView={{ borderColor: COLOR_WHITE }}
          goBack={goBack}
        />
        <Text style={{ fontSize: 18, fontWeight: "bold", paddingVertical: 16 }}>
          {STRING.title}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 8 }}>
          履歴表示は、プリカのご利用分の最新13か月分（250件まで）を表示いたします。
        </Text>
        {this.renderPagination()}
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          ListHeaderComponent={this.headerTableList()}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default HistoryPrica;
