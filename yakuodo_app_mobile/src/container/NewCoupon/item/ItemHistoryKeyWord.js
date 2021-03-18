import React, {PureComponent} from 'react';
import {Icon} from 'native-base';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {
  COLOR_GRAY,
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  COLOR_RED,
} from '../../../const/Color';
export default class ItemHistoryKeyWord extends PureComponent {
  render() {
    const {keyWord, id} = this.props.data;
    const {active} = this.props;
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.itemList,
            {flex: 1, paddingHorizontal: 16, backgroundColor: COLOR_WHITE},
          ]}
          onPress={() => {
            this.props.onPress && this.props.onPress(keyWord);
          }}>
          <Text
            style={{
              flex: 9,
              fontSize: 14,
              color: COLOR_GRAY,
              marginVertical: 16,
            }}>
            {keyWord}
          </Text>
          {active ? (
            <TouchableOpacity
              style={{
                height: '100%',
                width: 50,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
              onPress={() => {
                this.props.onDelete && this.props.onDelete(id);
              }}>
              <Icon
                type={'MaterialCommunityIcons'}
                name={'minus-circle'}
                size={25}
                style={{marginRight: 7, color: COLOR_RED}}
              />
            </TouchableOpacity>
          ) : (
            <Icon
              type={'MaterialCommunityIcons'}
              name="chevron-right"
              size={25}
              style={{marginLeft: 7, color: COLOR_GRAY}}
              color={COLOR_GRAY}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemList: {
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLOR_GRAY_LIGHT,
    paddingRight: 0,
  },
});
