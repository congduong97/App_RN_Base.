import React, { PureComponent } from 'react';
import Spinner from 'react-native-spinkit';
import { TouchableOpacity, Text, Alert, StyleSheet, View } from 'react-native';

import { STRING } from '../util/string';
import { DEVICE_WIDTH } from '../../../const/System';

import { COLOR_BROWN, COLOR_WHITE, APP_COLOR } from '../../../const/Color';

import { Api } from '../util/api';
export class UseCoupon extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadingUseCoupon: false
        };
    }


    useCoupon = async () => {
        try {
            this.setState({ loadingUseCoupon: true });
            const { upDate, } = this.props;
            const response = await Api.getUseCoupon(this.props.navigation.state.params.item.id, this.props.navigation.state.params.item.turningId);
            // console.log('responseusse', response);
            if (response.code === 200 && response.res.status.code == 1000) {
                upDate(true);
            } else {
                Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
            }
        } catch (err) {
            // console.log('err', err);
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        } finally {
            this.setState({ loadingUseCoupon: false });
        }
    }
    checkUseCoupon = () => {
        if (!this.props.used) {
            Alert.alert(
                STRING.are_you_sure_you_want_to_use_coupon,
                '',
                [
                    {
                        text: STRING.cancel,
                        onPress: () => { },
                        style: 'cancel'
                    },
                    { text: STRING.ok, onPress: () => this.useCoupon() },
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        const { loadingUseCoupon, } = this.state;
        const { used } = this.props;
        return (
            <View>


                <TouchableOpacity
                    onPress={() => {
                        this.checkUseCoupon();
                    }}

                    activeOpacity={0.8}
                    style={[styles.buttonBottom,
                    { backgroundColor: used ? `${APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1}50` : APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 }]}

                >
                    {
                        loadingUseCoupon
                            ?
                            <Spinner color={COLOR_WHITE} type={'ThreeBounce'} />
                            :
                            <Text
                                style={[styles.textButton,
                                { color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1 }]}
                            >{!used ? STRING.use_now : STRING.used}
                            </Text>
                    }
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonBottom: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        borderRadius: 3,
        width: DEVICE_WIDTH - 32,
        height: 45,
        backgroundColor: COLOR_BROWN,
        margin: 16,
    },

});
