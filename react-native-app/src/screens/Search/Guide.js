import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Color, Font} from '../../commons/constants';

const Guide = (props) => {
  return (
    props.showGuide && (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
        style={styles.content}>
        <View style={styles.guide}>
          <Text style={styles.guideTitle}>Tìm kiếm sim</Text>
          <Text style={styles.guideText}>- Tìm sim có số 6789 hãy gõ 6789</Text>
          <Text style={styles.guideText}>
            - Tìm sim có đầu số 090 đuôi 8888 bạn hãy gõ 090*8888
          </Text>
          <Text style={styles.guideText}>
            - Tìm sim có đầu số 0914 đuôi bất kì bạn hãy gõ 0914*
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  );
};

export default Guide;

const styles = StyleSheet.create({
  content: {},
  guide: {padding: 10, backgroundColor: Color.HomeColor, flex: 1},
  guideTitle: {
    fontSize: 18,
    fontFamily: Font.FiraSansRegular,
    paddingBottom: 10,
  },
  guideText: {
    paddingHorizontal: 5,
    color: Color.colorText,
    fontSize: 16,
    fontFamily: Font.FiraSansRegular,
  },
});
