import React, {Component} from 'react'
import { View, Text, Image } from 'react-native'

import { SIZE } from '../../../const/size'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default class UserCard extends Component {

  render() {
    return (
      <View style = {{width: '100%', height: SIZE.height(9.6), flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 17.5,
      borderBottomColor : 'red', borderBottomWidth: 1}}>
        <Image style = {{width: 42, height: 49}} source = {require('../../../images/AppIcon3x.png')} resizeMode = {"contain"}/>
        <Text style = {{fontSize: 16, color: '#1F1F20', marginLeft: 15, flex: 1}}>青木　太郎</Text>
        <TouchableOpacity
          style = {{width: SIZE.width(24), height: SIZE.height(5.4), backgroundColor: '#06B050', borderRadius: 3,
           justifyContent: 'center', alignItems: 'center'}}
          onPress = {()=> {

          } }
        >
          <Text style = {{fontSize: 12, color: 'white'}}>ユーザー 登録・切替</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
