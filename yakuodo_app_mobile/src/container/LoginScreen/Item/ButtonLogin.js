import {
    TouchableOpacity, View, Image, Text, StyleSheet
} from 'react-native';
import React, { PureComponent } from 'react';
import { APP_COLOR, COLOR_BROWN } from '../../../const/Color';
import Spinner from 'react-native-spinkit';
import { Button } from 'native-base';

export class ButtonLogin extends PureComponent {
    click = () => {
        const { loadingLogin, onPress } = this.props;

        if (!loadingLogin) {
            onPress();

        }
    }
    render() {
        const { style, loadingLogin, onPress, name, activeOpacity, styleText } = this.props;


        return (
            <TouchableOpacity
                // activeOpacity={APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1}
                activeOpacity={activeOpacity || 0.5}

                style={[
                    styles.wrapperBottomButton,
                    styles.wrapperCenter,
                    { backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 },
                    style
                ]}
                onPress={this.click}
            >
                {loadingLogin
                    ?
                    <Spinner color={this.props.styleText && this.props.styleText.color || APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1} type={'ThreeBounce'} />
                    :
                    <Text
                        // info
                        style={[{
                            color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1,
                            fontSize: 16,
                            fontWeight: 'bold',
                        }, styleText]}
                    >{name}</Text>
                }
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({

    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    wrapperBottomButton: {
        width: '100%',
        backgroundColor: COLOR_BROWN,
        height: 40,
        borderRadius: 5,
    },


});
