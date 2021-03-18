import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import { COLOR_BLACK, COLOR_RED } from "../../../const/Color";
import { managerAccount } from "../../../const/System";
import { ServiceCheckBookMark } from "../until/service";
import { Api } from "../until/api";
import AntDesign from "react-native-vector-icons/AntDesign";
import Communications from "react-native-communications";
import { Loading } from "../../../commons";

export default class ItemStore extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const { bookmarked } = data;
    this.state = {
      loadingBookmark: false,
      bookmarked: bookmarked,
      urlData: ""
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    const { data } = this.props;
    const { code } = data;
    onRef && onRef(this);
    ServiceCheckBookMark.onChange(`checkbookmark${code}`, data => {
      if (
        data.listBookMark.unBookMark.code === code &&
        data.listBookMark.bookmarked
      ) {
        this.setState({
          bookmarked: false
        });
        return;
      }
      if (
        data.listBookMark.unBookMark.code === code &&
        !data.listBookMark.bookmarked
      ) {
        this.setState({
          bookmarked: true
        });
        return;
      }
    });
  }
  componentWillUnmount() {
    const { data } = this.props;
    const { code } = data;
    ServiceCheckBookMark.unChange(`checkbookmark${code}`);
  }
  setBookmarkStore = async (code, preBookmarkValue) => {
    try {
      this.setState({ loadingBookmark: true });
      const respones = await Api.setBookmarked(managerAccount.memberCode, code);
      if (
        respones.code === 200 &&
        respones.res.status.code === 1000 &&
        !respones.res.data
      ) {
        this.state.bookmarked = preBookmarkValue;
        if (!preBookmarkValue) {
          Alert.alert("お知らせ", "お気に入り店舗は最大5店舗までです。");
        }
      }
    } catch (err) {
    } finally {
      this.setState({
        loadingBookmark: false
      });
    }
  };
  gotoWebView = () => {
    const { data } = this.props;
    const { fileUrl } = data;
    const { navigation } = this.props;
    // if no exit link fileUrl open pdf
    if (fileUrl) {
      // navigation.navigate("PDF", {
      //   linkPDF: fileUrl
      // });
      navigation.navigate("WEB_VIEW", {
        url: fileUrl
      });
    }
  };

  clickBookmark = () => {
    const { navigation } = this.props;
    const { data } = this.props;
    const { code } = data;
    const { bookmarked, loadingBookmark } = this.state;
    if (!managerAccount.memberCode) {
      navigation.navigate("EnterMemberCodeScreen");
      return;
    }
    if (loadingBookmark) return;
    if (managerAccount.memberCode) {
      if (!bookmarked) {
        this.setState({
          bookmarked: true
        });
      } else {
        this.setState({
          bookmarked: false
        });
      }
      this.setBookmarkStore(code, bookmarked);
    }
  };

  gotoBookmark = () => {
    const { clickItem } = this.props;
    if (clickItem) {
      clickItem();
    }
  };
  gotoDetailStore = () => {
    const { navigation, data } = this.props;
    const { code } = data;
    navigation.navigate("DetailStore", code);
  };

  onGoGoogleMap = () => {
    const { data } = this.props;
    const { latitude, longitude } = data;
    const destination = `${latitude}+${longitude}`;
    const url = Platform.select({
      android: `google.navigation:q=${destination}`,
      ios: `maps://app?daddr=${destination}`
    });
    Linking.openURL(url);
  };

  showStar = () => {
    const { bookmarked } = this.state;
    if (bookmarked) {
      return <AntDesign name="star" size={30} color={COLOR_RED} />;
    }
    if (!bookmarked) {
      return <AntDesign name="staro" size={30} color={COLOR_RED} />;
    }
  };

  renderBookMark = () => {
    const { loadingBookmark } = this.state;
    if (loadingBookmark) {
      return <Loading />;
    }
    return (
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={this.clickBookmark}
      >
        <View style={styles.flyer1}>
          {this.showStar()}
          <Text
            style={{
              fontSize: 10,
              color: "#919293",
              fontWeight: "400"
            }}
          >
            お気に入り
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      data,
      index,
      dataListStore,
      latitudeMap,
      longitudeMap
    } = this.props;
    const {
      name,
      address,
      phone,
      closeTimeString,
      fileUrl,
      distance,
      pharmacy,
      zipCode,
      openTimeString
    } = data;
    return (
      <View>
        <View style={styles.container}>
          <View style={{ marginVertical: 5, paddingLeft: 5, flex: 1 }}>
            {name === null ? null : (
              <Text style={[styles.nameStore, { color: COLOR_BLACK }]}>
                {name}
              </Text>
            )}

            {zipCode === null ? null : (
              <Text
                style={{ paddingTop: 3, color: "#A4A5A7", fontWeight: "400" }}
              >
                〒{zipCode}
              </Text>
            )}
            {address === null ? null : (
              <Text
                style={{ paddingTop: 3, color: "#A4A5A7", fontWeight: "400" }}
              >
                {address}
              </Text>
            )}
            {openTimeString && closeTimeString === null ? null : (
              <Text
                style={{ paddingTop: 3, color: "#A4A5A7", fontWeight: "400" }}
              >
                営業時間: {openTimeString} - {closeTimeString}
              </Text>
            )}

            {phone === null ? null : (
              <Text
                style={[
                  { paddingTop: 3 },
                  { color: "#A4A5A7", fontWeight: "400" }
                ]}
                onPress={() => {
                  Communications.phonecall(phone, true);
                }}
              >
                TEL: {phone}
              </Text>
            )}
            {longitudeMap && latitudeMap ? (
              <Text
                style={{ paddingTop: 3, color: "#A4A5A7", fontWeight: "400" }}
              >
                距離: {~~distance} m
              </Text>
            ) : (
              undefined
            )}
            {pharmacy ? (
              <Text
                style={{ paddingTop: 3, color: "#A4A5A7", fontWeight: "400" }}
              >
                薬局あり
              </Text>
            ) : (
              undefined
            )}
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.onGoGoogleMap}
              >
                <View style={styles.map}>
                  <Image
                    source={require("../images/icon_route.png")}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.gotoDetailStore}
              >
                <View style={styles.infor}>
                  <Image
                    source={require("../images/icon_info.png")}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              {fileUrl === null ? null : (
                <TouchableOpacity
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onPress={this.gotoWebView}
                >
                  <View style={styles.flyer}>
                    <Image
                      source={require("../images/icon_flyer.png")}
                      style={{ width: 50, height: 50 }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              )}
              {this.renderBookMark()}
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            borderWidth: index === dataListStore.length - 1 ? 0 : 0.5,
            borderColor: "#EFF0F1"
          }}
        ></View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  map: {
    justifyContent: "center",
    alignItems: "center"
  },
  infor: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  flyer: {
    justifyContent: "center",
    alignItems: "center"
  },
  flyer1: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    paddingHorizontal: 10
  },
  nameStore: {
    fontSize: 18,
    fontWeight: "bold"
  }
});
