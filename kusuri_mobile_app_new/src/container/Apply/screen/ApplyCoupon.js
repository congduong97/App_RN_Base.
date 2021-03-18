import React, { PureComponent } from 'react';
import { StatusBar, StyleSheet, View, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { DEVICE_WIDTH } from '../../../const/System';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from '../item/ItemApplyCoupon/TextInput';
import { Validate } from '../util/validate';
import { STRING } from '../util/string';
import {COLOR_WHITE} from '../../../const/Color';
import { ButtonTypeOne, Loading, NetworkError } from '../../../commons';
import { Api } from '../util/api';
import { TextInputAddress } from '../item/ItemApplyCoupon/TextInputAddress';
import { CheckBoxGender } from '../item/ItemApplyCoupon/CheckBoxGender';
import { CheckBoxAgree } from '../item/ItemApplyCoupon/CheckBoxAgree';
import { DatePicker } from '../item/ItemApplyCoupon/ DatePicker';
import { UpdateInfoApply } from '../util/service';

export default class ApplyCoupon extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            comfirmEmail: '',
            showModal: false,
            loading: true,
            errorEmail: true,
            errorComfirmEmail: true,
            error: false,
            isGender: 1,
            name: '',
            yearOld: 0,
            zipcode: {
                zipCode: null,
                city: null,
                district: null,
                apartmentNumber: null
            },
            phoneNumber: null,
            isAgree: false,
            visibleName: true,
            requireName: true,
            visibleBirthday: true,
            requireBirthday: true,
            visibleZipcode: true,
            requireZipcode: true,
            visibleCity: true,
            requireCity: true,
            visibleDistrict: true,
            requireDistrict: true,
            visibleApartmentNumber: true,
            requireApartmentNumber: true,
            visiblePhoneNumber: true,
            requirePhoneNumber: true,
            visibleEmail: true,
            requireEmail: true,
            visibleEmailConfirm: true,
            requireEmailConfirm: true,
            visibleGender: true,
            visibleTermOfUse: true,
            requireTermOfUse: true,
            error: false,
            linkTermsOfUse:'',

        };
    }
   
    componentDidMount(){
        this.getApi();

    }
    getApi = async () => {
        
        try {
            const { id } = this.props.navigation.state.params.data;
            const response = await Api.getConfigFieldsApply(id);
            if (response.code === 200) {
                const
                    {
                        hasName, hasGender, hasBirthday, hasZipCode, hasCity, hasDistrict,
                        hasHomeAddress, hasPhoneNumber, hasEmail, hasConfirmEmail, hasTermsOfUse,
                        requiredName, requiredGender, requiredBirthday, requiredZipCode,
                        requiredCity, requiredDistrict, requiredHomeAddress, requiredPhoneNumber,
                        requiredEmail, requiredConfirmEmail, requiredTermsOfUse, linkTermsOfUse
                    } = response.res
                this.state.visibleName = hasName;
                this.state.requireName = requiredName;
                if(!hasGender){
                    this.state.isGender = 0
                }
                else{
                    this.state.visibleGender = hasGender;
                }
                this.state.requiredGender = requiredGender;
                this.state.visibleBirthday = hasBirthday;
                this.state.requiredBirthday = requiredBirthday;
                this.state.zipcode = hasZipCode;
                this.state.requiredZipCode = requiredZipCode;
                this.state.visibleCity = hasCity;
                this.state.requiredCity = requiredCity;
                this.state.visibleDistrict = hasDistrict;
                this.state.requiredDistrict = requiredDistrict;
                this.state.visibleApartmentNumber = hasHomeAddress;
                this.state.requiredHomeAddress = requiredHomeAddress;
                this.state.hasPhoneNumber = hasPhoneNumber;
                this.state.requiredPhoneNumber = requiredPhoneNumber;
                this.state.visibleEmail = hasEmail;
                this.state.requiredEmail = requiredEmail;
                this.state.visibleEmailConfirm = hasConfirmEmail;
                this.state.requiredConfirmEmail = requiredConfirmEmail;
                this.state.visibleTermOfUse = hasTermsOfUse;
                this.state.requiredTermsOfUse = requiredTermsOfUse;
                this.state.linkTermsOfUse=linkTermsOfUse;
               await this.checkUser()
               this.state.error=false
            }
            else{
                this.state.error=true
            }
        }
        catch (error) {
            this.state.error = true;
          
        }finally{

            this.setState({loading:false})
        }
    }
    async checkUser() {
        try {
            
            const userInfoCoupon =  await AsyncStorage.getItem('userInfoCoupon')
        if (userInfoCoupon) {
            const { 
                email,
                comfirmEmail,
                phoneNumber,
                yearOld,
                name,
                zipcode,
                isGender
            } = JSON.parse(userInfoCoupon);
            const { 
                visibleEmail, visibleApartmentNumber, visibleBirthday, visibleCity, visibleDistrict, visibleEmailConfirm, 
                visibleName, visiblePhoneNumber, visibleGender, visibleZipcode
             } = this.state;

            if (visibleEmail && email) {
                // alert(email)
                this.state.email = email;
            }

            if (visibleBirthday && yearOld) {
                this.state.yearOld = yearOld;
            }
            this.state.zipcode= zipcode
            if (!visibleCity) {
                this.state.zipcode.city = null
            }


            if (!visibleApartmentNumber) {

                this.state.zipcode.apartmentNumber = null;


            }
            if (!visibleZipcode) {
                this.state.zipcode.zipCode = null
            }
            if (!visibleDistrict) {
                this.state.zipcode.district = null
            }
            if (visibleEmailConfirm && comfirmEmail) {
                this.state.comfirmEmail = comfirmEmail;
            }
            if (visibleName && name) {
                this.state.name = name;
            }
            if (visiblePhoneNumber && phoneNumber) {
                this.state.phoneNumber = phoneNumber;
            }
            if (visibleGender && isGender) {
                this.state.isGender = isGender;
            }
            // console.log('this.state',this.state)
        }
            
        } catch (error) {
            
        }
        
    }


    saveAccount = async () => {
        try {
            this.setState({ loading: true });
            const { comfirmEmail, email, isAgree, phoneNumber, zipcode, yearOld, name, isGender, visibleApartmentNumber,
                 visibleBirthday, visibleCity, visibleDistrict, visibleEmail, visibleEmailConfirm, 
                 visibleName, visiblePhoneNumber, visibleGender, visibleZipcode, requireApartmentNumber, 
                 requireBirthday, requireCity, requireDistrict, requireEmail, requireEmailConfirm, 
                 requireName, requirePhoneNumber, requireZipcode, requireTermOfUse, visibleTermOfUse } = this.state;
            const { goBack, navigate } = this.props.navigation;
            let checkName = false;
            let checkBrithDay = false;
            let checkZipCode = false;
            let checkCity = false;
            let checkDistrict = false;
            let checkApartmentNumber = false;
            let checkPhone = false;
            let checkEmail = false;
            let checkEmailConfirm = false;
            let checkIsAgree = false;

            if ((requireTermOfUse && isAgree) || !visibleTermOfUse || !requireTermOfUse) {
                checkIsAgree = true;
            }

            if ((requireName && name) || !visibleName || !requireName) {
                checkName = true;
            }
            if (requireEmail || email) {
                const validateEmail = Validate.emailFormat(email, requireEmail).error;

                if (!validateEmail) {
                    checkEmail = true;
                }
            } else if (!visibleEmail || (visibleEmail && !email)) {
                checkEmail = true;
            }

            if ((requireBirthday && yearOld) || !visibleBirthday) {
                checkBrithDay = true;
            }
            if (requireZipcode || zipcode) {
                const responseZipCode = await Api.getAddressFromZipCode(zipcode.zipCode);
                if (responseZipCode.code === 200 && responseZipCode.res.status.code === 1000) {
                    checkZipCode = true;
                }
            } else if (!visibleZipcode || (visibleZipcode && !zipcode && !requireZipcode)) {
                checkZipCode = true;
            }

            if ((requireCity && zipcode.city) || !visibleCity) {
                checkCity = true;
            }
            if ((requireDistrict && zipcode.district) || !visibleDistrict) {
                checkDistrict = true;
            }
            if ((requireApartmentNumber && zipcode.apartmentNumber) || !visibleApartmentNumber) {
                checkApartmentNumber = true;
            }
            if ((requirePhoneNumber && phoneNumber) || !visibleApartmentNumber) {
                checkPhone = true;
            }
            if (requireEmailConfirm || comfirmEmail) {
                if (comfirmEmail === email) {
                    checkEmailConfirm = true;
                }
            } if (!visibleEmailConfirm || (visibleEmail && !comfirmEmail && !requireEmail)) {
                checkEmailConfirm = true;
            }


            if (checkName && checkBrithDay && checkZipCode && checkCity && checkDistrict && checkApartmentNumber && checkPhone && checkEmail && checkIsAgree) {
                const { navigation } = this.props;
                navigate('ConfirmInfoApply', { email, comfirmEmail, name, yearOld, zipcode, phoneNumber, isGender ,data:navigation.state.params.data});

            } else {
                Alert.alert(STRING.checkFormApply);
                // console.log('checkName', checkName);
                // console.log('checkBrithDay', checkBrithDay);
                // console.log('checkZipCode', checkZipCode);
                // console.log('checkCity', checkCity);
                // console.log('checkDistrict', checkDistrict);
                // console.log('checkApartmentNumber', checkApartmentNumber);
                // console.log('checkPhone', checkPhone);
                // console.log('checkEmail', checkEmail);
                // console.log('checkEmailConfirm', checkEmailConfirm);
                // console.log('isAgree', isAgree);
                if (!checkEmail) {
                    this.email.checkData();
                }
                if (!checkEmailConfirm) {
                    this.comfirmEmail.checkData();
                }
                if (!isAgree) {
                    this.isAgree.checkData();
                }
                if (!checkName) {
                    this.name.checkData();
                }
                if (!checkPhone) {
                    this.phoneNumber.checkData();
                }
                if (!checkBrithDay) {
                    this.yearOld.checkData();
                }
                if (!checkZipCode) {
                    this.zipcode.checkData();
                }
            }
        } catch (error) {
            
            this.state.error = true;
        } finally {
            if (this.state.error) {
                Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
            }
            this.setState({ loading: false });
        }
    }
    renderName = () => {
        const { visibleName, requireName, name } = this.state;
        if (!visibleName) {
            return null;
        }
        return (
            <TextInput
                nobyEmpty={requireName}
                valueDefault={name}
                typeIcon={'MaterialCommunityIcons'}
                nameIcon={'account'} name={STRING.name}
                onRef={ref => this.name = ref}
                validate={() => Validate.checkDefault(this.state.name, requireName)}
                changeDataParent={(value) => { this.state.name = value; }}
                onStatusError={(value) => { this.state.errorName = value; }}
            />
        );
    }
    renderBirthday = () => {
        const { requireBirthday, visibleBirthday, yearOld } = this.state;
        if (!visibleBirthday) {
            return null;
        }
        return (
            <DatePicker
                name={STRING.birth_day}
                noByEmpty={requireBirthday}
                dateInit={yearOld}
                onRef={ref => this.yearOld = ref}
                selectedDate={date => (this.state.yearOld = date)}
                onStatusError={item => (this.state.errorYearOld = item)}
            />
        );
    }
    renderSex = () => {
        const { visibleGender, isGender } = this.state;
        if (!visibleGender) {
            return null;
        }
        return (

            <CheckBoxGender
                changeDataParent={(value) => { this.state.isGender = value; }}
                valueDefault={isGender}
            />
        );
    }
    renderPhone = () => {
        const { visiblePhoneNumber, phoneNumber, requirePhoneNumber,linkTermsOfUse } = this.state;
        if (!visiblePhoneNumber) {
            return null;
        }
        return (

            <TextInput
                nobyEmpty={requirePhoneNumber}
                nameIcon={'phone'}
                typeIcon={'Entypo'}
                name={STRING.tel}
                keyboardType={'number-pad'}
                onRef={ref => this.phoneNumber = ref}
                valueDefault={phoneNumber}
                validate={() => Validate.checkDefault(this.state.phoneNumber, requirePhoneNumber)}
                changeDataParent={(value) => { this.state.phoneNumber = value; }}
                onStatusError={(value) => { this.state.errorPhoneNumber = value; }}
            />
        );
    }
    renderEmail = () => {
        const { visibleEmail, email, requireEmail } = this.state;
        if (!visibleEmail) {
            return null;
        }
        return (
            <TextInput
                nobyEmpty={requireEmail}
                nameIcon={'email'}
                typeIcon={'MaterialCommunityIcons'}
                valueDefault={email}
                name={STRING.email}
                onRef={ref => this.email = ref}
                validate={() => Validate.emailFormat(this.state.email, requireEmail)}
                changeDataParent={(value) => { this.state.email = value; }}
                onStatusError={(value) => { this.state.errorEmail = value; }}
            />
        );
    }
    renderEmailConfirm = () => {
        const { visibleEmailConfirm, comfirmEmail, requireEmailConfirm } = this.state;
        if (!visibleEmailConfirm) {
            return null;
        }
        return (
            <TextInput
                nobyEmpty={requireEmailConfirm}
                onRef={ref => this.comfirmEmail = ref}
                nameIcon={'email'}
                typeIcon={'MaterialCommunityIcons'}
                name={STRING.comfirm_email}
                valueDefault={comfirmEmail}
                validate={() => Validate.checkEmailConfirm(this.state.comfirmEmail, this.state.email, requireEmailConfirm)}
                changeDataParent={(value) => { this.state.comfirmEmail = value; }}
                onStatusError={(value) => { this.state.errorComfirmEmail = value; }}
            />
        );
    }
    renderCheckBoxAgree = () => {
        const { visibleTermOfUse, requireTermOfUse,linkTermsOfUse } = this.state;
        if (!visibleTermOfUse) {
            return null;
        }
        return (
            <CheckBoxAgree
                navigation={this.props.navigation}
                link={linkTermsOfUse}
                requireTermOfUse={requireTermOfUse}
                onRef={ref => this.isAgree = ref}
                changeDataParent={(value) => { this.state.isAgree = value; }}
            />
        );
    }
    go=()=>{
        
        this.renderContent();
       
    }
    renderContent = () => {
        const { zipcode, loading,error, requireCity, requireDistrict, requireZipcode, visibleZipcode, visibleDistrict, visibleCity, visibleApartmentNumber, requireApartmentNumber } = this.state;
        if (loading) return (<Loading />);
       if(error) return(<NetworkError />);
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
                            <Text style={{ color: COLOR_GRAY, fontSize: 16, lineHeight: 30, marginVertical: 16 }}>{STRING.please_enter_your_email}</Text>
                            {this.renderName()}
                            {this.renderBirthday()}
                            {this.renderSex()}
                            <TextInputAddress
                                onRef={ref => this.zipcode = ref}
                                valueDefault={zipcode}
                                visibleCity={visibleCity}
                                visibleDistrict={visibleDistrict}
                                visibleZipcode={visibleZipcode}
                                requireZipcode={requireZipcode}
                                requireDistrict={requireDistrict}
                                requireCity={requireCity}
                                visibleApartmentNumber={visibleApartmentNumber}
                                requireApartmentNumber={requireApartmentNumber}
                                changeDataParent={(value) => { this.state.zipcode = value; }}
                            />
                            {this.renderPhone()}
                            {this.renderEmail()}
                            {this.renderEmailConfirm()}
                            {this.renderCheckBoxAgree()}
                            <ButtonTypeOne
                                style={{ marginTop: 50 }}
                                loading={loading}
                                name={STRING.send} onPress={this.saveAccount}
                            />
                        </View>

                    </View>
                </View>
            </KeyboardAwareScrollView>

        );
    }


    render() {
        const { navigation, disableBackButton } = this.props;
        const { data } = this.props.navigation.state.params;
        const { id } = this.props.navigation.state.params.data;
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
