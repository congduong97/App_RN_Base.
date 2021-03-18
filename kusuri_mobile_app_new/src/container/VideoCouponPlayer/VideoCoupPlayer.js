import React from "react";
import { isIOS } from "../../const/System";
import IosPlayer from "./items/IosPlayer";
import AndroidPlayer from "./items/AndroidPlayer";
import SliderHomeService from "../Home/util/SliderHomeService";

const VideoCouponPlayer = ({ navigation }) => {
  const { itemVideo } = navigation.state.params;
  if (isIOS) {
    return <IosPlayer navigation={navigation} itemVideo={itemVideo} />;
  }
  return <AndroidPlayer navigation={navigation} itemVideo={itemVideo} />;
};

export default VideoCouponPlayer;
