import React, { PureComponent } from "react";
import { StyleSheet, View, Animated, Text, Image } from "react-native";
import {
  IndicatorViewPager,
  PagerDotIndicator,
} from "../../../liberyCustom/rn-viewpager";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
import { APP_COLOR, COLOR_BLACK } from "../../../const/Color";
import { Loading, ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import { from } from "rxjs";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export class SliderImageUsingPhoneNumberAndBirhDay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slider: [
        {
          image: require("../images/Picture1.png"),
          title:
            "クスリのアオキ公式アプリの不正利用防止のため本人認証が必須となりました。",
        },
        {
          image: require("../images/Picture2.png"),
          title:
            "Aocaに1つの携帯電話番号を紐づけることで利用者を限定することができます。",
        },
        {
          image: require("../images/Picture3.png"),
          title:
            "アオキメンバーズカード作成時にご記載いただいた生年月日の認証で本人確認を行います。",
        },
        {
          image: require("../images/Picture4.png"),
          title:
            "アプリ起動時、会員バーコード表示時にパスワード認証ができます。設定することをオススメしています。",
        },
      ],
    };
  }

  _renderDotIndicator() {
    const { length } = this.state.slider;
    return (
      <PagerDotIndicator
        // style={{ marginTop: 40, }}
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

  get _renderSlider() {
    const renderSliderImage = this.state.slider.map((item, index) => (
      <View
        key={`${index}a`}
        style={{
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          source={item.image}
          style={{
            height: DEVICE_WIDTH - (64 + 80),
            width: DEVICE_WIDTH - (64 + 80),
            marginTop: 10,
          }}
        />

        <Text
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            lineHeight: 25,
            fontSize: RFPercentage(1.7),
            color:COLOR_BLACK
          }}
        >
          {item.title}
        </Text>
      </View>
    ));
    return (
      <View style={{ width: DEVICE_WIDTH - 40 }}>
        <Text
          style={{
            marginHorizontal: 16,
            lineHeight: 25,
            fontSize: RFPercentage(1.9),
            color: COLOR_BLACK,
          }}
        >
          {
            "不正利用防止のため携帯電話番号登録およびSMS認証による本人認証が必須となります。"
          }
        </Text>
        <IndicatorViewPager
          checkRenderDotFooter
          pageEnd={this.state.slider.length - 1}
          autoPlayEnable
          autoPlayInterval={4000}
          pageEnd={this.state.slider.length - 1}
          loop
          keyboardDismissMode={"none"}
          style={styles.imageFeature}
          indicator={this._renderDotIndicator()}
        >
          {renderSliderImage}
        </IndicatorViewPager>
      </View>
    );
  }
  render() {
    const { slider, loading, opacity, height } = this.state;
    const { clickAgree, goBack } = this.props;

    return (
      <View>
        <View
          style={{
            width: DEVICE_WIDTH - 40,
            paddingTop: 10,
          }}
        >
          {this._renderSlider}
        </View>
        <ButtonTypeOne
          style={{
            width: DEVICE_WIDTH - (32 + 80),
            marginLeft: 16 + 20,
            marginTop: 16,
          }}
          name={"携帯電話番号・本人認証を行う"}
          onPress={() => {
            clickAgree();

            // this.props.navigation.navigate('EnterMemberCodeScreen');
          }}
        />
        <ButtonTypeTwo
          style={{
            width: DEVICE_WIDTH - (32 + 80),
            marginLeft: 16 + 20,
            marginTop: 16,
          }}
          name={"カード番号を変更する"}
          onPress={goBack}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageFeature: {
    width: DEVICE_WIDTH - 40,
    height: DEVICE_WIDTH - 40,
  },
});
