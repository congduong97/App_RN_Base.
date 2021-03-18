import React, { Component } from 'react';
import { View, Text, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import { AppImage } from '../../../component/AppImage';
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../../../const/System'
import { Icon } from 'native-base'
import { COLOR_GRAY, COLOR_BLACK } from '../../../const/Color';
import { Loading } from '../../../commons';
import CountDown from '../CountUp';
export default class ModalBarCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false

    };
  }
  componentDidMount() {
    const { onRef } = this.props
    onRef && onRef(this)
  }
  setVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }
  getHeightBarCode = () => {
    return this.getWidthBarCode() * (8 / 35)

  }
  getWidthBarCode = () => {
    if (DEVICE_HEIGHT - 100 > 450) {
      return 450

    }

    return DEVICE_HEIGHT - 100

  }

  render() {
    const { url, memberCode, loading, getUserDetail, accessTime } = this.props
    return (
      <Modal
        animationType="slide"
        transparent={false}

        visible={this.state.modalVisible}
        onRequestClose={() => {
        }}
      >
        <SafeAreaView></SafeAreaView>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, }}>


          <View style={{
            transform: [
              { rotate: '90deg' },
            ],
            justifyContent: 'center',
            alignItems: 'center'

          }}>
            <View style={{ height: 50 }}>

            </View>
            <CountDown
              style={{ color: COLOR_BLACK, fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}
              until={new Date(accessTime).getTime()}
            ></CountDown>
            {loading ?
              <View style={{ width: this.getWidthBarCode(), height: this.getHeightBarCode(), justifyContent: 'center', alignItems: 'center' }}>
                <Loading></Loading>

              </View> :
              <AppImage resizeMode={'cover'} style={{
                width: this.getWidthBarCode(), height: this.getHeightBarCode(),
              }} url={url} ></AppImage>
            }




            <Text style={{
              fontWeight: 'bold', fontSize: 18, marginTop: 10

            }}>{memberCode}</Text>
            <View style={{ height: 50, }}>
              {loading ?
                <Loading></Loading>
                :
                <TouchableOpacity
                  onPress={getUserDetail}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, }}>
                  <Text>{'バーコードを更新'}</Text>
                  <Icon   onPress={getUserDetail} name={'reload'} type={'SimpleLineIcons'} style={styles.icon}></Icon>

                </TouchableOpacity>

              }
            </View>





          </View>
          <Icon style={{ position: 'absolute', bottom: 10, right: 10 }} onPress={this.setVisible} name={'close'} type={'AntDesign'}></Icon>




        </View>
        <SafeAreaView></SafeAreaView>

      </Modal>

    );
  }
}
const styles = {
  icon: {
    color: COLOR_GRAY, fontSize: 16, marginLeft: 10, marginTop: 2,
  }
}
