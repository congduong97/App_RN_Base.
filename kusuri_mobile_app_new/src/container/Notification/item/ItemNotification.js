//Library:
import React, { Component } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

//Setup:
import { Api } from "../util/api";
import { styleInApp } from "../../../const/System";
import { COLOR_BLACK, COLOR_GRAY_LIGHT } from "../../../const/Color";
import { OpenMenu } from "../../../util/module/OpenMenu";

//Component:
import { AppImage } from "../../../component/AppImage";
import { getTimeFomartDDMMYY } from "../../../util";
import { TextTime } from "../../../component/TextTime/TextTime";

export default class ItemNotification extends Component {
  onPressNoti = () => {
    const { data, navigation } = this.props;
    if (data.typeNoti !== 1) {
      try {
        Api.getNotificationDetail(data.id);
      } catch (e) {}
    }
    if (data.typeNoti === 1) {
      navigation.navigate("DetailNotification", { data });
      return;
    }
    if (data.typeNoti === 2) {
      OpenMenu(data.menuEntity, navigation);
      return;
    }
    if (data.typeNoti === 3 && data.linkWebview) {
      this.props.navigation.navigate("WEB_VIEW", { url: data.linkWebview });
    }
  };

  render() {
    const { data, end } = this.props;
    const { title, shortContent, startTime, type, color, imageUrl } = data;
    const colorConvert = color && color[0] === "#" ? color : COLOR_BLACK;
    const borderBottomWidth = end ? 0 : 0.5;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.wrapperCard, { borderBottomWidth }]}
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
          <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
            <AppImage
              onPress={() => this.onPressNoti()}
              url={imageUrl}
              resizeMode={"cover"}
              style={{ width: 90, height: 90 }}
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
  },
});
