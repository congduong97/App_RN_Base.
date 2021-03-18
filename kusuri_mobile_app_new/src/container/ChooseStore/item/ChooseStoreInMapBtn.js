import React, { PureComponent } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { getHeightInCurrentDevice, getWidthInCurrentDevice } from '../../../const/System'
import Loading from 'react-native-spinkit'

export default class ChooseStoreInMapBtn extends PureComponent {

  constructor() {
    super()
    this.state = {
      visible: false,
      loading: false
    }
  }

  show = () => {
    this.setState({
      visible: true,
      loading: false
    })
  }

  hide = () => {
    this.setState({
      visible: false,
      loading: false
    })
  }

  showLoading = ()=> {
    this.setState({
      loading: true
    })
  }

  hideLoading = ()=> {
    this.setState({
      loading: false
    })
  }

  onPress = () => {
    if (!this.state.loading) {
      this.props.onPress()
    }
  }

  render() {
    return (
      <View style={{
        width: getWidthInCurrentDevice(366),
        height: getHeightInCurrentDevice(42),
        marginTop: getHeightInCurrentDevice(20),
        marginBottom: getHeightInCurrentDevice(20),
        alignSelf: 'center'
      }}>
        {this.state.visible && <TouchableOpacity style={this.props.style} onPress={this.onPress}>
          {this.state.loading ?
            <Loading color="white" type="ThreeBounce" /> :
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>この薬局を選択する</Text>
          }
        </TouchableOpacity>}
      </View>
    )
  }
}