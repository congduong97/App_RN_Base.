//Library:
import React, { Component } from "react";
import { View, StatusBar, ScrollView, BackHandler } from "react-native";

//Setup:
import { APP_COLOR, COLOR_GRAY_LIGHT } from "../../../const/Color";
import { DEVICE_WIDTH } from "../../../const/System";

//Component:
import { HeaderIconLeft } from "../../../commons";
import ProgressBarComponent from "../item/ProgressBarComponent";
import InputUserInfoBasic from "../item/InputUserInfoBasic";
import InputUserInfoDetail from "../item/InputUserInfoDetail";
import InputUserInfoSpecial from "../item/InputUserInfoSpecial";
import ReloadScreen from "../../../service/ReloadScreen";
import ConfirmSuccess from "../item/ConfirmSuccess";

export default class CreateUser extends Component {
  constructor() {
    super();
    this.listProgressBar = [
      { title: "基本情報" },
      { title: "詳細情報" },
      { title: "特記次項" },
      { title: "登録完了" },
    ];
    this.state = {
      currentPage: 0,
    };
  }

  backAction = () => {
    this.goBackScreen();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  goBackScreen = () => {
    const { goBack } = this.props.navigation;
    if (this.state.currentPage == 0) {
      goBack();
    } else {
      this.scrollToPage(this.state.currentPage - 1);
    }
  };

  scrollToPage = (index) => {
    this.refScrollView.scrollResponderScrollTo({
      x: DEVICE_WIDTH * index,
      y: 0,
      animated: true,
    });
    this.setState({
      currentPage: index,
    });
  };

  renderContent = () => {
    return (
      <View style={{ flex: 1, backgroundColor: COLOR_GRAY_LIGHT }}>
        <ProgressBarComponent
          data={this.listProgressBar}
          currentIndex={this.state.currentPage}
          colorActive={"#FF001A"}
          colorInActive={"#E4E4E4"}
          colorInActiveTitle={"#C6C6C6"}
          colorActiveTitle={"#FF001A"}
          styleContainer={{ marginVertical: 20 }}
        />
        <ScrollView
          ref={(ref) => {
            this.refScrollView = ref;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{
            backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          }}
        >
          <InputUserInfoBasic scrollToPage={this.scrollToPage} />
          <InputUserInfoDetail scrollToPage={this.scrollToPage} />
          <InputUserInfoSpecial
            scrollToPage={this.scrollToPage}
            navigation={this.props.navigation}
          />
          <ConfirmSuccess
            title={"ユーザー情報の登録が完了しました"}
            content={
              "ユーザー情報を更新すると、過去にお薬手帳に登録されたユーザー情報も更新されます。"
            }
            textBtnConfirm={"ユーザー一覧に戻る"}
            onPressConfirm={() => {
              ReloadScreen.set("LIST_USER_OF_MEMBER");
              this.props.navigation.navigate("LIST_USER_OF_MEMBER");
            }}
          />
        </ScrollView>
      </View>
    );
  };

  render() {
    const { currentPage } = this.state;
    return (
      <View
        style={{
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          flex: 1,
        }}
      >
        <StatusBar
          backgroundColor={APP_COLOR.BACKGROUND_COLOR}
          barStyle='dark-content'
        />
        <HeaderIconLeft
          goBack={this.goBackScreen}
          notBack={currentPage == 3}
          stylesView={{
            flexDirection: currentPage == 3 ? "column" : "row",
            justifyContent: currentPage == 3 ? "center" : "space-between",
          }}
        />
        {this.renderContent()}
      </View>
    );
  }
}
