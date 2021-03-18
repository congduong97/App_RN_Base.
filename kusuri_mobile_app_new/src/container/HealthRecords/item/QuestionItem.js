//Library:
import React, { Component } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

//Setup:
import { COLOR_BLACK, COLOR_RED, COLOR_WHITE } from "../../../const/Color";
//Services:
import ServicesRenderQuestionRecords from "../util/ServicesRenderQuestionRecords";
import { SIZE } from "../../../const/size";

export default class QuestionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnswer: false,
    };
  }

  componentDidMount() {
    const { index } = this.props;
    ServicesRenderQuestionRecords.onChange(`${index}`, (indexActive) => {
      if (indexActive != index) {
        this.setState({ showAnswer: false });
      }
    });
  }

  renderAnswer = (index) => () => {
    ServicesRenderQuestionRecords.set(index);
    this.setState({ showAnswer: !this.state.showAnswer });
  };
  render() {
    const { showAnswer } = this.state;
    const { item, index } = this.props;
    return (
      <TouchableOpacity
        onPress={this.renderAnswer(index)}
        style={{
          marginTop: 10,
          marginHorizontal: SIZE.width(5),
          backgroundColor: COLOR_WHITE,
          borderRadius: 5,
          padding: SIZE.width(4),
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,

          elevation: 1,
        }}
        activeOpacity={1}
      >
        <View
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", width: "77%" }}>
            <Text
              style={{
                color: COLOR_RED,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Q{`${index}`}.{"  "}
            </Text>
            <Text
              style={{
                color: COLOR_BLACK,
                fontSize: SIZE.H5 + 4,
                fontWeight: "bold",
              }}
            >
              {item.question}
            </Text>
          </View>

          <View style={{ flexShrink: 1 }}>
            <AntDesign
              name={showAnswer ? "down" : "up"}
              color={"green"}
              size={20}
            />
          </View>
        </View>
        {showAnswer && (
          <Animated.View
            style={{
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: SIZE.H5 + 4,
                color: COLOR_BLACK,
                fontWeight: "bold",
              }}
            >
              A.{"    "}
            </Text>
            <Text style={{ fontSize: SIZE.H5 + 3, width: SIZE.width(70) }}>
              {item.answer}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  }
}
