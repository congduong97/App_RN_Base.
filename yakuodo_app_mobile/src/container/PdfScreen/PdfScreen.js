import React from 'react';
import {StyleSheet, View} from 'react-native';

import Pdf from 'react-native-pdf';
import {HeaderIconLeft} from '../../commons';
import {COLOR_WHITE} from '../../const/Color';
import {DEVICE_WIDTH} from '../../const/System';

export default class PdfScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '100%',
    };
  }

  render() {
    const source = {
      uri: encodeURI(this.props.navigation.state.params.linkPDF),
      cache: true,
    };

    return (
      <View style={styles.container}>
        <HeaderIconLeft goBack={this.props.navigation.goBack} />

        <Pdf
          spacing={0}
          source={source}
          onLoadComplete={(numberOfPages, filePath, {width, height}) => {
            if (numberOfPages == 1) {
              this.setState({height: DEVICE_WIDTH * (16 / 11)});
            }
          }}
          //   onPageChanged={(page, numberOfPages) => {}}
          //   onError={error => {}}
          style={[styles.pdf, {height: this.state.height}]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  pdf: {
    width: '100%',
    height: '50%',
    paddingTop: 0,
    backgroundColor: COLOR_WHITE,
  },
});
