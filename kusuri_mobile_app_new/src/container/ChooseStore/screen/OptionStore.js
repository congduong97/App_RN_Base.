import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  menuInApp,
  sizePage,
  keyAsyncStorage,
} from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";
import { STRING } from "../util/string";
import { NetworkError, Loading, HeaderIconLeft } from "../../../commons";
import ReloadScreen from "../../../service/ReloadScreen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styleInApp } from "../../../const/System";
import { SIZE } from "../../../const/size";
export default class OptionStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      error: false,
      isLoading: false,
      isLoadingRefresh: false,
      data: [],
    };
  }
  optionItem(onPress, content) {
    return (
      <TouchableOpacity style={styles.itemOption} onPress={onPress}>
        <Text style={[styleInApp.hkgpronw6_18, { color: COLOR_WHITE }]}>
          {content}
        </Text>
        <AntDesign name={"right"} size={SIZE.width(4)} color={COLOR_WHITE} />
      </TouchableOpacity>
    );
  }
  renderContent() {
    return (
      <View>
        <Text style={[styles.textContent, styleInApp.hkgpronw6_16]}>
          {STRING.please_select_store}
        </Text>
        <Text style={[styles.textNameStore, styleInApp.hkgpronw3_16]}>
          {STRING.name_store}
          <Text style={[styleInApp.hkgpronw6_16]}>
            {STRING.not_choose}
          </Text>
        </Text>
        {this.optionItem(
          () => this.props.navigation.navigate("HISTORY_STORE"),
          STRING.choose_from_history
        )}
        {this.optionItem(
          () => this.props.navigation.navigate("NEARBY_STORE"),
          STRING.choose_from_map
        )}
        {this.optionItem(() => {
          this.props.navigation.navigate("LIST_STORE_DISTRICT");
        }, STRING.choose_from_address)}
      </View>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          // title={"fhdhdhdy"}
          goBack={goBack}
          imageUrl={menuInApp.iconNotification}
        />
        {this.renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1,
  },
  textContent: {
    marginTop: 30,
    marginLeft: SIZE.width(5),
  },
  textNameStore: {
    marginHorizontal: SIZE.width(5),
    marginTop: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#F6F6F6",
    borderWidth: 2,
    borderColor: "#E4E4E4",
    borderRadius: 3,
  },
  itemOption: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SIZE.width(5),
    marginTop: 20,
    justifyContent: "space-between",
    padding: SIZE.width(5),
    backgroundColor: "#06B050",
    borderRadius: 3,
  },
});
