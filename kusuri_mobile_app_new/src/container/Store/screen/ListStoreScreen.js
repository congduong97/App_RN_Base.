import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import ItemStore from "../item/ItemStore";
import { Loading, NetworkError } from "../../../commons";
import { COLOR_WHITE } from "../../../const/Color";
import { setValueMapItem, ServiceListStore } from "../until/service";
export default class ListStoreScreen extends Component {
  constructor(props) {
    super(props);
    const rigonMap = setValueMapItem.get();
    this.state = {
      dataStoreNearest: [],
      loadingNearestStore: false,
      errNearestStore: false,
      latitude: rigonMap.latitude ? rigonMap.latitude : "",
      longitude: rigonMap.longitude ? rigonMap.longitude : "",
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    ServiceListStore.onChange("store", (data) => {
      if (data.dataStore.type === "DataListStore") {
        this.setState({
          dataStoreNearest: data.dataStore.data,
          loadingNearestStore: data.dataStore.loading,
        });
        return;
      }
      if (data.dataStore.type === "errStore") {
        this.setState({
          errNearestStore: data.data.loading,
        });
      }
    });
  }
  componentWillUnmount() {
    ServiceListStore.unChange("store");
  }

  renderItemStore = ({ item, index }) => {
    const { dataStoreNearest, latitude, longitude } = this.state;
    return (
      <ItemStore
        latitudeMap={latitude}
        longitudeMap={longitude}
        data={item}
        index={index}
        navigation={this.props.navigation}
        dataListStore={dataStoreNearest}
      />
    );
  };
  renderContainer = () => {
    const { dataStoreNearest, latitude, longitudeMap } = this.state;
    if (!latitude && !longitudeMap) {
      return null;
    }
    return (
      <FlatList
        data={dataStoreNearest}
        extraData={this.state}
        keyExtractor={(item, i) => `${item.code}`}
        renderItem={this.renderItemStore}
        onEndReachedThreshold={0.2}
      />
    );
  };
  render() {
    const {
      dataStoreNearest,
      loadingNearestStore,
      errNearestStore,
      longitude,
      latitude,
    } = this.state;
    if (!latitude && !longitude) {
      return null;
    }
    if (loadingNearestStore) {
      return <Loading />;
    }
    if (dataStoreNearest && dataStoreNearest.length === 0) {
      return null;
    }
    if (errNearestStore) {
      return <NetworkError />;
    }
    return (
      <View style={[styles.container, { borderColor: "#A3A4A5" }]}>
        {this.renderContainer()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    marginTop: 20,
    borderWidth: 1,
    width: "94%",
    borderRadius: 2,
  },
});
