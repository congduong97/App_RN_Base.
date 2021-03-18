import React, { Component, PureComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { STRING } from "../util/string";
import Navigation from "../../../service/NavigationService";
import { chooseStoreService } from "../util/service";
import { styleInApp } from "../../../const/System";
import { SIZE } from "../../../const/size";
import HTML from "react-native-render-html";
import CustomAlert from "../item/CustomAlert";
import Loading from "react-native-spinkit";
export default class StoreItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }
  navigateStoreDetail = (storeInfo) => {
    Navigation.navigate("STORE_DETAIL_ON_MAP", { storeInfo });
  };

  renderInfoStore(title, info) {
    return (
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Text style={[styleInApp.hkgpronw3_14, { flex: 2 }]}>{title}</Text>
        <Text style={[styleInApp.hkgpronw3_14, { flex: 5 }]}>{info}</Text>
      </View>
    );
  }
  render() {
    const { store, index } = this.props;
    return (
      <View style={styles.viewStore}>
        <View style={styles.viewName}>
          <Text style={styleInApp.hkgpronw6_18}>{store.name}</Text>
          <TouchableOpacity
            onPress={() => {
              this.navigateStoreDetail(store);
            }}
          >
            <Text
              style={[
                styleInApp.hkgpronw6_14,
                { color: "#3379B7", textDecorationLine: "underline" },
              ]}
            >
              MAP
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styleInApp.hkgpronw3_14, { flex: 2 }]}>営業時間</Text>
          <View style={{ flex: 5 }}>
            {store.listDayAndTimes.length > 0 &&
              store.listDayAndTimes.map((item, index) => {
                return (
                  <View
                    key={`${index}`}
                    style={{ flex: 1, flexDirection: "row" }}
                  >
                    <Text
                      style={[styleInApp.hkgpronw3_14, { flex: 3 }]}
                      numberOfLines={1}
                    >
                      {item.day}
                    </Text>
                    <Text
                      style={[styleInApp.hkgpronw3_14, { flex: 2 }]}
                      numberOfLines={1}
                    >
                      {item.time}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
        {this.renderInfoStore(STRING.date_off, store.dayOff)}
        {this.renderInfoStore("TEL", store.phone)}
        {/* {this.renderInfoStore(STRING.address, store.address)} */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styleInApp.hkgpronw3_14, { flex: 2 }]}>
            {STRING.address}
          </Text>
          <Text
            style={[styleInApp.hkgpronw3_14, { flex: 5 }]}
            numberOfLines={2}
          >
            {store.address}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnChooseStore}
          onPress={async () => {
            // alert(store.nameStore)
            if (!this.state.loading) {
              this.setState({ loading: true });
              let isValidDay = await chooseStoreService.validateDayCanChoose(
                store.code
              );
              if (isValidDay == "maintain") {
                this.props.getMaintain(true);
              } else if (isValidDay == "haveData") {
                chooseStoreService.setIndexDate(-1);
                chooseStoreService.setStore(store);
                chooseStoreService.clearListImage();
                Navigation.navigate("CAMERA");
              } else {
                this.alertRef.show(
                  "お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。"
                );
              }
              this.setState({
                loading: false,
              });
            }
          }}
        >
          {this.state.loading ? (
            <Loading color="white" type="ThreeBounce" />
          ) : (
            <Text
              style={[
                styleInApp.hkgpronw6_12,
                {
                  color: "white",
                },
              ]}
            >
              {STRING.choose_pharmacy}
            </Text>
          )}
        </TouchableOpacity>
        <CustomAlert ref={(node) => (this.alertRef = node)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStore: {
    // marginHorizontal: 20,
    padding: SIZE.width(4),
    borderRadius: 3,
    backgroundColor: "#F6F6F6",
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#E4E4E4",
  },
  viewName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  btnChooseStore: {
    width: SIZE.width(40),
    height: SIZE.height(5),
    backgroundColor: "#06B050",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
