
import React, { PureComponent } from 'react';
import Modal from 'react-native-modal';
import { View, TouchableOpacity } from 'react-native';
import { SliderImage } from './Slider';
import { STRING } from '../../../const/String';
import { DEVICE_WIDTH, APP, styleInApp } from '../../../const/System';
import { COLOR_WHITE } from '../../../const/Color';
import { AppImage } from '../../../component/AppImage';
import { ButtonTypeOne } from '../../../commons';
export class ModalSlider extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { visibleModal: false };
    }
    render() {
        const { visibleModal } = this.state;
        if (!visibleModal) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            visibleModal: true
                        });
                    }}
                >
                    <AppImage
                        style={styleInApp.bigImage}
                        url={APP.IMAGE_LOGO}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>

            );
        }
        return (
            <Modal isVisible={visibleModal} style={{}} >
                <View style={{ width: DEVICE_WIDTH - 32, height: DEVICE_WIDTH - 32, backgroundColor: COLOR_WHITE, padding: 8 }}>
                    <SliderImage />

                    <ButtonTypeOne
                        name={STRING.go_back} onPress={() => {
                            this.setState({
                                visibleModal: false
                            });
                        }}
                    />
                </View>
             

            </Modal>
        );
    }

}
