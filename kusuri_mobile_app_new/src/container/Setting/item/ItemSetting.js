import React, { PureComponent } from "react";
import { Right, Left, Item } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet, View, Text } from "react-native";
import { AppImage } from "../../../component/AppImage";
import {
  COLOR_BLACK,
  COLOR_GRAY,
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  APP_COLOR,
} from "../../../const/Color";

class ItemSetting extends PureComponent {
  render() {
    const { onPress, iconUrl, name, disibleIonGo } = this.props;
    return (
      <Item
        style={[
          styles.itemStyle,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
        onPress={onPress}
      >
        <Left>
          <View
            style={{
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {iconUrl ? (
              <View
                style={[styles.wrapperIcon, { backgroundColor: COLOR_WHITE }]}
              >
                <AppImage
                  onPress={onPress}
                  url={this.props.iconUrl}
                  style={styles.avatarSetting}
                  resizeMode={"cover"}
                />
                {/* <Icon name={this.props.nameIcon} color={COLOR_BLACK} size={30} />} */}
              </View>
            ) : null}
            <View style={{ alignItems: "center" }}>
              <Text style={styles.textTitle}>{name}</Text>
            </View>
          </View>
        </Left>

        {!disibleIonGo && (
          <Right>
            <Icon name="angle-right" size={20} color={COLOR_GRAY} />
          </Right>
        )}
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  avatarSetting: {
    width: 30,
    height: 30,
  },
  wrapperIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    marginRight: 16,
    borderRadius: 16,
  },
  itemStyle: {
    backgroundColor: COLOR_WHITE,
    marginLeft: 0,
    paddingLeft: 15,
    alignItems: "center",
    height: 54,
    paddingRight: 15,
    borderColor: COLOR_GRAY_LIGHT,
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  textTitle: {
    // fontFamily: 'SegoeUI',
    fontSize: 15,
    textAlign: "center",
    color: COLOR_BLACK,
    paddingBottom: 0,
  },

  wrapperSpace: {
    height: 50,
  },
});

export { ItemSetting };
