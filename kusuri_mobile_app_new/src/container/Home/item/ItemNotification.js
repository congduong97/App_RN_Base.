import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

import {
  COLOR_BLACK,
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import { AppImage } from "../../../component/AppImage";
import { OpenMenu } from "../../../util/module/OpenMenu";
import { Api } from "../../Notification/util/api";
import { styleInApp } from "../../../const/System";
import { getTimeFomartDDMMYY } from "../../../util";
import { TextTime } from "../../../component/TextTime/TextTime";

export class ItemNotification extends Component {
  onPressNoti = () => {
    const { data, navigation } = this.props;
    if (data.typeNoti === 1) {
      navigation.navigate("DetailNotification", { data });
    }
    if (data.typeNoti === 2) {
      this.clickNofitication(data.id);
      OpenMenu(data.menuEntity, navigation);
    }
  };
  clickNofitication = (id) => {
    try {
      Api.getNotificationDetail(id);
    } catch (e) {}
  };
  render() {
    const { data, end } = this.props;
    const { title, shortContent, startTime, type, color, imageUrl } = data;
    const colorConvert = color && color[0] === "#" ? color : COLOR_BLACK;
    const borderBottomWidth = end ? 0 : 0.5;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.wrapperCard,
          { borderBottomWidth, backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
        onPress={() => {
          this.onPressNoti();
        }}
      >
        <View style={{ flex: 8 }}>
          <View style={styles.title}>
            <Text
              style={[
                styleInApp.title,
                { color: type === 1 ? colorConvert : COLOR_BLACK },
              ]}
            >
              {title}
            </Text>
          </View>
          <Text numberOffLines={3} style={styleInApp.shortDescription}>
            {shortContent}
          </Text>
          <TextTime time={startTime ? getTimeFomartDDMMYY(startTime) : ""} />
        </View>
        {imageUrl && (
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
              flex: 2,
            }}
          >
            <AppImage
              onPress={() => this.onPressNoti()}
              url={imageUrl}
              resizeMode={"cover"}
              style={{ width: 60, height: 60, borderRadius: 60 }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  wrapperCard: {
    padding: 12,
    borderColor: COLOR_GRAY_LIGHT,
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: COLOR_WHITE,
  },
});
