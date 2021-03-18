import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { COLOR_TEXT } from "../util/constant";

export default class ProgressBarComponent extends Component {
  render() {
    const {
      data,
      styleContainer,
      currentIndex,
      styleDot,
      styleTitle,
      colorActive,
      colorInActive,
      colorActiveTitle,
      colorInActiveTitle,
    } = this.props;
    return (
      <View
        style={[{ flexDirection: "row", alignItems: "center" }, styleContainer]}
      >
        {!!data &&
          data.length > 0 &&
          data.map((item, index) => {
            return (
              <View key={`${index}`} style={{ flex: 1, alignItems: "center" }}>
                {!!item.title && (
                  <Text
                    style={[
                      {
                        fontSize: 10,
                        marginBottom: 5,
                        color:
                          index == currentIndex
                            ? colorActiveTitle
                            : colorInActiveTitle,
                        color: COLOR_TEXT,
                      },
                      styleTitle,
                    ]}
                  >
                    {item.title}
                  </Text>
                )}
                <View style={{ justifyContent: "center" }}>
                  {index !== data.length - 1 && (
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor:
                          index < currentIndex ? colorActive : colorInActive,
                        height: 2,
                        width: "100%",
                      }}
                    />
                  )}
                  <View
                    style={[
                      {
                        height: 14,
                        width: 14,
                        backgroundColor:
                          index > currentIndex ? colorInActive : colorActive,
                        borderRadius: 7,
                      },
                      styleDot,
                    ]}
                  />
                </View>
              </View>
            );
          })}
      </View>
    );
  }
}
