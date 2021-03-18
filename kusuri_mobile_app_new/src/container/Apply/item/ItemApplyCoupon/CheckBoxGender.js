import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import CheckBox from 'react-native-check-box';
import { STRING } from '../../util/string';
import { APP_COLOR, COLOR_GRAY } from '../../../../const/Color';


export class CheckBoxGender extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isGender: this.props.valueDefault || 1,
        };
    }
    

    render() {
        const { changeDataParent } = this.props;
        return (
            <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <CheckBox
                        style={{ flex: 1, paddingVertical: 12, marginLeft: -2, }}
                        checkBoxColor={APP_COLOR.COLOR_TEXT}
                        onClick={() => {
                            this.setState({
                                isGender: 1
                            });
                            changeDataParent(1);
                        }}
                        isChecked={this.state.isGender === 1}
                        rightText={STRING.men}
                        rightTextStyle={{ color: COLOR_GRAY, marginLeft: 8, }}
                    />
                    <CheckBox
                        style={{ flex: 1, paddingVertical: 14 }}
                        checkBoxColor={APP_COLOR.COLOR_TEXT}
                        onClick={() => {
                            this.setState({
                                isGender: 2
                            });
                            changeDataParent(2);
                        }}
                        rightTextStyle={{ color: COLOR_GRAY }}
                        isChecked={this.state.isGender === 2}
                        rightText={STRING.women}
                    />
                    <CheckBox
                        style={{ flex: 1, paddingVertical: 14 }}
                        checkBoxColor={APP_COLOR.COLOR_TEXT}
                        onClick={() => {
                            this.setState({
                                isGender: 3
                            });
                            changeDataParent(3);
                        }}
                        rightTextStyle={{ color: COLOR_GRAY }}
                        isChecked={this.state.isGender === 3}
                        rightText={STRING.undefined}
                    />
            </View>
        );
    }
}
