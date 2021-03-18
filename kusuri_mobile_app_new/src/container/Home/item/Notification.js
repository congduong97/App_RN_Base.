import React, { PureComponent } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { DEVICE_WIDTH } from "../../../const/System";
import { STRING } from "../../../const/String";
import { APP_COLOR, COLOR_BLACK, COLOR_GRAY_LIGHT } from "../../../const/Color";
import { ItemNotification } from "./ItemNotification";
import Loading from "../../../commons/Loading";
import { Api } from "../util/api";

export class Notification extends PureComponent {
  state = {
    data: [],
    loading: true,
    error: false,
    networkError: false,
  };

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    this.getApi();
  }

  onPress = () => {
    const { navigation } = this.props;
    navigation.navigate("COMPANY_NOTIFICATION");
  };

  getApi = async () => {
    try {
      this.setState({ loading: true });

      let result = null;
      const { title } = this.props;
      if (title === STRING.notification_important) {
        result = await Api.getNotificationImportant();
      } else {
        result = await Api.getNotificationNormal();
      }

      if (result.code === 200 && result.res.status.code === 1000) {
        const { data } = result.res;
        const noti = JSON.stringify(data);
        await AsyncStorage.removeItem(title);
        await AsyncStorage.setItem(title, noti); //save notification to local
        this.state.data = data;
      } else {
        this.localNoti(false);
      }
    } catch (err) {
      this.localNoti(false);
    } finally {
      this.setState({ loading: false });
    }
  };
  async localNoti() {
    const { title } = this.props;
    const notification = await AsyncStorage.getItem(title);
    if (notification) {
      const localNoti = JSON.parse(notification);
      await this.setState({
        data: localNoti,
      });
    }
  }
  refresh = () => {
    this.getApi();
  };

  get renderNotificationImportant() {
    const { data } = this.state;
    const { title, navigation } = this.props;
    const renderNotification = data.map((item, i) => (
      <ItemNotification
        data={item}
        key={`${i}a`}
        end={data.length - 1 === i}
        navigation={navigation}
      />
    ));
    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          borderColor: COLOR_GRAY_LIGHT,
          borderWidth: 1,
        }}
      >
        <Text style={[styles.textTitle, { color: APP_COLOR.COLOR_TEXT }]}>
          {title}
        </Text>
        {renderNotification}
      </View>
    );
  }

  render() {
    const { seeMore } = this.props;
    const { data, loading } = this.state;
    // console.log('error', error);

    if (loading) {
      return (
        <Loading
          style={{ width: "100%", height: 100, marginVertical: 20 }}
          spinkit
        />
      );
    }
    // if (!error) {
    if (data && data.length >= 1) {
      return (
        <View style={[styles.wrapperContent, { marginBottom: 8 }]}>
          {this.renderNotificationImportant}
          {seeMore && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.wrapperCenter,
                {
                  height: 40,
                  width: DEVICE_WIDTH,
                },
              ]}
              onPress={this.onPress}
            >
              <Text
                textDecorationLine={"underline line-through"}
                style={[styles.textMore, { color: APP_COLOR.COLOR_TEXT }]}
              >
                {STRING.see_more}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: "SegoeUI",
    fontSize: 14,
    marginTop: 20,
  },
  wrapperContent: {
    opacity: 1,
    margin: 8,
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperTextMore: {
    flex: 1,
    width: DEVICE_WIDTH,
    justifyContent: "flex-end",
    flexDirection: "column",
    borderColor: COLOR_BLACK,
    borderWidth: 1,
  },
  textMore: {
    position: "absolute",
    fontSize: 14,
    right: 30,
    fontFamily: "SegoeUI",
    textDecorationLine: "underline",
  },
});
