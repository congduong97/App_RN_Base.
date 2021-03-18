//Library:
import React, { Component } from "react";
import { View, Text, ScrollView, Alert } from "react-native";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { STRING_VALIDATE } from "../util/constant";

//Component:
import ItemMenu from "../item/ItemMenu";
import { menuInApp } from "../../../const/System";
import { HeaderIconLeft, NetworkError } from "../../../commons";
import UserHeaderSelect from "../item/UserHeaderSelect";
import MaintainView from "../../../commons/MaintainView";

export default class SettingRecords extends Component {
  constructor(props) {
    super(props);
    this.listMenuHomeRecordUp = [
      {
        id: 1,
        name: "QRコードで登録",
        icon: require("../imgs/menu5.png"),
        keyNavigation: "QR_REGISTER",
      },
      {
        id: 2,
        name: "手入力で登録",
        icon: require("../imgs/menu6.png"),
        keyNavigation: "REGISTER_MANUAL_PRESCRIPTION",
      },
    ];
    this.listMenuHomeRecordDown = [
      {
        id: 3,
        name: "市販薬を登録",
        icon: require("../imgs/menu2.png"),
        keyNavigation: "REGISTER_MARKET_DRUG",
      },
    ];

    this.state = {
      isMaintain: false,
      networkError: false,
      disabled: false,
    };
  }

  componentWillUnmount() {
    this.timeOut && clearTimeout(this.timeOut);
  }

  fetchApiGetListUser = async (item) => {
    try {
      this.setState({
        disabled: true,
        networkError: false,
        isMaintain: false,
      });
      const response = await Api.patientInfo();
      if (response.code === 502) {
        this.setState({
          isMaintain: true,
          disabled: false,
        });
        return;
      }
      if (
        !!response &&
        response.code == 200 &&
        response.res.status.code == 1000
      ) {
        this.timeOut = setTimeout(() => {
          this.setState({
            disabled: false,
          });
        }, 200);
        if (!!response.res.data.currentUser) {
          this.props.navigation.navigate(item.keyNavigation, {
            navigationAction: item.keyNavigation,
          });
        } else {
          Alert.alert(STRING_VALIDATE.Not_Have_Current_User);
        }
        return;
      }
      this.setState({
        networkError: true,
        disabled: false,
      });
    } catch (error) {
      this.setState({
        networkError: true,
        disabled: false,
      });
    }
  };
  renderListMenuHomeRecord = (listMenu) => {
    return listMenu.map((item, index) => {
      return (
        <ItemMenu
          key={`${index}`}
          onPress={() => {
            this.fetchApiGetListUser(item);
          }}
          item={item}
          index={index}
          disabled={this.state.disabled}
        />
      );
    });
  };

  renderTitle = (title, styleContainer) => {
    return (
      <View
        style={[
          {
            marginLeft: SIZE.width(5),
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          },
          styleContainer,
        ]}
      >
        <View
          style={{
            height: "100%",
            width: 2,
            backgroundColor: "red",
          }}
        />
        <Text
          style={{
            marginLeft: SIZE.width(2),
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
      </View>
    );
  };
  renderContent = () => {
    const { networkError } = this.state;
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.setState({
              networkError: false,
            });
          }}
        />
      );
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#E4E4E4" }}
      >
        <UserHeaderSelect navigation={this.props.navigation} />
        {this.renderTitle("処方薬の場合")}
        {this.renderListMenuHomeRecord(this.listMenuHomeRecordUp)}
        {this.renderTitle("市販薬の場合", { marginTop: 30 })}
        {this.renderListMenuHomeRecord(this.listMenuHomeRecordDown)}
      </ScrollView>
    );
  };
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          onPress={() => this.setState({ isMaintain: false })}
          timeOut={10000}
        />
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <HeaderIconLeft
          title={menuInApp.namePushNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconPushNotification}
        />
        {this.renderContent()}
      </View>
    );
  }
}
