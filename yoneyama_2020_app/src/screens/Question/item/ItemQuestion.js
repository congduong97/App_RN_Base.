//Lybrary:
import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

//Setup:
import {COLOR, SIZE} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppText} from '../../../elements/AppText';

export class ItemQuestion extends PureComponent {
  render() {
    const {question} = this.props.data;
    const {navigation, index, detail, inDetail, nameScreen} = this.props;
    return (
      <TouchableOpacity
        disabled={detail ? true : false}
        style={{
          minHeight: SIZE.width(15),
          padding: SIZE.width(1),
          width: SIZE.width(100),
          flexDirection: 'row',
          paddingLeft: SIZE.width(2),
          alignItems: 'center',
          textAlignVertical: 'center',
          marginTop: index == 0 ? 0 : SIZE.width(1),
          backgroundColor: COLOR.white,
          borderTopWidth: 1,
          borderTopColor:
            index == 0 || inDetail ? COLOR.white : COLOR.COLOR_GRAY_300,
          borderBottomWidth: 1,
          borderBottomColor: COLOR.COLOR_GRAY_300,
        }}
        onPress={() => {
          if (!detail) {
            navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
              screen: keyNavigation.QUESTION_DETAIL,
              params: {item: this.props.data, index: index, name: nameScreen},
            });
          }
        }}>
        <AppText style={[styles.textOrder, {fontSize: 16, color: COLOR.red}]}>
          Q{index + 1}
          <AppText style={[styles.textOrder, {color: COLOR.red}]}>.</AppText>
        </AppText>
        <View
          style={{
            width: SIZE.width(80),
            justifyContent: 'center',
            marginLeft: SIZE.width(2),
          }}>
          <AppText style={{fontSize: 15}}>{question}</AppText>
        </View>
        <View>
          {detail ? null : (
            <Icons
              name="chevron-right"
              size={25}
              style={{marginLeft: 2}}
              color={COLOR.COLOR_GRAY_700}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  textOrder: {
    fontSize: 14,
    textAlign: 'center',
  },

  wrapperContainer: {
    padding: 5,
    backgroundColor: COLOR.white,
    flexDirection: 'row',
    paddingLeft: 15,
    borderColor: COLOR.COLOR_GRAY_300,
    alignItems: 'center',
    textAlignVertical: 'center',
    borderBottomWidth: 1,
  },
});
