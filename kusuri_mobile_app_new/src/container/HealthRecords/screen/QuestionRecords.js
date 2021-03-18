//Library:
import React, { Component } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { STRING_VALIDATE } from "../util/constant";
import { COLOR_BACKGROUND_RECORDS, COLOR_BLACK } from "../../../const/Color";

//Component:
import { Loading, NetworkError } from "../../../commons";
import QuestionItem from "../item/QuestionItem";
import ButtonConfirm from "../item/ButtonConfirm";
import Container from "../../../commons/Container";
import MaintainView from "../../../commons/MaintainView";

export default class QuestionRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listQuestion: [],
      loading: true,
      networkError: false,
      maintain: false,
      refresh: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      this.setState({
        loading: true,
        networkError: false,
        maintain: false,
      });
      const response = await Api.getQuestionDrug();
      if (response.code === 200 && response.res.status.code === 1000) {
        this.setState({
          listQuestion: response.res.data,
        });
      } else if (response.code === 502 || response.res === "timeout") {
        this.state.maintain = true;
      } else {
        this.state.networkError = true;
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ networkError: true });
    }
  };

  onRefresh = async () => {
    this.setState({ refresh: true });
    await this.getData();
    this.setState({ refresh: false });
  };

  //Hiển thị danh sách câu hỏi và câu trả lời:
  renderListQuestionItem = () => {
    const { listQuestion } = this.state;
    if (Array.isArray(listQuestion) && listQuestion.length > 0) {
      return listQuestion.map((item, index) => {
        return <QuestionItem item={item} key={`${index}`} index={index + 1} />;
      });
    } else {
      return (
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
          {STRING_VALIDATE.Not_Have_Question}
        </Text>
      );
    }
  };

  renderContent = () => {
    const { networkError, loading, refresh } = this.state;
    if (loading || refresh) {
      return <Loading />;
    }

    if (networkError) {
      return <NetworkError onPress={this.onRefresh} />;
    }
    return (
      <ScrollView
        style={{ backgroundColor: COLOR_BACKGROUND_RECORDS }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={this.onRefresh} />
        }
      >
        {/* Tiêu đề */}
        <View
          style={{
            marginLeft: SIZE.width(5),
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              height: "100%",
              width: 2,
              backgroundColor: "red",
            }}
          />
          <Text
            style={{
              marginLeft: SIZE.width(2),
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            よくある質問
          </Text>
        </View>

        {/* Danh sách câu hỏi */}
        {this.renderListQuestionItem()}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: SIZE.H5,
            color: COLOR_BLACK,
            alignSelf: "center",
            marginTop: 40,
          }}
        >
          それでも解決しない場合は
        </Text>
        <ButtonConfirm
          textButton={"お問い合わせ"}
          styleButton={{
            marginTop: 20,
            marginHorizontal: SIZE.width(5),
            marginVertical: 30,
          }}
          styleTextButton={{ fontWeight: "bold", fontSize: SIZE.H5 }}
        />
      </ScrollView>
    );
  };

  render() {
    const { maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.onRefresh} timeOut={10000} />;
    }
    return <Container>{this.renderContent()}</Container>;
  }
}
