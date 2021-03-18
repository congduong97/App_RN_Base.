import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal'
import { ButtonTypeOne } from '../../../commons';
import { COLOR_BLUE, COLOR_GRAY, COLOR_WHITE } from '../../../const/Color'
import Communications from 'react-native-communications';
import { STRING } from '../util/string'
import { pushResetScreen } from '../../../util';
import { managerAccount } from '../../../const/System';

export class ModalSuccessBirthDayBirthDay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false

        };
    }
    componentDidMount() {
        const { onRef } = this.props
        onRef && onRef(this)
    }
    toggleModal = () => {
        if(this.state.isModalVisible){
            managerAccount.needAddPassword= true
            pushResetScreen(this.props.navigation, 'HomeNavigator');
        }
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    render() {
        const { isModalVisible } = this.state
        if (!isModalVisible) {
            return null
        }
        return (
            <View style={{ flex: 1 }}>
                <Modal isVisible={isModalVisible}>
                    <View style={{ backgroundColor: COLOR_WHITE, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: COLOR_GRAY }}>
                            {'メンバーズカード会員登録時、生年月日の届け出をされていない場合、改めてご登録していただく必要があります。 \nクスリのアオキ各店店頭にて会員登録変更届にご記入いただき、ご提出をお願いいたします。その際、お手元にアオキメンバーズカードをご用意ください。\n※再登録後反映まで1週間～1か月かかります。'}
                        </Text>
                        <ButtonTypeOne name={STRING.ok} onPress={this.toggleModal} style={{ width: '80%' }}></ButtonTypeOne>

                    </View>
                </Modal>
            </View>
        );
    }
}
