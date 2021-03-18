//Library:
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { menuInApp } from "../../../const/System";
import { COLOR_WHITE, COLOR_RED } from "../../../const/Color";
import { EVENT_CHANGE_CURRENT_USER } from "../util/constant";

//Component:
import UserHeaderSelect from "../item/UserHeaderSelect";
import MaintainView from "../../../commons/MaintainView";
import { HeaderIconLeft, Loading, NetworkError } from "../../../commons";

//Services:
import { UserService } from "../util/UserService";

export default class ELinkRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {},
      error: false,
      maintain: false,
    };
  }
  componentDidMount() {
    this.getELink();
    UserService.onChange("CHANGE_CURRENT_USER_E_LINK", (listUser, event) => {
      if (event == EVENT_CHANGE_CURRENT_USER) {
        this.getELink();
      }
    });
  }
  componentWillUnmount() {
    !!this.timeOut && clearTimeout(this.timeOut);
    UserService.remove("CHANGE_CURRENT_USER_E_LINK");
  }
  getELink = async () => {
    const currentUser = UserService.getListUser().currentUser;
    try {
      if (!!currentUser && currentUser.id) {
        const response = await Api.getELink(currentUser.id);
        if (response.code === 502) {
          this.setState({
            isMaintain: true,
            isLoading: false,
          });
          return;
        }
        if (
          !!response &&
          response.code == 200 &&
          response.res.status.code == 1000
        ) {
          this.setState({
            data: response.res.data,
            isLoading: false,
          });
          return;
        }

        this.setState({
          ...this.state,
          error: true,
          isLoading: false,
        });
      }
    } catch (error) {
      this.setState({
        ...this.state,
        isLoading: false,
        error: true,
      });
    }
  };
  newELink = async () => {
    this.setState({
      isLoading: true,
    });
    const currentUser = UserService.getListUser().currentUser;
    try {
      const response = await Api.generateNewELink(currentUser.id);
      if (response.code === 502) {
        this.setState({
          isMaintain: true,
          isLoading: false,
        });
        return;
      }

      if (
        !!response &&
        response.code == 200 &&
        response.res.status.code == 1000
      ) {
        this.setState({
          data: response.res.data,
        });
        this.timeOut = setTimeout(() => {
          this.setState({
            isLoading: false,
          });
        }, 1000);
        return;
      }

      this.setState({
        ...this.state,
        error: true,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        ...this.state,
        isLoading: false,
        error: true,
      });
    }
  };
  renderElink = () => {
    const { isLoading, data } = this.state;
    if (isLoading) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: SIZE.width(84),
            width: "100%",
          }}
        >
          <Loading />
        </View>
      );
    }

    return (
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: "400",
            color: "black",
            marginTop: 20,
          }}
        >
          {data.oneTimeCode}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: "black",
            marginTop: 15,
          }}
        >
          {data.expirationTime}まで
        </Text>

        {/* Hiển thị ảnh QR code: */}

        <Image
          source={{ uri: data.qrImageUrl }}
          style={{
            height: SIZE.width(40),
            width: SIZE.width(40),
            marginTop: 15,
          }}
        />
        {/* Hiển thị ảnh barCode và Text : */}

        <Image
          source={{ uri: data.barcodeImageUrl }}
          style={{
            height: SIZE.width(13),
            width: SIZE.width(46),
            marginTop: 15,
          }}
        />
        <Text
          style={{
            fontSize: 8,
            fontWeight: "400",
            color: "black",
          }}
        >
          {data.oneTimeCode}
        </Text>
      </View>
    );
  };
  render() {
    const { goBack } = this.props.navigation;
    const { isMaintain, error } = this.state;
    if (isMaintain)
      <MaintainView
        onPress={() => {
          this.setState({
            isLoading: true,
            isMaintain: false,
          });
          this.getELink();
        }}
        timeOut={3000}
      />;
    if (error)
      <NetworkError
        onPress={() => {
          this.setState({
            isLoading: true,
            error: false,
          });
          this.getELink();
        }}
      />;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <HeaderIconLeft
          title={menuInApp.namePushNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconPushNotification}
        />
        {/* Hiển thị thông tin tài khoản đang được chọn : */}
        <UserHeaderSelect navigation={this.props.navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: "#E4E4E4",
          }}
          bounces={false}
        >
          <Text
            style={{
              marginTop: 25,
              fontSize: SIZE.H18,
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ワンタイムコード
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "black",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            医療機関・薬局の方に見せてください。
          </Text>

          {/* Hiển thị thông tin các mã QR code: */}
          <View
            style={{
              marginTop: 15,
              marginHorizontal: SIZE.width(8),
              borderRadius: 5,
              backgroundColor: COLOR_WHITE,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,

              elevation: 1,
            }}
          >
            {this.renderElink()}
            {/* Khung màu đỏ chú ý */}
            <View
              style={{
                marginTop: 20,
                marginBottom: 30,
                width: "90%",
                borderWidth: 1,
                borderColor: "red",
                padding: 15,
              }}
            >
              <Text
                style={{
                  color: COLOR_RED,
                  fontSize: 10,
                  fontWeight: "bold",
                  lineHeight: 16,
                }}
              >
                ワンタイムコードは一定時間のみ有効なコードです。{"\n"}{" "}
                有効期限が切れた場合は、再度発行してください。
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={{ left: 15, top: 15, right: 15, bottom: 15 }}
              style={{
                position: "absolute",
                right: 2,
                top: 2,
                // backgroundColor: COLOR_GREEN_RECORDS,
                borderRadius: 3,
              }}
              onPress={this.newELink}
            >
              {/* <AntDesign name="retweet" color="white" size={25} /> */}
              <Image
                source={require("../../Home/images/reload.png")}
                resizeMode='contain'
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
