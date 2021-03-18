import React, { PureComponent } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Animated,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";
import {
  DEVICE_WIDTH,
  keyAsyncStorage,
  isIOS,
  managerAccount,
} from "../../../const/System";
import { APP_COLOR } from "../../../const/Color";
import { Loading } from "../../../commons";
import { Api } from "../util/api";
import { CheckDataApp } from "../../Launcher/util/service";

import SliderItem from "./SliderItem";
import SliderHomeService from "../util/SliderHomeService";
export class SliderImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slider: [],
      opacity: new Animated.Value(0),
      height: new Animated.Value(0),
      listPkikakuHasCoupon: [],
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    this.startAnimation();
    this.getSlide();
    this.getListPkikakuHasCoupon();
    CheckDataApp.onChange("SLIDER", () => {
      this.getSlide();
    });
    SliderHomeService.onChange("slider", (idKikaku) => {
      this.getListPkikakuHasCoupon();
    });
  }

  deleteIdKikakuInListPkikakuHasCoupon = (idKikaku) => {
    const { listPkikakuHasCoupon } = this.state;

    let index = listPkikakuHasCoupon.indexOf(idKikaku);
    if (index > -1) {
      const arr = listPkikakuHasCoupon.splice(index, 1);

      this.setState({
        listPkikakuHasCoupon: [...listPkikakuHasCoupon],
      });
    }
  };
  componentWillUnmount() {
    CheckDataApp.unChange("SLIDER");
  }

  getListPkikakuHasCoupon = async () => {
    const res = await Api.getListPkikakuHasCoupon();

    if (res && res.code === 200 && res.res.status.code === 1000) {
      this.setState({
        listPkikakuHasCoupon: res.res.data,
      });
    }
  };
  getSlide = async () => {
    const { slider } = this.state;

    try {
      const res = await AsyncStorage.getItem(keyAsyncStorage.slider);
      if (Array.isArray(JSON.parse(res)) && res !== JSON.stringify(slider)) {
        this.setState({ slider: [...JSON.parse(res)] });
      }
    } catch (error) {}
  };

  startAnimation() {
    const { delay } = this.props;
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500,
        delay: 500 * delay,
      }),
    ]).start(() => {});
  }

  reloadAnimation = () => {
    this.getSlide();
  };

  renderDotIndicator() {
    const { length } = this.state.slider;
    return (
      <PagerDotIndicator
        pageCount={length === 1 ? 0 : length}
        dotStyle={{ height: 8, width: 8, borderRadius: 8 }}
        selectedDotStyle={{
          backgroundColor: APP_COLOR.COLOR_TEXT,
          height: 8,
          width: 8,
          borderRadius: 8,
        }}
      />
    );
  }

  renderSlider() {
    const renderSliderImage = this.state.slider.map((item, index) => (
      <SliderItem
        item={item}
        key={`${index}a`}
        isVisibleModal={this.props.isVisibleModal}
        navigation={this.props.navigation}
        listPkikakuHasCoupon={this.state.listPkikakuHasCoupon}
      />
    ));
    return (
      <IndicatorViewPager
        checkRenderDotFooter
        pageEnd={this.state.slider.length - 1}
        loop
        keyboardDismissMode={"none"}
        style={styles.imageFeature}
        indicator={this.renderDotIndicator()}
      >
        {renderSliderImage}
      </IndicatorViewPager>
    );
  }

  render() {
    const { slider, loading, opacity, height } = this.state;

    if (loading) {
      return <Loading />;
    }
    if (slider.length > 0) {
      return (
        <Animated.View style={[styles.container, { opacity }]}>
          <View>{this.renderSlider()}</View>
        </Animated.View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16),
  },
});
