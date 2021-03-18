import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  managerAccount,
} from "../../../const/System";
import { COLOR_WHITE } from "../../../const/Color";
import { setValueMapItem, ServiceListStore } from "../until/service";
const ASPECT_RATIO = DEVICE_WIDTH / DEVICE_HEIGHT;
import { Api } from "../until/api";
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const { height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
import ServicesMaintainStore from "../until/ServicesMaintainStore";
export default class StoreMap extends Component {
  constructor(props) {
    super(props);
    const rigonMap = setValueMapItem.get();
    this.state = {
      region: {
        latitude: rigonMap.latitude ? rigonMap.latitude : 36.534799,
        longitude: rigonMap.longitude ? rigonMap.longitude : 136.672393,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      loadingNearestStore: false,
      dataStoreMakerMap: [],
      errNearestStore: false,
      latitude: rigonMap.latitude ? rigonMap.latitude : "",
      longitude: rigonMap.longitude ? rigonMap.longitude : "",
      refreshLoading: false,
      currentItemSelected: {},
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    this.getsearchStoreNearestMap();
  }
  componentWillUnmount() {
    if (this.calloutTimeOut) clearTimeout(this.calloutTimeOut);
  }
  getsearchStoreNearestMap = async (load) => {
    try {
      if (load) {
        this.setState({
          refreshLoading: true,
        });
      } else {
        this.setState({
          loadingNearestStore: true,
        });
      }
      const { latitude, longitude } = this.state;
      const respones = await Api.getsearchStoreNearest(
        latitude,
        longitude,
        managerAccount.memberCode ? managerAccount.memberCode : ""
      );
      if (respones.code === 200 && respones.res.status.code === 1000) {
        this.state.dataStoreMakerMap = respones.res.data.slice(0, 30);
        this.state.loadingNearestStore = false;
        this.state.errNearestStore = false;
        const data = respones.res.data.slice(0, 10);
        ServiceListStore.set({
          type: "DataListStore",
          data: data,
          loading: this.state.loadingNearestStore,
        });
      } else if (respones.code == 502) {
        ServicesMaintainStore.set("MAINTAIN_STORE");
      }
    } catch (err) {
      this.state.errNearestStore = true;
      ServiceListStore.set({
        type: "errStore",
        err: this.state.errNearestStore,
      });
    } finally {
      this.setState({
        refreshLoading: false,
        loadingNearestStore: false,
      });
    }
  };

  gotoDeatailStore = (item) => () => {
    const { navigation } = this.props;
    navigation.navigate("DetailStore", item.code);
  };

  showTitleMap = (index, item) => () => {
    const { currentItemSelected } = this.state;
    if (currentItemSelected.code) {
      this[`marker${currentItemSelected.code}`].hideCallout();
    }

    this.setState(
      {
        currentItemSelected: item,
      },
      () => {
        if (this.calloutTimeOut) clearTimeout(this.calloutTimeOut);
        this.calloutTimeOut = setTimeout(() => {
          this[`marker${item.code}`].showCallout();
        }, 300);
      }
    );
  };
  render() {
    const { region, dataStoreMakerMap, currentItemSelected } = this.state;
    return (
      <View style={{ width: "94%", borderWidth: 1, borderColor: "#A3A4A5" }}>
        <MapView
          showsUserLocation
          showsTraffic
          showsBuildings
          loadingEnabled
          extent={25}
          style={{ height: (DEVICE_WIDTH / 2) * 2 }}
          initialRegion={region}
        >
          {dataStoreMakerMap.map((item, index, data) => {
            return (
              <Marker
                image={require("../images/StoreMap.png")}
                key={`${index}`}
                ref={(ref) => {
                  this[`marker${item.code}`] = ref;
                }}
                onPress={this.showTitleMap(index, item)}
                onCalloutPress={this.gotoDeatailStore(item)}
                provider={PROVIDER_GOOGLE}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
              >
                {/* comment item.code === currentItemSelected.code khi build android */}
                {item.code === currentItemSelected.code ? (
                  <Callout>
                    <View style={styles.bubble}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#2221FF",
                            fontWeight: "bold",

                            justifyContent: "center",
                            alignSelf: "center",
                            textDecorationLine: "underline",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: "#2221FF",
                          textDecorationLine: "underline",
                          paddingHorizontal: 5,
                        }}
                      >
                        〒{item.zipCode}
                      </Text>
                      <Text
                        style={{
                          color: "#2221FF",
                          paddingHorizontal: 5,
                          textDecorationLine: "underline",
                        }}
                      >
                        {item.address}
                      </Text>
                    </View>
                  </Callout>
                ) : null}
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: (DEVICE_WIDTH / 2) * 2,
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: DEVICE_WIDTH - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH / 2 - 20,
    paddingVertical: 5,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  ring: {
    borderRadius: 25,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  plainView: {
    width: DEVICE_WIDTH / 2,
    height: 200,
    borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.7)"
  },
});
