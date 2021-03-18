//Library:
import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

//Setup:
import { SIZE } from "../../../const/size";
import { COLOR_BORDER } from "../../../const/Color";

//Component:
import ModalDropdown from "./ModalDropdown";
export default class ButtonDropdown extends PureComponent {
  render() {
    const {
      onPress,
      text,
      styleContainer,
      placeholder,
      birthday,
      dropdown,
      width,
      data,
      onPressChose,
      defaultLabel,
      defaultId,
      title,
      labelStyle,
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          {
            flexDirection: "row",
            height: 35,
            borderWidth: 0.5,
            borderColor: COLOR_BORDER,
            borderRadius: 5,
            width: width,
            backgroundColor: "white",
          },
          styleContainer,
        ]}
        activeOpacity={birthday ? 0.5 : 1}
        onPress={() => {
          !!dropdown &&
            data.length > 0 &&
            this.refModalDropdown.changeShow(true);
          !!onPress && onPress();
        }}
      >
        {birthday && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: !!text ? "black" : "#C6C6C6" }}>
              {!!text ? text : placeholder}
            </Text>
          </View>
        )}
        {dropdown && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: SIZE.width(3),
            }}
          >
            <Text
              style={[
                {
                  fontSize: 14,
                  color: !!defaultLabel ? "black" : "#C6C6C6",
                },
                labelStyle,
              ]}
            >
              {!!defaultLabel ? defaultLabel : placeholder}
            </Text>
            <ModalDropdown
              onRef={(ref) => {
                this.refModalDropdown = ref;
              }}
              data={data}
              defaultId={defaultId}
              defaultValue={defaultLabel}
              title={title}
              onPressItem={(item, index) => {
                !!onPressChose && onPressChose(item, index);
              }}
            />
          </View>
        )}
        <View
          style={{
            backgroundColor: "#06B050",
            justifyContent: "center",
            paddingHorizontal: 3,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
          }}
        >
          <Icon name='down' size={10} color={"white"} />
        </View>
      </TouchableOpacity>
    );
  }
}
