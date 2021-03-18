import React, { Component } from "react";
import { View } from "react-native";
import TabViewStore from "../item/TabViewStore";
import { menuInApp } from "../../../const/System";
import { HeaderIconLeft, NetworkError } from "../../../commons";
import { checkPermissionsWhenInUse } from "../../../util/module/checkPremissionsLocation";
import { setValueMapItem } from "../until/service";
import Geolocation from "react-native-geolocation-service";
import { COLOR_WHITE } from "../../../const/Color";
import NetInfo from "@react-native-community/netinfo";
import ServicesMaintainStore from "../until/ServicesMaintainStore";
import MaintainView from "../../../commons/MaintainView";
import { Api } from "../until/api";

export default class StoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasRequestLocation: false,
      networkError: false,
      maintain: false,
      index: !!this.props.navigation.state.params
        ? this.props.navigation.state.params.initIndex
        : null,
    };
  }
  componentDidMount() {
    ServicesMaintainStore.onChange("checkMaintainStore", (event) => {
      if (
        (event && event == "MAINTAIN_STORE") ||
        event == "MAINTAIN_BOOKMARK"
      ) {
        let activeScreen = event == "MAINTAIN_BOOKMARK" ? 1 : 0;
        this.setState({ maintain: true, index: activeScreen });
      } else {
        this.setState({ maintain: false });
      }
      if ((event && event == "ERROR_STORE") || event == "ERROR_BOOKMARK") {
        let activeScreen = event == "ERROR_BOOKMARK" ? 1 : 0;
        this.setState({ networkError: true, index: activeScreen });
      } else {
        this.setState({ networkError: false });
      }
    });
    this.getNetworkSatus();
  }

  getNetworkSatus = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.hasLocationPermission();
      }
      this.setState({ networkError: !isConnected });
    });
  };

  hasLocationPermission = async () => {
    const check = await checkPermissionsWhenInUse();
    this.getLocation();
    if (!check) {
      this.setState({ hasRequestLocation: true });
    }
  };

  reloadMaintainStore = async () => {
    const response = await Api.checkHasCatalog();
    console.log("response", response);
    if (response.code === 502) {
      return;
    } else {
      this.setState({ maintain: false });
    }
  };

  getLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setValueMapItem.set({ type: "GET_VALUE_MAP", position });
        this.setState({ hasRequestLocation: true });
      },
      (error) => {
        setValueMapItem.set({
          type: "GET_VALUE_MAP",
          position: {
            coords: {
              latitude: "",
              longitude: "",
            },
          },
        });
        this.setState({ hasRequestLocation: true });
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
  showTabView = () => {
    const { hasRequestLocation, index } = this.state;

    if (this.state.networkError) {
      return <NetworkError onPress={this.getNetworkSatus} />;
    }

    // let initIndex = null;
    // if (!!this.props.navigation.state.params) {
    //   initIndex = this.props.navigation.state.params.initIndex;
    // }

    if (hasRequestLocation) {
      return (
        <TabViewStore
          onRef={(ref) => {
            this.tabView = ref;
          }}
          navigation={this.props.navigation}
          initIndex={index}
        />
      );
    }
    return null;
  };
  render() {
    const { goBack } = this.props.navigation;
    const { maintain } = this.state;
    if (maintain) {
      return (
        <MaintainView onPress={this.reloadMaintainStore} timeOut={10000} />
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        <HeaderIconLeft
          stylesView={{ borderColor: COLOR_WHITE }}
          title={menuInApp.namePushNotification}
          goBack={goBack}
          imageUrl={menuInApp.iconPushNotification}
        />
        {this.showTabView()}
      </View>
    );
  }
}
