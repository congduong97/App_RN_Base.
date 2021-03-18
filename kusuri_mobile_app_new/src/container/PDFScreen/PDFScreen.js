import React from "react";
import { StyleSheet, View } from "react-native";

import Pdf from "react-native-pdf";
import { HeaderIconLeft } from "../../commons";
import { COLOR_WHITE } from "../../const/Color";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../../const/System";

export default class PdfScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: DEVICE_HEIGHT
    };
  }
  checkPage = (page, numberOfPages) => {
    // console.log(page, numberOfPages);
  };

  render() {
    const source = {
      uri: encodeURI(this.props.navigation.state.params.linkPDF),
      cache: true
    };

    return (
      <View style={styles.container}>
        <HeaderIconLeft goBack={this.props.navigation.goBack} />
        <Pdf
          spacing={0}
          fitWidth
          source={source}
          onLoadComplete={(numberOfPages, filePath, { width, height }) => {
            // console.log("height pdf", height, width, DEVICE_HEIGHT);
            if (numberOfPages == 1) {
              const realHeight = height / (width / DEVICE_WIDTH);
              this.setState({ height: realHeight });
            }
          }}
          onPageChanged={(page, numberOfPages) =>
            this.checkPage(page, numberOfPages)
          }
          onError={error => {}}
          style={[styles.pdf, { height: this.state.height }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE
  },
  pdf: {
    width: "100%",
    height: "50%",
    // flex: 1,
    paddingTop: 0,
    marginTop: 0,
    backgroundColor: COLOR_WHITE
  }
});
