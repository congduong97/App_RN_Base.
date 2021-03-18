import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import { ScrollView, Dimensions, Linking } from "react-native";
import Container from "../../../commons/Container";
import { DebounceButton } from "../../../commons/DebounceButton";
import { SIZE } from "../../../const/size";
import HTML from "react-native-render-html";
import { keyAsyncStorage } from "../../../const/System";
import { Api } from "../util/api";
export default class Term extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false,
      term: "",
    };
    this.submitBtnRef = React.createRef();
  }

  componentDidMount() {
    this.onDidMount();
  }

  onDidMount = async () => {
    try {
      const accepted = await AsyncStorage.getItem(
        keyAsyncStorage.healthRecordPolicy
      );
      if (accepted) {
        this.setState({ accepted: true });
      }
      const response = await Api.getTermDrug();
      console.log("getTermDrug", response);
      if (response.code === 200 && response.res.status.code === 1000) {
        this.setState({
          term: response.res.data,
        });
      }
      //  else if (response.code === 502 || response.res === "timeout") {
      //   this.state.maintain = true;
      // } else {
      //   this.state.networkError = true;
      // }
    } catch (error) {
      // this.setState({ networkError: true });
    }
  };

  onAccept = async () => {
    this.submitBtnRef.current.setLoading(true);
    await AsyncStorage.setItem(keyAsyncStorage.healthRecordPolicy, "accepted");
    this.props.navigation.goBack();
  };

  convertHtmlContent = (content) => {
    const customContent = content
      ? content
          .replace(/(<p><em>)/gm, "<em>")
          .replace(/(<\/p><\/em>)/gm, "</em>")
          .replace(/(<p><i>)/gm, "<i>")
          .replace(/(<\/p><\/i>)/gm, "</i>")
          .replace(/(\n)/gm, "<br />")
          .replace(/(<br \/><br \/>)/gm, "<br/ >")
      : "";

    return `<div>${customContent}</div>`;
  };

  render() {
    const { term } = this.state;
    return (
      <Container
        title='お薬手帳利用規約'
        goBack={() => {
          if (this.state.accepted) {
            this.props.navigation.goBack();
            return;
          }
          this.props.navigation.pop(2);
        }}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            paddingTop: 24,
            paddingHorizontal: 12,
          }}
          style={{
            backgroundColor: "#ffffff",
            marginHorizontal: 12,
            marginTop: 24,
            marginBottom: 18,
            borderWidth: 1,
            borderRadius: 3,
            borderColor: "#DADADA",
          }}
        >
          <HTML
            tagsStyles={{
              span: {
                fontSize: SIZE.H3,
              },
              h6: {
                lineHeight: SIZE.H3 + 7,
                fontSize: SIZE.H3,
              },
              div: {
                overflow: "hidden",
              },
              p: {
                lineHeight: SIZE.H3 + 7,
                fontSize: SIZE.H3,
                color: "#646464",
              },
              em: {
                fontSize: SIZE.H3,
                fontStyle: "italic",
                color: "#646464",
              },
              i: {
                fontSize: SIZE.H3,
                fontStyle: "italic",
                color: "#646464",
              },
            }}
            //ignoredStyles={['font-family']}
            html={term}
            imagesMaxWidth={Dimensions.get("window").width}
            onLinkPress={(e, href) => {
              Linking.canOpenURL(href).then((supported) => {
                if (supported) {
                  Linking.openURL(href);
                } else {
                  openUlrBrowser(href);
                }
              });
            }}
          />
        </ScrollView>
        {!this.state.accepted && (
          <DebounceButton
            ref={this.submitBtnRef}
            onPress={this.onAccept}
            title='同意する'
            textStyle={{
              color: "#FFFFFF",
              fontSize: SIZE.H4,
              textAlign: "center",
            }}
            style={{
              backgroundColor: "#06B050",
              marginHorizontal: 12,
              marginBottom: 18,
              height: 50,
              justifyContent: "center",
            }}
          />
        )}
      </Container>
    );
  }
}
