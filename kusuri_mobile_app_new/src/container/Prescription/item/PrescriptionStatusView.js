import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'

import { getHeightInCurrentDevice, getWidthInCurrentDevice } from '../../../const/System'
import { FlatList } from 'react-native-gesture-handler'

export default class PrescriptionStatusView extends PureComponent {

  constructor() {
    super()
    this.itemWidth = getWidthInCurrentDevice(12);
    this.itemHeight = getHeightInCurrentDevice(27); 
  }

  opacityArr = [0.5, 0.5, 0.55, 0.55, 0.6, 0.6, 0.65, 0.65, 0.7, 0.7, 0.75,
    0.75, 0.8, 0.8, 0.85, 0.85, 0.95, 0.95, 1, 1]

  renderItem = ({ item, index }) => {
    let opacity = this.opacityArr[index];
    let backgroundColor = index < (this.props.percent / 5) ? '#06B050' : '#BCBCBC';

    if (index == 0)
      return <View style={{
        width: this.itemWidth, height: this.itemHeight, backgroundColor: backgroundColor, opacity: opacity,
        borderRightWidth: 1, borderRightColor: '#E4E4E4'
      }}></View>

    if (index < 19)
      return <View style={{
        width: this.itemWidth, height: this.itemHeight, backgroundColor: backgroundColor, opacity: opacity,
        borderRightWidth: 1, borderRightColor: '#E4E4E4'
      }}></View>

    return <View style={{ width: this.itemWidth, height: this.itemHeight, backgroundColor: backgroundColor, opacity: opacity }}></View>

  }

  render() {
     
    return (
      <View style={{ ...this.props.containerStyle, marginTop: 20, flexDirection: 'row', justifyContent: 'center', marginLeft: 5 }}>
        <FlatList
          data={this.opacityArr}
          renderItem={this.renderItem}
          extraData={this.props.percent}
          horizontal={true}
          keyExtractor={(item, index) => `${index}`}
        />
        <View style = {{flex: 1}}></View>
        <Text style={{
          color: '#06B050', fontSize: getHeightInCurrentDevice(14), marginRight: 5 }}>{this.props.percent}%</Text>
      </View>
    )
  }
}
