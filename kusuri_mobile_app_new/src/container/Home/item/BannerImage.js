import React, { PureComponent } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";
import {
  DEVICE_WIDTH,
  keyAsyncStorage,
  managerAccount,
} from "../../../const/System";
import { APP_COLOR } from "../../../const/Color";
import { AppImage } from "../../../component/AppImage";
import { OpenMenu } from "../../../util/module/OpenMenu";
import { Loading } from "../../../commons";
import { STRING } from "../util/string";
import { Api } from "../util/api";
import { CheckDataApp } from "../../Launcher/util/service";

export class BannerImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sliderBanner: [],
    };
  }
  componentDidMount() {
    this.getBanner();
    const { onRef } = this.props;
    onRef && onRef(this);
    CheckDataApp.onChange("BANNER", () => {
      this.getBanner();
    });
  }
  componentWillUnmount() {
    CheckDataApp.unChange("BANNER");
  }

  getBanner = async () => {
    AsyncStorage.getItem(keyAsyncStorage.banner).then((res) => {
      const { sliderBanner } = this.state;
      if (
        res &&
        Array.isArray(JSON.parse(res)) &&
        res !== JSON.stringify(sliderBanner)
      ) {
        this.setState({ sliderBanner: JSON.parse(res) });
      }
    });
  };
  clickBanner = async (id) => {
    try {
      const response = await Api.bannerImage(id);
    } catch (error) {}
  };
  onPressBanner = (item) => {
    const { navigation } = this.props;
    this.clickBanner(item.id);
    if (item.type === 1 && item.linkWebview) {
      if (item.openWithWebview) {
        this.props.navigation.navigate("WEB_VIEW", { url: item.linkWebview });
      } else {
        Linking.openURL(item.linkWebview);
      }
    } else if (item.type === 2) {
      OpenMenu(item.menuEntity, this.props.navigation);
    } else if (item.type === 3) {
    } else if (item.type === 4) {
      if (managerAccount.userId) {
        if (!item.openWithWebview) {
          Linking.openURL(
            `${item.linkApply}&memberCode=${managerAccount.memberCode}`
          );
        } else {
          this.props.navigation.navigate("WEB_VIEW", {
            url: `${item.linkApply}&memberCode=${managerAccount.memberCode}`,
          });
        }
      } else {
        Alert.alert(
          STRING.notification,
          STRING.please_login_to_use,
          [
            {
              text: STRING.cancel,
              onPress: () => {},
              style: "cancel",
            },
            {
              text: STRING.ok,
              onPress: () => navigation.navigate("EnterMemberCodeScreen"),
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  _renderDotIndicator() {
    const { length } = this.state.sliderBanner;
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
  goToRecruitment = () => {
    const { navigation } = this.props;
    navigation.navigate("RECRUITMENT");
  };
  get _renderBanner() {
    const renderBannerImage = this.state.sliderBanner.map((item, index) => (
      <View key={`${index}a`}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.onPressBanner(item)}
        >
          <AppImage
            url={item.imageUrl}
            style={{ height: DEVICE_WIDTH / 5, width: DEVICE_WIDTH }}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
      </View>
    ));
    return (
      <View>
        <IndicatorViewPager
          pageEnd={this.state.sliderBanner.length - 1}
          keyboardDismissMode={"none"}
          style={styles.imageFeature}
        >
          {renderBannerImage}
        </IndicatorViewPager>
      </View>
    );
  }
  render() {
    const { sliderBanner, loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (sliderBanner.length > 0) {
      return <View>{this._renderBanner}</View>;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH / 5,
  },
});
