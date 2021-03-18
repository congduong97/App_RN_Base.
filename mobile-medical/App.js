import React, { Component } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { fcmService } from "./FireBase/FCMService";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fcmService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification
    );
  }

  onRegister(token) {
    console.log("[NotificationFCM] onRegister: ", token);
    //luuw token
    // if (models.getTokenModel() !== token) {
    //   models.insertOrUpdateTokenDevice({
    //     id: 0,
    //     token_device: token
    //   }, true)
    // }
  }

  onNotification(notify) {
    console.log("[123333]", notify);
    const channelObj = {
      channelId: "SampleChannelID",
      channelName: "SampleChannelName",
      channelDes: "SampleChannelDes",
    };
    const channel = fcmService.buildChannel(channelObj);

    var buildNotify = {};

    if (Platform.OS === "ios") {
      try {
        buildNotify = {
          dataId: notify._from,
          title: "A Chấm Công",
          content: JSON.parse(notify._data.message).body,
          sound: "default",
          channel: channel,
          data: {},
          colorBgIcon: "#1A243B",
          largeIcon: "icon_app",
          smallIcon: "icon_app",
          vibrate: true,
        };
      } catch (error) {}
      console.log("[buildNotify ios   ]", buildNotify);
    } else {
      buildNotify = {
        dataId: notify._notificationId,
        title: notify._title,
        content: notify._body,
        sound: "default",
        channel: channel,
        data: {},
        colorBgIcon: "#1A243B",
        largeIcon: "icon_app",
        smallIcon: "icon_app",
        vibrate: true,
      };
      console.log("[buildNotify    ]", buildNotify);
    }

    const notification = fcmService.buildNotification(buildNotify);
    fcmService.displayNotification(notification);
  }

  onOpenNotification(notify) {
    console.log("NotifiFCM onopen notifi:  ", notify);
    // alert("thong bao:   " + notify._body)
  }

  render() {
    return (
      <View style={{ position: "absolute" }}>
        {/* <LoadingView /> */}
        {/* <AppNavigator /> */}
      </View>
    );
  }
}
