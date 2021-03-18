import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  FlatList,
  Alert,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import ChooseStoreBtn from "../item/ChooseStoreInMapBtn";
import { COLOR_WHITE, COLOR_GRAY_LIGHT } from "../../../const/Color";
import {
  getWidthInCurrentDevice,
  getHeightInCurrentDevice,
  isIOS,
} from "../../../const/System";
import { HeaderIconLeft } from "../../../commons";
import { chooseStoreService } from "../util/service";
import CustomAlert from "../item/CustomAlert";
import MaintainView from "../../../commons/MaintainView";

export default class StoreDetailOnMap extends PureComponent {
  tapMapFirstTime = false;
  tapMarkerFirstTime = false;

  constructor() {
    super();
    this.state = {
      region: {
        latitude: 36.5462712,
        longitude: 136.5845408,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      isMaintain: false,
    };
  }

  showStoreInMap = () => {
    const store = this.props.navigation.getParam("storeInfo", null);
    if (store !== null) {
      this.setState(
        {
          region: {
            latitude: store.latitude,
            longitude: store.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        },
        () => {
          this.showCalloutTimeOut = setTimeout(() => {
            if (this.markerRef) {
              this.markerRef.showCallout();
              if (!isIOS) {
                this.onPressMarkerOnAndroid();
                this.markerTimeout = setTimeout(() => {
                  if (this.mapRef) {
                    this.mapRef.fitToSuppliedMarkers(["marker"]);
                  }
                }, 500);
              }
            }
          }, 500);
        }
      );
    }
  };

  navigateToCamera = async () => {
    this.chooseStoreBtnRef.showLoading();
    const store = this.props.navigation.getParam("storeInfo", null);
    if (store != null) {
      let isValidDay = await chooseStoreService.validateDayCanChoose(
        store.code
      );
      if (isValidDay == "maintain") {
        this.setState({
          isMaintain: true,
        });
      } else if (isValidDay == "haveData") {
        chooseStoreService.setIndexDate(-1);
        chooseStoreService.setStore(store);
        this.props.navigation.navigate("CAMERA");
      } else {
        //Alert.alert('お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。');
        this.alertRef.show(
          "お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。"
        );
      }
    } else {
      //Alert.alert('お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。');
      this.alertRef.show(
        "お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。"
      );
    }
    this.chooseStoreBtnRef.hideLoading();
  };

  renderDateItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            width: 70,
            fontSize: 12,
            color: "#1C1C1C",
            fontWeight: "bold",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.day}
        </Text>
        <Text
          style={{
            marginLeft: 10,
            fontSize: 12,
            color: "#1C1C1C",
            fontWeight: "bold",
          }}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  renderCallout = () => {
    const store = this.props.navigation.getParam("storeInfo", null);
    if (store != null) {
      return (
        <Callout tooltip>
          <View
            style={{ ...styles.calloutContainer, marginBottom: isIOS ? 0 : 10 }}
          >
            <View style={styles.calloutTitle}>
              <Text
                style={{
                  alignSelf: "center",
                  color: COLOR_WHITE,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {store.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  ...styles.addressTitle,
                  backgroundColor: "#FDE4E4",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, color: "#1C1C1C", fontWeight: "bold" }}
                >
                  住所
                </Text>
              </View>
              <View
                style={{
                  ...styles.addressContent,
                  backgroundColor: "white",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                }}
              >
                <Text
                  style={{ color: "#1C1C1C", fontWeight: "bold", fontSize: 12 }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {store.address}
                </Text>
              </View>
            </View>
            <View
              style={{ height: 1, width: "100%", backgroundColor: "#F6F6F6" }}
            />
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  ...styles.receptionTimeTitle,
                  backgroundColor: "#FDE4E4",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, color: "#1C1C1C", fontWeight: "bold" }}
                >
                  受付時間
                </Text>
              </View>
              <FlatList
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: COLOR_WHITE,
                  ...styles.receptionTimeContent,
                }}
                data={store.listDayAndTimes}
                renderItem={this.renderDateItem}
                extraData={store.listDayAndTimes}
                keyExtractor={(item, index) => `${index}`}
              />
            </View>
          </View>
        </Callout>
      );
    }
  };

  onPressMapViewOnAndroid = () => {
    this.chooseStoreBtnRef.hide();
  };

  onPressMarkerOnAndroid = () => {
    this.chooseStoreBtnRef.show();
  };

  //only for iOS
  onMarkerSelect = () => {
    this.chooseStoreBtnRef.show();
  };

  //only for iOS
  onMarkerDeselect = () => {
    this.chooseStoreBtnRef.hide();
  };

  //only for iOS
  onMapPress = () => {
    if (!this.tapMapFirstTime) {
      this.tapMapTimeOut = setTimeout(() => {
        this.tapMapFirstTime = true;
        if (!this.tapMarkerFirstTime) {
          this.markerRef.hideCallout();
        }
      }, 200);
    }
  };

  //only for iOS
  onMarkerPress = () => {
    this.tapMarkerFirstTime = true;
  };

  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          timeOut={10000}
          onPress={() => {
            this.focusListener = this.props.navigation.addListener(
              "didFocus",
              () => {
                this.locationPermissionTimeOut = setTimeout(() => {
                  this.showStoreInMap();
                }, 1000);
              }
            );
            this.setState({
              isMaintain: false,
            });
          }}
        />
      );
    }
    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft goBack={goBack} />
        {isIOS ? (
          <View style={styles.mapContainer}>
            <MapView
              ref={(map) => (this.mapRef = map)}
              style={styles.map}
              region={this.state.region}
              showsUserLocation={true}
              provider={PROVIDER_DEFAULT}
              onMarkerSelect={this.onMarkerSelect}
              onMarkerDeselect={this.onMarkerDeselect}
              onPress={this.onMapPress}
            >
              <Marker
                ref={(node) => (this.markerRef = node)}
                coordinate={{
                  latitude: this.state.region.latitude,
                  longitude: this.state.region.longitude,
                }}
                image={require("../../../images/storeMarker.png")}
                identifier={"marker"}
                onPress={this.onMarkerPress}
                tracksViewChanges={false}
              >
                {this.renderCallout()}
              </Marker>
            </MapView>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              ref={(map) => (this.mapRef = map)}
              style={styles.map}
              region={this.state.region}
              onPress={this.onPressMapViewOnAndroid}
              maxZoomLevel={15}
            >
              <Marker
                ref={(node) => (this.markerRef = node)}
                coordinate={{
                  latitude: this.state.region.latitude,
                  longitude: this.state.region.longitude,
                }}
                image={require("../../../images/storeMarker.png")}
                onPress={this.onPressMarkerOnAndroid}
                identifier={"marker"}
                tracksViewChanges={false}
              >
                {this.renderCallout()}
              </Marker>
            </MapView>
          </View>
        )}
        <ChooseStoreBtn
          ref={(node) => (this.chooseStoreBtnRef = node)}
          style={styles.goToCameraBtn}
          onPress={this.navigateToCamera}
        />
        <CustomAlert ref={(node) => (this.alertRef = node)} />
      </View>
    );
  }

  componentDidMount() {
    //this event name only for react-navigation 2.x
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.locationPermissionTimeOut = setTimeout(() => {
        this.showStoreInMap();
      }, 1000);
    });
  }

  componentWillUnmount() {
    if (this.showCalloutTimeOut) {
      clearTimeout(this.showCalloutTimeOut);
    }

    if (this.markerTimeout) {
      clearTimeout(this.markerTimeout);
    }

    if (this.tapMapTimeOut) {
      clearTimeout(this.tapMapTimeOut);
    }

    if (this.locationPermissionTimeOut) {
      clearTimeout(this.locationPermissionTimeOut);
    }

    this.focusListener.remove();
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: getWidthInCurrentDevice(375),
    //height: isIphoneX ? getHeightInCurrentDevice(430) : getHeightInCurrentDevice(448)
    flex: 1,
  },
  calloutContainer: {
    width: getWidthInCurrentDevice(336),
    height: getHeightInCurrentDevice(158),
  },
  calloutTitle: {
    width: getWidthInCurrentDevice(336),
    height: getHeightInCurrentDevice(35),
    justifyContent: "center",
    backgroundColor: "#FF7F7F",
    borderRadius: 3,
  },
  addressTitle: {
    width: getWidthInCurrentDevice(78),
  },
  addressContent: {
    width: getWidthInCurrentDevice(258),
  },
  receptionTimeTitle: {
    width: getWidthInCurrentDevice(78),
  },
  receptionTimeContent: {
    width: getWidthInCurrentDevice(258),
  },
  goToCameraBtn: {
    width: getWidthInCurrentDevice(366),
    height: getHeightInCurrentDevice(42),
    backgroundColor: "#06B050",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
