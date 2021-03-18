import React, { PureComponent } from "react";
import { Text, Animated, StyleSheet, View } from "react-native";
import { ButtonTypeOne } from "../../../commons";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
import { COLOR_GRAY, APP_COLOR } from "../../../const/Color";

export class BannerLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      height: new Animated.Value(0),
      loading: false,
    };
  }
  componentDidMount() {}
  startAnimation() {}
  reloadAnimation() {}
  goToLoginScreen = () => {
    const { navigation } = this.props;
    navigation.navigate("EnterMemberCodeScreen");
  };

  render() {
    const { opacity, height, loading } = this.state;
    if (managerAccount.userId) {
      return null;
    }

    return (
      <View style={[styles.container]}>
        <Text
          style={{
            fontSize: 16,
            color: COLOR_GRAY,
            marginVertical: 25,
            lineHeight: 25,
            textAlign: "center",
          }}
        >
          カード連携すると、
          <Text style={{ color: APP_COLOR.COLOR_TEXT }}>
            お会計時にご提示でポイント付与、プリカ決済、レジにてご提示でプリカチャージ
          </Text>
          ができる
          <Text style={{ color: APP_COLOR.COLOR_TEXT }}>会員バーコード</Text>
          が表示されとても便利です。
        </Text>
        <ButtonTypeOne
          style={{ marginTop: 0 }}
          name={"ポイントカードを連携"}
          onPress={this.goToLoginScreen}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD6D7",
    paddingHorizontal: 22,
  },
});
