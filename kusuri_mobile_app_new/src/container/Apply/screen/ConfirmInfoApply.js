import React, { PureComponent } from 'react';
import {  StatusBar, StyleSheet, View, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { COLOR_GRAY_LIGHT, COLOR_WHITE, COLOR_GRAY, } from '../../../const/Color';
import { DEVICE_WIDTH } from '../../../const/System';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInputConfirm } from '../item/ItemApplyCoupon/TextInputConfirm';
import { STRING } from '../util/string';
import { ButtonTypeOne, Loading, NetworkError } from '../../../commons';
import { Api } from '../util/api';
import { TextInputAddressConfirm } from '../item/ItemApplyCoupon/TextInputAddressConfirm';
import { CheckBoxGenderConfirm } from '../item/ItemApplyCoupon/CheckBoxGenderConfirm';
import { DatePickerConfirm } from '../item/ItemApplyCoupon/DatePickerConfirm';
import { UpdateInfoApply } from '../util/service';


export default class ConfirmInfoApply extends PureComponent {
    constructor(props) {
        super(props);
        const { email, comfirmEmail, name, yearOld, zipcode, phoneNumber, isGender } = this.props.navigation.state.params;
        this.state = {
            email,
            comfirmEmail,
            showModal: false,
            loading: false,
            isGender,
            name,
            yearOld,
            zipcode: {
                zipCode: zipcode.zipCode,
                city: zipcode.city,
                district: zipcode.district,
                apartmentNumber: zipcode.apartmentNumber
            },
            phoneNumber,
            err: false,
        };
    }

    componentDidMount() {
        // UpdateInfoApply.onChange('ConfirmInfoApply', data => {
        //     const { email, comfirmEmail, isGender, name, yearOld, phoneNumber, zipcode } = data;
        //     this.setState({
        //         email, comfirmEmail, isGender, name, yearOld, phoneNumber, zipcode
        //     });
        // });
    }
    componentWillUnmount() {
        // UpdateInfoApply.unChange('ConfirmInfoApply');
    }
    saveAccount = () => {
        const { email, comfirmEmail, isGender, name, yearOld, phoneNumber, zipcode } = this.state;

        const account = {
            email,
            comfirmEmail,
            phoneNumber,
            yearOld,
            name,
            zipcode,
            isGender,
        };
        // console.log('account', account);
    

        AsyncStorage.setItem('userInfoCoupon', JSON.stringify(account));
        //     Alert.alert(STRING.notification, STRING.use_coupon_email_success);
        //     goBack(null);
        //     this.state.error = false;
        // } else {
        //     this.state.error = true;
    }
    getApi = async () => {
        try {
            const { params } = this.props.navigation.state;
            const response = await Api.getSubmitApplyBanner(params.data.id, params);
            // console.log('submit',response);
            if (response.code === 200 && response.res.status.code === 1000) {
                this.state.err = false;
            }            else {
                this.state.err = true;
            }
        } catch (err) {
            this.state.err = true;
        }        finally {
            if (this.state.err) {
                Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
            } else {
                this.saveAccount();
                const { navigation } = this.props;

                navigation.navigate('HOME');

                Alert.alert(
                    STRING.notification,
                    STRING.apply_success
                );
            }
        }
    }
    renderName = () => {
        const { name } = this.state;
        if (!name) {
            return null;
        }
        return (
            <TextInputConfirm
                valueDefault={name}
                typeIcon={'MaterialCommunityIcons'}
                nameIcon={'account'} name={STRING.name}
            />
        );
    }
    renderBirthday = () => {
        const { yearOld } = this.state;
        if (!yearOld) {
            return null;
        }
        return (
            <DatePickerConfirm
                name={STRING.birth_day}
                dateInit={yearOld}
            />
        );
    }
    renderSex = () => {
        const { isGender } = this.state;
        if (!isGender) {
            return null;
        }
        return (
            <CheckBoxGenderConfirm
                valueDefault={isGender}
            />
        );
    }
    renderPhone = () => {
        const { phoneNumber } = this.state;
        if (!phoneNumber) {
            return null;
        }
        return (

            <TextInputConfirm
                nameIcon={'phone'}
                typeIcon={'Entypo'}
                name={STRING.tel}
                keyboardType={'number-pad'}
                onRef={ref => this.phoneNumber = ref}
                valueDefault={phoneNumber}
            />
        );
    }
    renderEmail = () => {
        const { email } = this.state;
        if (!email) {
            return null;
        }
        return (
            <TextInputConfirm
                nameIcon={'email'}
                typeIcon={'MaterialCommunityIcons'}
                valueDefault={email}
                name={STRING.email}

            />
        );
    }
    renderEmailConfirm = () => {
        const { comfirmEmail } = this.state;
        if (!comfirmEmail) {
            return null;
        }
        return (
            <TextInputConfirm
                nameIcon={'email'}
                typeIcon={'MaterialCommunityIcons'}
                name={STRING.comfirm_email}
                valueDefault={comfirmEmail}
            />
        );
    }
    renderContent = () => {
        const { loadingDataOld, loading, zipcode, err } = this.state;
        if (loadingDataOld) return <Loading />;
        if (err) return (<NetworkError onPress={this.getApi} />);
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                extraHeight={150}
                enableOnAndroid
                style={styles.wrapperContainer}
            >


                <View style={styles.wrapperCenter}>


                    <View style={{ backgroundColor: COLOR_WHITE, flex: 1, padding: 16, width: DEVICE_WIDTH }}>
                        <View style={styles.wrapperBody}>

                            {/*email*/}
                            <Text style={{ color: COLOR_GRAY, fontSize: 16, lineHeight: 30, marginVertical: 16 }}>{STRING.please_review_the_information}</Text>
                            {this.renderName()}
                            {this.renderBirthday()}
                            {this.renderSex()}


                            <TextInputAddressConfirm zipcode={zipcode} />
                            {this.renderPhone()}
                            {this.renderEmail()}
                            {this.renderEmailConfirm()}
                            <ButtonTypeOne
                                style={{ marginTop: 50 }}
                                loading={loading}
                                name={STRING.send} onPress={this.getApi}
                            />


                        </View>

                    </View>
                </View>
            </KeyboardAwareScrollView>

        );
    }


    render() {
        const { navigation, disableBackButton } = this.props;
        const { id } = this.props.navigation.state.params.data;
        // console.log('data', id);
        return (

            <View style={styles.wrapperContainer}>
                <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
                <HeaderIconLeft
                    disableBackButton={disableBackButton}
                    title={''}
                    goBack={navigation.goBack}
                    imageUrl={false}
                />
                {this.renderContent()}

            </View>
        );
    }
}
const styles = StyleSheet.create({
    wrapperContainer: {
        backgroundColor: COLOR_WHITE,
        flex: 1
    },
    wrapperCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    }
});
