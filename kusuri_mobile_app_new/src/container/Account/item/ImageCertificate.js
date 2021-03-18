import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Loading } from "../../../commons";
import { SIZE } from "../../../const/size";
import AsyncStorage from "@react-native-community/async-storage";
import { keyAsyncStorage } from "../../../const/System";
import { COLOR_WHITE } from "../../../const/Color";

export default class ImageCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlImageCertificate: "",
    };
  }
  componentDidMount = async () => {
    const mobileApp = await AsyncStorage.getItem(keyAsyncStorage.mobileApp);
    let certificateImage = JSON.parse(mobileApp).certificateImage;
    console.log("certificateImage", certificateImage);
    this.setState({
      urlImageCertificate: certificateImage,
    });
  };
  render() {
    const { styleImage } = this.props;
    const { urlImageCertificate } = this.state;
    console.log("urlImageCertificate", urlImageCertificate);
    if (!urlImageCertificate) {
      return (
        <View
          style={[
            styles.styleImage,
            styleImage,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLOR_WHITE,
            },
          ]}
        >
          <Loading />
        </View>
      );
      8090;
    }
    return (
      <Image
        style={[styles.styleImage, styleImage]}
        source={{ uri: urlImageCertificate }}
        resizeMode={"contain"}
      />
    );
  }
}
const styles = StyleSheet.create({
  styleImage: {
    width: SIZE.width(58),
    height: SIZE.width(37),
    marginTop: 30,
    alignSelf: "center",
    marginBottom: 16,
  },
});
