import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from './TextInput';
import { STRING } from '../../util/string';
import { Validate } from '../../util/validate';
import { APP_COLOR, COLOR_GRAY, COLOR_RED } from '../../../../const/Color';
import { Api } from '../../util/api';


export class TextInputAddress extends PureComponent {
    constructor(props) {
        super(props);
        let value3 = '';
        let value4 = '';
        let valueDistrict = '';
        let valueCity = '';
        let valueApartmentNumber = '';

        const { valueDefault } = this.props;
        if (valueDefault) {
            const { zipCode, district, city, apartmentNumber } = valueDefault;

            if (zipCode) {
                const arrayZipcode = zipCode.split('-');
                value3 = arrayZipcode[0];
                value4 = arrayZipcode[1];
            }
            if (district) {
                valueDistrict = district;
            }
            if (city) {
                valueCity = city;
            }
            if (apartmentNumber) {
                valueApartmentNumber = apartmentNumber;
            }
        }
        this.state = {
            value3,
            value4,
            city: valueCity,
            district: valueDistrict,
            apartmentNumber: valueApartmentNumber
        };
    }
    componentDidMount() {
        const { onRef } = this.props;
        onRef(this);
    }
    changeTextAddress = () => {
        const { changeDataParent } = this.props;
        const { city, district, apartmentNumber, value3, value4 } = this.state;
        const zipCode = `${value3}-${value4}`;
        changeDataParent({ zipCode, district, apartmentNumber, city });
    }
    checkData = () => {
        const { value3, value4, address } = this.state;
        const { visibleCity, visibleDistrict, visibleApartmentNumber } = this.props;

        if (value3.length === 3 && value4.length === 4) {
            this.checkValueZipCode();
        } else {
            this.input3.checkData();
            this.input4.checkData();
        }
        if (visibleCity) {
            this.city.checkData();
        }
        if (visibleDistrict) {
            this.district.checkData();
        }
        if (visibleApartmentNumber) {
            this.apartmentNumber.checkData();
        }
    };
    checkValueZipCode = async () => {
        const { value3, value4, city, district, apartmentNumber } = this.state;
        const { changeDataParent, requireZipcode } = this.props;
        if (value3.length === 3 && value4.length === 4) {
            try {
                const zipCode = `${value3}-${value4}`;
                changeDataParent({ zipCode, city, district, apartmentNumber });
                const response = await Api.getAddressFromZipCode(zipCode);
                // console.log('response', response);
                if (response.code === 200 && response.res.status.code === 1000) {
                    const nameCity = response.res.data.city.name;
                    const nameDistrict = response.res.data.district.name;
                    if (!city) {
                        this.state.city = nameCity;
                        this.city.setData(nameCity);
                    }
                    if (!district) {
                        this.state.district = nameDistrict;

                        this.district.setData(nameDistrict);
                    }
                    changeDataParent({ zipCode, city: nameCity, district: nameDistrict, apartmentNumber });

                    this.setState({
                        errorZipCode: false
                    });
                } else if (response.code === 200 && response.res.status.code === 1013) {
                    this.setState({ errorZipCode: true });
                    this.input3.setErrorr();
                    this.input4.setErrorr();
                }
            } catch (error) {
                this.setState({ errorZipCode: false });
            }
        }
        if (!requireZipcode && !value3 && !value4) {
            this.setState({ errorZipCode: false });
        }
    }
    changeData3 = (value) => {
        this.state.value3 = value;
        this.checkValueZipCode();
        if (value && value.length === 3) {
            this.input4.textInput._root.focus();
        }
    }
    changeData4 = (value) => {
        this.state.value4 = value;
        this.checkValueZipCode();
        if (!value) {
            this.input3.textInput._root.focus();
        }
    }
    renderErrorZipcode = () => {
        const { errorZipCode } = this.state;
        if (errorZipCode) {
            return (
                <View >
                    <Text style={{ color: COLOR_RED, }}>
                        {STRING.cannot_find_zip_code}
                    </Text>
                </View>
            );
        }
        return null;
    }
    renderErrorAddress = () => {
        const { errorAdress } = this.state;
        if (errorAdress) {
            return (
                <View >
                    <Text style={{ color: COLOR_RED, marginTop: 10 }}>
                        {STRING.no_by_empty}
                    </Text>
                </View>
            );
        }
        return null;
    }
    renderCity = () => {
        const { requireCity, visibleCity } = this.props;
        const { city } = this.state;
        if (!visibleCity) {
            return null;
        }
        return (
            <TextInput
                valueDefault={city}
                nameIcon={'location-on'}
                typeIcon={'MaterialIcons'}
                onRef={ref4 => this.city = ref4}
                name={STRING.city}
                validate={() => Validate.checkDefault(this.state.city, requireCity)}
                changeDataParent={(value) => { 
                    this.state.city = value;
                    this.changeTextAddress();
                }}
                onStatusError={(value) => { this.state.errorCity = value; }}
            />
        );
    }
    renderDistrict = () => {
        const { requireDistrict, visibleDistrict } = this.props;
        const { district } = this.state;
        if (!visibleDistrict) {
            return null;
        }
        return (

            <TextInput
                valueDefault={district}
                nameIcon={'location-on'}
                typeIcon={'MaterialIcons'}
                onRef={ref4 => this.district = ref4}
                name={STRING.district}
                validate={() => Validate.checkDefault(this.state.district, requireDistrict)}
                changeDataParent={(value) => {
                    this.state.district = value;
                    this.changeTextAddress();
                }}
                onStatusError={(value) => { this.state.errorDistrict = value; }}
            />
        );
    }
    renderApartmentNumber = () => {
        const { requireApartmentNumber, visibleApartmentNumber } = this.props;
        const { apartmentNumber } = this.state;
        if (!visibleApartmentNumber) {
            return null;
        }
        return (
            <TextInput
                typeIcon={'MaterialIcons'}
                valueDefault={apartmentNumber}
                nameIcon={'location-on'}
                onRef={ref => this.apartmentNumber = ref}
                name={STRING.apartmentNumber}
                validate={() => Validate.checkDefault(this.state.apartmentNumber, requireApartmentNumber)}
                changeDataParent={(value) => {
                    this.state.apartmentNumber = value;
                    this.changeTextAddress();
                }}
                onStatusError={(value) => { this.state.errorApartmentNumber = value; }}
            />
        );
    }
    renderZipcode = () => {
        const { requireZipcode, visibleZipcode } = this.props;
        const { value3, value4 } = this.state;
        if (!visibleZipcode) {
            return null;
        }
        return (
            <View style={{ flexDirection: 'row', width: '100%' }} >
                <View style={{ width: '40%' }}>
                    <TextInput
                        onRef={ref3 => this.input3 = ref3}
                        nameIcon={'location-on'}
                        valueDefault={value3}
                        maxLength={3}
                        keyboardType={'number-pad'}
                        typeIcon={'MaterialIcons'}
                        name={STRING.zip_code}
                        validate={() => Validate.zipCodeNumber(this.state.zipCode3, 3, requireZipcode)}
                        changeDataParent={this.changeData3}
                        onStatusError={(value) => { this.state.errorEmail = value; }}
                    />
                </View>
                <View style={{ width: '5%' }} />
                <View style={{ width: '55%' }} >
                    <TextInput
                        valueDefault={value4}
                        onRef={ref4 => this.input4 = ref4}
                        name={STRING.zip_code}
                        maxLength={4}
                        keyboardType={'number-pad'}
                        validate={() => Validate.zipCodeNumber(this.state.zipCode3, 4, requireZipcode)}
                        changeDataParent={this.changeData4}
                        onStatusError={(value) => { this.state.errorEmail = value; }}
                    />
                </View>
            </View>
        );
    }
    render() {
        return (
            <View style={{ flexDirection: 'column', width: '100%' }}>
                {this.renderZipcode()}
                {this.renderErrorZipcode()}
                {this.renderCity()}
                {this.renderDistrict()}
                {this.renderApartmentNumber()}

            </View>
        );
    }
}
