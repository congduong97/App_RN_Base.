import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { SCREEN_WIDTH } from "../../../commons";
const DEVICE_WIDTH = Dimensions.get("window").width;

const DATA = [
  {
    LinkAnhBia:
      "https://i.pinimg.com/originals/a0/dc/35/a0dc35e337a9c7bf922bf5edc022236d.jpg",
  },
  {
    LinkAnhBia:
      "https://i.pinimg.com/originals/a8/45/76/a84576a04c1874304735604d9f47d5a4.jpg",
  },
  {
    LinkAnhBia:
      "https://www.gocbao.com/wp-content/uploads/2020/04/tai-anh-thien-nhien-2-8-500x260.jpg",
  },

];

export default function SlideBannerView(props) {
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({ item, index }) => {
    return <Image source={{ uri: item.LinkAnhBia }} style={styles.stImage} />;
  };

  return (
    <View>
      <Carousel
        data={DATA}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index)}
        sliderWidth={DEVICE_WIDTH}
        itemWidth={DEVICE_WIDTH}
        // layoutCardOffset={10}
        containerCustomStyle={{
          //   marginTop: 12,
          overflow: "visible",
        }}
        contentContainerCustomStyle={{ paddingVertical: 0 }}
        layout={"default"}
        loop={true}
        autoplay={true}
        autoplayDelay={5000}
        autoplayInterval={2000}
      />
      <Pagination
        dotsLength={DATA.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.containerStyle}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{
          borderColor: "white",
          borderWidth: 1,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stImage: {
    width: SCREEN_WIDTH - 32,
    height: 190,
    backgroundColor: "#345",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 16,
    marginTop: 16,
  },

  containerStyle: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    paddingVertical: 8,
    width: DEVICE_WIDTH,
    alignItems: "center",
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    //   marginHorizontal: 8,
    backgroundColor: "white",
  },
});
