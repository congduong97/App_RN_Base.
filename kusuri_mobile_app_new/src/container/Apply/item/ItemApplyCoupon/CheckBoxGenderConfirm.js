import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import CheckBox from 'react-native-check-box';
import { STRING } from '../../util/string';
import { APP_COLOR, COLOR_GRAY } from '../../../../const/Color';


export class CheckBoxGenderConfirm extends PureComponent {
    getTitle=() => {
        const { valueDefault } = this.props;
        if (valueDefault === 1) {
            return STRING.men;
        }
        if (valueDefault === 2) {
            return STRING.women;
        }
        if (valueDefault === 3) {
            return STRING.undefined;
        }
        return '';
    }
    
    render() {
        return (
            <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <CheckBox
                        style={{ flex: 1, paddingVertical: 14 }}
                        checkBoxColor={APP_COLOR.COLOR_TEXT}
                        rightTextStyle={{ color: COLOR_GRAY }}
                        isChecked
                        onClick={()=>{
                            
                        }}
                        rightText={this.getTitle()}
                    />
            </View>
        );
    }
}
