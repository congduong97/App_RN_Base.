import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal'
import { ButtonTypeOne } from '../../../commons';
import { COLOR_BLUE ,COLOR_GRAY, COLOR_WHITE} from '../../../const/Color'
import Communications from 'react-native-communications';
import {STRING} from '../util/string'

export  class ModalErrorBirthDay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false

        };
    }
    componentDidMount(){
        const{onRef} = this.props
        onRef && onRef(this)
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
      };
    
    render() {
        const { isModalVisible} = this.state
        if(!isModalVisible){
            return null
        }
        return (
            <View style={{ flex: 1 }}>
                <Modal isVisible={isModalVisible}>
                    <View style={{backgroundColor:COLOR_WHITE ,padding:16,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:COLOR_GRAY}}>
                            {`お届け頂いているお客様の情報と一致しません。大変申し訳ありませんが、セキュリティ保持の観点から現在、本アプリのご利用を停止しております。\n`}
                            {` \n`}
                            {'お手数ですが、コールセンター'}
                            <Text onPress={() => Communications.phonecall('0120-212-132', true)} style={{ color: COLOR_BLUE,textDecorationLine: 'underline' }}>{'0120-212-132'}</Text>
                            {`（平日10時～17時半）へお問い合わせいただくか、クスリのアオキ各店店頭にて会員登録変更届のご提出をお願いいたします。その際、お手元にアオキメンバーズカードをご用意ください。\n`}
                            {` \n`}
                            {'※再登録後反映まで1週間～1か月かかります。  '}
                        </Text>
                        <ButtonTypeOne  name={STRING.back} onPress={this.toggleModal} style={{ width: '80%' }}></ButtonTypeOne>

                    </View>
                </Modal>
            </View>
        );
    }
}
