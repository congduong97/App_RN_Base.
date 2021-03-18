import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  FlatList
} from "react-native";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
import { APP_COLOR, COLOR_WHITE, COLOR_RED } from "../../../const/Color";
import { AppImage } from "../../../component/AppImage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Communications from "react-native-communications";
import { Api } from "../until/api";
export default class ItemListSearchResults extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const { bookmarked } = data;
    this.state = {
      loadingBookStore: false,
      bookmarked: bookmarked,
      index: false
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  setBookmarkStore = async (id, preBookmarkValue) => {
    try {
      this.setState({
        loadingBookStore: true
      });
      const respones = await Api.setBookmarked(managerAccount.memberCode, id);
      if (
        respones.code === 200 &&
        respones.res.status.code === 1000 &&
        !respones.res.data
      ) {
        //bookmark failed
        this.state.bookmarked = preBookmarkValue;
        if (!preBookmarkValue) {
          //max bookmark count is 5
          Alert.alert("お知らせ", "お気に入り店舗は最大5店舗までです。");
        }
      }
    } catch (err) {
    } finally {
      this.setState({
        loadingBookStore: false
      });
    }
  };
  clickBookmark = () => {
    const { navigation } = this.props;
    if (!managerAccount.memberCode) {
      navigation.navigate("EnterMemberCodeScreen");
      return;
    }
    const { data } = this.props;
    const { code } = data;
    const { bookmarked } = this.state;
    this.setState({
      bookmarked: !bookmarked
    });
    this.setBookmarkStore(code, bookmarked);
  };
  gotoMap = () => {
    if (this.StoreMap) {
      this.StoreMap.gotoSetMap();
    }
  };

  renderItemRelaredSearch = ({ item, index }) => {
    // console.log(item.id);
    // if (index === 5) {
    //   this.state.index === index;
    // }
    return (
      <View>
        <TouchableOpacity>
          <AppImage
            url={item.imageUrl}
            style={{ width: DEVICE_WIDTH * 0.22, height: DEVICE_WIDTH * 0.22 }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderContainerRelaredSearch = () => {
    const { data } = this.props;
    const { tagProducts } = data;
    return (
      <FlatList
        numColumns={4}
        data={tagProducts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItemRelaredSearch}
        onEndReachedThreshold={0.2}
      />
    );
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

  gotoWebView = () => {
    const { data } = this.props;
    const { fileUrl } = data;
    const { navigation } = this.props;
    if (fileUrl) {
      // navigation.navigate("PDF", {
      //   linkPDF: fileUrl
      // });
      navigation.navigate("WEB_VIEW", { url: fileUrl });
    }
    // Linking.openURL(fileUrl);
  };
  gotoWebViewMedical = () => {
    const { data } = this.props;
    const { urlMedical } = data;
    const { navigation } = this.props;
    navigation.navigate("WEB_VIEW", { url: urlMedical });
  };
  gotoWebViewStore = () => {
    const { data } = this.props;
    const { urlStore } = data;
    const { navigation } = this.props;
    navigation.navigate("WEB_VIEW", { url: urlStore });
  };
  renderText = () => {
    const { data } = this.props;
    const {
      holidayPharmacy,
      faxFreePharmacy,
      phonePharmacy,
      faxPharmacy,
      receptionTime
    } = data;
    const replaceBrReceptionTime = receptionTime.replace("、", "\n");
    const repalceReceptionTime = replaceBrReceptionTime.replace(
      /<br\s*\/?>/gi,
      ""
    );
    if (
      !repalceReceptionTime &&
      !holidayPharmacy &&
      !faxFreePharmacy &&
      !phonePharmacy &&
      !faxPharmacy
    ) {
      return (
        <Text
          style={[
            styles.titleDescriptionone,
            { fontWeight: "normal", fontSize: 13 }
          ]}
        >
          処方せんの受付はしておりません。
        </Text>
      );
    }
  };
  renderListText = () => {
    const { data } = this.props;
    const {
      receptionTime,
      holidayPharmacy,
      faxFreePharmacy,
      phonePharmacy,
      faxPharmacy
    } = data;
    const replaceBrReceptionTime = receptionTime.replace("、", "\n");
    const repalceReceptionTime = replaceBrReceptionTime.replace(
      /<br\s*\/?>/gi,
      ""
    );
    return (
      <View style={{ marginHorizontal: 16 }}>
        <Text style={styles.titleDescription}>処方せん受付</Text>
        {this.renderText()}
        {repalceReceptionTime === null ||
          repalceReceptionTime === undefined ||
          repalceReceptionTime === "" ? null : (
            <Text style={[styles.textDescription, { left: -10, lineHeight: 20 }]}>
              {repalceReceptionTime}
            </Text>
          )}
        {holidayPharmacy === null ||
          holidayPharmacy === undefined ||
          holidayPharmacy === "" ? null : (
            <Text style={styles.textDescription}>休日 : {holidayPharmacy}</Text>
          )}
        {faxFreePharmacy === null ||
          faxFreePharmacy === undefined ||
          faxFreePharmacy === "" ? null : (
            <Text style={styles.textDescription}>
              処方せん受付FAX : {faxFreePharmacy}
            </Text>
          )}
        {phonePharmacy === null ||
          phonePharmacy === undefined ||
          phonePharmacy === "" ? null : (
            <Text style={styles.textDescription}>
              TEL :
              <Text
                style={{ color: "#435DD3", textDecorationLine: "underline" }}
                onPress={() => {
                  Communications.phonecall(phonePharmacy, true);
                }}
              >
                {phonePharmacy}
              </Text>
            </Text>
          )}
        {faxPharmacy === null ||
          faxPharmacy === undefined ||
          faxPharmacy === "" ? null : (
            <Text style={styles.textDescription}>FAX :{faxPharmacy}</Text>
          )}
      </View>
    );
  };

  render() {
    const { data } = this.props;
    const { bookmarked } = this.state;
    const {
      name,
      address,
      workingTime,
      phone,
      phonePharmacy,
      fileUrl,
      urlImageMap,
      urlMedical,
      urlStore,
      zipCode,
      tagProducts
    } = data;
    const replaceWorkingTime = workingTime.replace("<br/>", "");
    const replaceBrFullAddress = address.replace("<br/>", "");
    const indexUseCoupon = tagProducts.findIndex(item => {
      return item.id === 6;
    });
    if (indexUseCoupon !== -1) {
      this.state.index = true;
    }
    const isShowLeaflets = fileUrl === null ||
      fileUrl === "" ||
      fileUrl === undefined ? false : true;
    return (
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ marginTop: 16, fontWeight: "bold", fontSize: 18 }}>
            {name}
          </Text>
          <View
            style={{
              width: 50,
              height: 1,
              backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              marginBottom: 16
            }}
          ></View>
          <AppImage
            style={styles.imageFeature}
            url={urlImageMap}
            resizeMode={"contain"}
            useZoom
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ marginHorizontal: 16 }}>
            {zipCode === "" ||
              zipCode === undefined ||
              zipCode === null ? null : (
                <Text style={{ fontWeight: "bold" }}>〒{zipCode}</Text>
              )}
            {replaceBrFullAddress === "" ||
              replaceBrFullAddress === undefined ||
              replaceBrFullAddress === null ? null : (
                <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                  {replaceBrFullAddress}
                </Text>
              )}
            {replaceWorkingTime === "" ||
              replaceWorkingTime === undefined ||
              replaceWorkingTime === null ? null : (
                <Text style={{ fontWeight: "bold", marginTop: 5 }}>
                  営業時間: {replaceWorkingTime}
                </Text>
              )}
            {phone === "" || phone === undefined || phone === null ? null : (
              <Text
                style={{ marginTop: 5 }}
                onPress={() => {
                  Communications.phonecall(phone, true);
                }}
              >
                TEL :
                <Text
                  style={{
                    color: "#435DD3",
                    textDecorationLine: "underline"
                  }}
                >
                  {phone}
                </Text>
              </Text>
            )}
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                borderWidth: 1,
                height: 50,
                marginTop: 16,
                justifyContent: "center",
                alignItems: "center",
                width: "92%",
                borderRadius: 4,
                borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                height: 50,
                backgroundColor: bookmarked
                  ? APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1
                  : COLOR_WHITE,
                marginBottom: 16
              }}
              onPress={this.clickBookmark}
            >
              <View>
                <FontAwesome
                  name="star"
                  size={30}
                  color={bookmarked ? COLOR_WHITE : COLOR_RED}
                  style={{ marginTop: 7, marginBottom: 7 }}
                />
              </View>
              <View>
                {bookmarked ? (
                  <Text style={{ color: COLOR_WHITE, marginLeft: 3 }}>
                    お気に入りを解除
                  </Text>
                ) : (
                    <Text style={{ color: APP_COLOR.COLOR_TEXT, marginLeft: 3 }}>
                      お気に入りに追加
                    </Text>
                  )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "92%",
              borderRadius: 4,
              borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1
            }}
            onPress={this.onGoGoogleMap}
          >
            <View>
              <Image
                source={require("../images/icon_route.png")}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text>この店舗の経路を調べる</Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderListText()}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 16
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: isShowLeaflets ? APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 : "#CECECE",
              width: "94%",
              backgroundColor: isShowLeaflets ? APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 : "#CECECE",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4
            }}
            onPress={this.gotoWebView}
            disabled={!isShowLeaflets}
          >
            <Text
              style={{
                paddingTop: 10,
                color: COLOR_WHITE,
                fontWeight: "bold"
              }}
            >
              {isShowLeaflets ? 'チラシを表示' : '本日チラシの掲載はございません'}
            </Text>
            <Image
              source={require("../images/5.png")}
              style={{
                width: 30,
                height: 30,
                marginBottom: 10,
                marginTop: 5,
                tintColor: COLOR_WHITE
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 16,
            marginHorizontal: 15
          }}
        >
          <View
            style={{
              width: DEVICE_WIDTH / 2 - 10,
              backgroundColor: COLOR_WHITE
            }}
          >
            {phone === "" || phone === null || phone === undefined ? null : (
              <TouchableOpacity
                style={{
                  borderRadius: 4,
                  borderWidth: 1,
                  width: "95%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "#A8C2D7"
                }}
                onPress={() => {
                  Communications.phonecall(phone, true);
                }}
              >
                <Text style={{ paddingTop: 10 }}>店舗に電話する</Text>
                <Image
                  source={require("../images/phone.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                    marginBottom: 10
                  }}
                />
              </TouchableOpacity>
            )}

            {urlMedical === null ||
              urlMedical === "" ||
              urlMedical === undefined ? null : (
                <TouchableOpacity
                  style={{
                    borderRadius: 4,
                    borderWidth: 1,
                    width: "95%",
                    marginTop:
                      phone === "" || phone === undefined || phone === null
                        ? 0
                        : 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#DCBFB3"
                  }}
                  onPress={this.gotoWebViewMedical}
                >
                  <Text style={{ paddingTop: 10 }}>医療事務募集</Text>
                  <Image
                    source={require("../images/3.png")}
                    style={{
                      width: 25,
                      height: 25,
                      marginTop: 5,
                      marginBottom: 10
                    }}
                  />
                </TouchableOpacity>
              )}
          </View>
          <View
            style={{
              width: DEVICE_WIDTH / 2 - 10,
              backgroundColor: COLOR_WHITE
            }}
          >
            {phonePharmacy === "" ||
              phonePharmacy === undefined ||
              phonePharmacy === null ? null : (
                <TouchableOpacity
                  style={{
                    borderRadius: 4,
                    borderWidth: 1,
                    width: "95%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#DCBFB3"
                  }}
                  onPress={() => {
                    Communications.phonecall(phonePharmacy, true);
                  }}
                >
                  <Text style={{ paddingTop: 10 }}>薬局に電話する</Text>
                  <Image
                    source={require("../images/2.png")}
                    style={{
                      width: 25,
                      height: 25,
                      marginTop: 5,
                      marginBottom: 10
                    }}
                  />
                </TouchableOpacity>
              )}
            {urlStore === null ||
              urlStore === "" ||
              urlStore === undefined ? null : (
                <TouchableOpacity
                  style={{
                    borderRadius: 4,
                    borderWidth: 1,
                    width: "95%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#5C8F79",
                    marginTop:
                      phonePharmacy === null ||
                        phonePharmacy === "" ||
                        phonePharmacy === undefined
                        ? 0
                        : 10
                  }}
                  onPress={this.gotoWebViewStore}
                >
                  <Text style={{ paddingTop: 10 }}>店舗スタッフ募集</Text>
                  <Image
                    source={require("../images/4.png")}
                    style={{
                      width: 25,
                      height: 25,
                      marginTop: 5,
                      marginBottom: 10
                    }}
                  />
                </TouchableOpacity>
              )}
          </View>
        </View>
        <View style={{ marginTop: 10, marginLeft: 16 }}>
          <Text style={{ fontWeight: "500" }}>取扱い商品</Text>
        </View>
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 16,
            borderWidth: this.state.index ? 1 : 0,
            borderColor: APP_COLOR.COLOR_TEXT
          }}
        >
          {this.state.index ? (
            <Text
              style={{
                color: APP_COLOR.COLOR_TEXT,
                // paddingRight: 15,
                lineHeight: 20,
                fontSize: 11
              }}
            >
              【ご注意】コンタクトレンズは薬局開局時間のみの販売となります。
            </Text>
          ) : null}
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }}
        >
          {this.renderContainerRelaredSearch()}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  vertical: {
    height: 20,
    width: 2,
    backgroundColor: COLOR_RED,
    borderWidth: 1,
    borderColor: COLOR_RED,
    marginLeft: 16
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16)
  },
  textDescription: {
    marginTop: 5,
    fontWeight: "500"
  },
  containerVertical: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16
  },
  textSearch: {
    paddingLeft: 5,
    fontWeight: "bold"
  },
  titleDescription: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 18
  },
  titleDescriptionone: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 18
  }
});
