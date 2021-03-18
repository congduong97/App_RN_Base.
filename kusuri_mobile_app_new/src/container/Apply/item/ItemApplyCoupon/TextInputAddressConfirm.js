import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { TextInputConfirm } from './TextInputConfirm';
import { STRING } from '../../util/string';


export class TextInputAddressConfirm extends PureComponent {

    renderCity = () => {
        const { city } = this.props.zipcode;
        if (!city) {
            return null;
        }
        return (
            <TextInputConfirm
                valueDefault={city}
                nameIcon={'location-on'}
                typeIcon={'MaterialIcons'}
                name={STRING.city}
            />
        );
    }
    renderDistrict = () => {
        const { district } = this.props.zipcode;
        if (!district) {
            return null;
        }
        return (

            <TextInputConfirm
                valueDefault={district}
                nameIcon={'location-on'}
                typeIcon={'MaterialIcons'}
                name={STRING.district}
            
            />
        );
    }
    renderApartmentNumber = () => {
        const { apartmentNumber } = this.props.zipcode;
        if (!apartmentNumber) {
            return null;
        }
        return (
            <TextInputConfirm
                typeIcon={'MaterialIcons'}
                valueDefault={apartmentNumber}
                nameIcon={'location-on'}
                name={STRING.apartmentNumber}
              
            />
        );
    }
    renderZipcode = () => {
        const { zipCode } = this.props.zipcode;

        if (!zipCode) {
            return null;
        }
     
        
        return (
            <View style={{ flexDirection: 'row', width: '100%' }} >
                <View style={{ width: '40%' }}>
                    <TextInputConfirm
                        nameIcon={'location-on'}
                        valueDefault={zipCode}
                        typeIcon={'MaterialIcons'}
                        name={STRING.zip_code}
                    />
                </View>
             
            </View>
        );
    }
    render() {
        return (
            <View style={{ flexDirection: 'column', width: '100%' }}>
                {this.renderZipcode()}
                {this.renderCity()}
                {this.renderDistrict()}
                {this.renderApartmentNumber()}

            </View>
        );
    }
}
