//Library:
import React, { PureComponent } from "react";
import { Text, View } from "react-native";

//Setup:
import { SIZE } from "../../../const/size";
import { COLOR_TEXT } from "../util/constant";

//Component:
import ButtonConfirm from "./ButtonConfirm";
import ReloadScreen from "../../../service/ReloadScreen";

//Services:
import NavigationService from "../../../service/NavigationService";

export default class ConfirmSuccess extends PureComponent {
  render() {
    const { title, content, onPressConfirm, textBtnConfirm } = this.props;
    return (
      <View
        style={{
          flex: 1,
          width: SIZE.device_width,
          paddingHorizontal: SIZE.device_width * 0.04,
          backgroundColor: "#E4E4E4",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "800",
            marginTop: 15,
            color: COLOR_TEXT,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            marginTop: 15,
            lineHeight: 20,
            color: COLOR_TEXT,
          }}
        >
          {content}
        </Text>
        <ButtonConfirm
          textButton={textBtnConfirm}
          styleButton={{ marginTop: SIZE.height(15) }}
          styleTextButton={{ fontWeight: "900" }}
          onPress={() => {
            !!onPressConfirm && onPressConfirm();
          }}
        />
        <ButtonConfirm
          textButton='トップページへ'
          styleButton={{ marginTop: 40, backgroundColor: "white" }}
          styleTextButton={{ fontWeight: "900", color: "#06B050" }}
          onPress={() => {
            ReloadScreen.set("LIST_USER_OF_MEMBER");
            NavigationService.navigate("HEALTH_RECORD");
          }}
        />
      </View>
    );
  }
}
