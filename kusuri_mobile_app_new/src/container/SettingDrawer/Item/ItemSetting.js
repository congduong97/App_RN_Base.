import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLOR_GRAY_LIGHT, COLOR_GRAY } from "../../../const/Color";
import { OpenMenu } from "../../../util/module/OpenMenu";
import { DrawerControl } from "../../Home/util/service";

export class ItemSetting extends PureComponent {
  render() {
    const { data, end, navigation } = this.props;
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: 16 }}
        onPress={() => {
          DrawerControl.set(false);
          // if(data.type==='SECURITY_SETTING'){
          //     navigation.navigate('SECURITY_SETTING')

          // }else{
          OpenMenu(data, navigation);
          //}
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            height: 50,
            borderBottomWidth: end ? 0 : 1,
            flexDirection: "row",
            borderBottomColor: COLOR_GRAY_LIGHT
          }}
        >
          <Text style={{ color: COLOR_GRAY }}>{data.name}</Text>
          <Ionicons
            name={"ios-arrow-forward"}
            size={25}
            color={COLOR_GRAY_LIGHT}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
