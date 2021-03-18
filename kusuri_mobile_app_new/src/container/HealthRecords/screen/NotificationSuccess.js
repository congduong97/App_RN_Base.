//Library:
import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { NavigationActions } from "react-navigation";

//Setup:
import { APP_COLOR } from "../../../const/Color";

//Component:
import { HeaderIconLeft } from "../../../commons";
import ConfirmSuccess from "../item/ConfirmSuccess";

//Services:
import NavigationService from "../../../service/NavigationService";

export default class ConfirmRegisterMarketDrugSuccess extends Component {
  render() {
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
          notBack={true}
          stylesView={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
        <ConfirmSuccess
          title={"お薬の登録が完了しました"}
          content={"お薬一覧からいつでも確認できます。"}
          textBtnConfirm={"お薬一覧に戻る"}
          onPressConfirm={() => {
            let arrayScreen = [
              NavigationActions.navigate({ routeName: "HOME" }),
              NavigationActions.navigate({ routeName: "HEALTH_RECORD" }),
              NavigationActions.navigate({
                routeName: "LIST_REGISTER_MEDICINE",
              }),
            ];
            NavigationService.reset(2, arrayScreen);
          }}
        />
      </View>
    );
  }
}
