import React, { PureComponent } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { APP_COLOR, COLOR_GRAY_LIGHT, COLOR_WHITE } from "../../const/Color";

export class Segment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }

  render() {
    const renderItem = this.props.data.map((item, index) => {
      const { length } = this.props.data;
      const { active } = this.state;

      const isLeft = index === 0;
      const isRight = length === index + 1;
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={`${index}`}
          style={{
            height: 35,
            borderBottomRightRadius: isRight ? 3 : 0,
            borderTopRightRadius: isRight ? 3 : 0,
            borderBottomLeftRadius: isLeft ? 3 : 0,
            borderTopLeftRadius: isLeft ? 3 : 0,
            width: length === 3 ? "30%" : "45%",
            backgroundColor:
              active === index
                ? APP_COLOR.COLOR_BORDER_TAB_BAR_ACTIVE
                : COLOR_WHITE,
            borderWidth: active === index ? 0 : 0.5,
            borderColor: APP_COLOR.COLOR_BORDER_TAB_BAR_UN_ACTIVE,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            this.setState({ active: index });
            this.props.onPress(index);
          }}
        >
          <Text
            style={{
              color:
                this.state.active == index
                  ? APP_COLOR.COLOR_TEXT_TAB_BAR_ACTIVE
                  : APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE,
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          height: 70,
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderColor: COLOR_GRAY_LIGHT,
        }}
      >
        {renderItem}
      </View>
    );
  }
}
