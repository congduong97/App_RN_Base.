import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import { isIOS } from '../../../const/System'

export default class CustomAlert extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: ''
    }
  }

  show = (text) => {
    if (isIOS) {
      Alert.alert(text)
    } else {
      this.setState({
        visible: true,
        title: text
      })
    }
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        animationIn='fadeIn'
        animationOut='fadeOut'
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={{ padding : 20, backgroundColor: 'white', minHeight: heightPercentageToDP(30) }}>
          <Text style={{flex: 1, color : '#1C1C1C', fontWeight: 'bold', fontSize: 18 }}>{this.state.title}</Text>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={this.hide}
            hitSlop = {{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style = {{fontWeight: 'bold', color: 'green', fontSize: 18}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
} 