import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Alert,
  FlatList,
  AppState,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";

import ChooseStoreBtn from "../item/ChooseStoreInMapBtn";
import { COLOR_WHITE, COLOR_GRAY_LIGHT } from "../../../const/Color";
import {
  getWidthInCurrentDevice,
  getHeightInCurrentDevice,
  isIphoneX,
  isIOS,
} from "../../../const/System";
import { HeaderIconLeft } from "../../../commons";
import {
  checkLocationPermissionForIOS,
  checkLocationPermissionForAndroid,
  requestLocationPermissionForAndroid,
} from "../../../util/module/checkPremissionsLocation";
import { Api } from "../util/api";
import { STRING } from "../../../const/String";
import { chooseStoreService } from "../util/service";
import CustomAlert from "../item/CustomAlert";
import MaintainView from "../../../commons/MaintainView";

export default class NearbyStore extends PureComponent {
  currentStoreIndex = 0;
  constructor() {
    super();
    this.state = {
      region: {
        latitude: 36.5462712,
        longitude: 136.5845408,
        latitudeDelta: 1,
        longitudeDelta: 1,
      },
      markerArr: [],
      appState: AppState.currentState,
      isMaintain: false,
    };
  }

  hasLocationPermissionForIOS = async () => {
    let check = await checkLocationPermissionForIOS();
    if (check) {
      this.getLocation();
    } else {
      this.getListStoreNearUserLocation(36.5462712, 136.5845408);
    }
  };

  hasLocationPermissionForAndroid = async () => {
    let check = await checkLocationPermissionForAndroid();
    if (!check) {
      check = await requestLocationPermissionForAndroid();
    }
    if (check) {
      this.getLocation();
    } else {
      this.getListStoreNearUserLocation(36.5462712, 136.5845408);
    }
  };

  getListStoreNearUserLocation = (latitude, longitude) => {
    Api.getListStoreNearUserLocation(latitude, longitude).then((data) => {
      if (data.code == 502) {
        this.setState({
          isMaintain: true,
        });
        return;
      }
      if (data.code === 200) {
        this.setState({
          markerArr: data.res.data,
        });
      } else {
        Alert.alert(STRING.status_network_error);
      }
    });
  };

  getLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState(
          {
            region: {
              ...this.state.region,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
          () => {
            this.getListStoreNearUserLocation(
              position.coords.latitude,
              position.coords.longitude
            );
          }
        );
      },
      (error) => {
        this.getListStoreNearUserLocation(36.5462712, 136.5845408);
      },
      {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 10000,
        distanceFilter: 50,
        forceRequestLocation: true,
      }
    );
  };

  navigateToCamera = async () => {
    this.chooseStoreBtnRef.showLoading();
    const currentStore = this.state.markerArr[this.currentStoreIndex];
    if (currentStore != null && currentStore != undefined) {
      let isValidDay = await chooseStoreService.validateDayCanChoose(
        currentStore.code
      );
      if (isValidDay == "maintain") {
        this.setState({
          isMaintain: true,
        });
      } else if (isValidDay == "haveData") {
        chooseStoreService.setIndexDate(-1);
        chooseStoreService.setStore(currentStore);
        this.props.navigation.navigate("CAMERA");
      } else {
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

  renderCallout = (data) => {
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
              {data.name}
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
                {data.address}
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
              data={data.listDayAndTimes}
              renderItem={this.renderDateItem}
              extraData={data.listDayAndTimes}
              keyExtractor={(item, index) => `${index}`}
            />
          </View>
        </View>
      </Callout>
    );
  };

  onPressMapViewOnAndroid = () => {
    this.chooseStoreBtnRef.hide();
  };

  onPressMarkerOnAndroid = (index) => {
    this.currentStoreIndex = index;
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

  renderListMarker = () => {
    if (isIOS) {
      return this.state.markerArr.map((item, index) => (
        <Marker
          key={item.code}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          image={require("../../../images/storeMarker.png")}
          tracksViewChanges={false}
          onPress={() => {
            this.currentStoreIndex = index;
          }}
        >
          {this.renderCallout(item)}
        </Marker>
      ));
    } else {
      return this.state.markerArr.map((item, index) => (
        <Marker
          key={item.code}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          image={require("../../../images/storeMarker.png")}
          onPress={() => {
            this.onPressMarkerOnAndroid(index);
          }}
          tracksViewChanges={false}
        >
          {this.renderCallout(item)}
        </Marker>
      ));
    }
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (isIOS) this.hasLocationPermissionForIOS();
    }
    this.setState({ appState: nextAppState });
  };
  renderContent() {
    return (
      <>
        {isIOS ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={this.state.region}
              showsUserLocation={true}
              userLocationAnnotationTitle="あなたの位置"
              provider={PROVIDER_DEFAULT}
              onMarkerSelect={this.onMarkerSelect}
              onMarkerDeselect={this.onMarkerDeselect}
            >
              {this.state.markerArr.length > 0 && this.renderListMarker()}
            </MapView>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              ref={(map) => (this.mapRef = map)}
              style={styles.map}
              region={this.state.region}
              showsUserLocation={true}
              provider={PROVIDER_GOOGLE}
              onPress={this.onPressMapViewOnAndroid}
            >
              {this.state.markerArr.length > 0 && this.renderListMarker()}
            </MapView>
          </View>
        )}
        <ChooseStoreBtn
          ref={(node) => (this.chooseStoreBtnRef = node)}
          style={styles.goToCameraBtn}
          onPress={this.navigateToCamera}
        />
        <CustomAlert ref={(node) => (this.alertRef = node)} />
      </>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
        timeOut={10000}
          onPress={() => {
            this.setState({
              isMaintain: false,
            });
            this.focusListener = this.props.navigation.addListener(
              "didFocus",
              () => {
                this.locationPermissionTimeOut = setTimeout(() => {
                  if (isIOS) this.hasLocationPermissionForIOS();
                  else this.hasLocationPermissionForAndroid();
                }, 1000);
              }
            );
            
            AppState.addEventListener("change", this.handleAppStateChange);
          }}
        />
      );
    }
    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft goBack={goBack} />
        {this.renderContent()}
      </View>
    );
  }

  componentDidMount() {
    //this event name only for react-navigation 2.x
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.locationPermissionTimeOut = setTimeout(() => {
        if (isIOS) this.hasLocationPermissionForIOS();
        else this.hasLocationPermissionForAndroid();
      }, 1000);
    });
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    if (this.locationPermissionTimeOut) {
      clearTimeout(this.locationPermissionTimeOut);
    }
    this.focusListener.remove();
    AppState.removeEventListener("change", this.handleAppStateChange);
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
    // height: isIphoneX ? getHeightInCurrentDevice(430) : getHeightInCurrentDevice(448)
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
