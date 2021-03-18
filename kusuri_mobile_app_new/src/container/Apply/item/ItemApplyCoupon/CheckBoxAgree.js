import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';
import { APP_COLOR, COLOR_RED, COLOR_BLUE } from '../../../../const/Color';
import { STRING } from '../../util/string';
// import console = require('console');

export class CheckBoxAgree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isAgree: false,
            terms: ''
        };
    }
    componentDidMount() {
        const { onRef } = this.props;
        onRef(this);
    }
    checkData = () => {
        const { isAgree } = this.state;
        const { requireTermOfUse } = this.props;
        if (!isAgree && requireTermOfUse) {
            this.setState({ error: true });
        } else {
            this.setState({ error: false });
        }
    }
    getColor = () => {
        const { error } = this.state;
        const { requireTermOfUse } = this.props;
        if (!requireTermOfUse) {
            return APP_COLOR.COLOR_TEXT;
        }

        return error ? COLOR_RED : APP_COLOR.COLOR_TEXT;
    }
    clickAgree = () => {
        const { changeDataParent, requireTermOfUse } = this.props;
        this.setState({
            isAgree: !this.state.isAgree,
            error: this.state.isAgree

        });

        changeDataParent(true);
    }

    render() {
        return (
            <View style={{ marginTop: 20 }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{STRING.privacy_policy_agreement}</Text>
                    <TouchableOpacity onPress={() => {
                        if (this.props.link) {
                            this.props.navigation.navigate('WEB_VIEW', { url: this.props.link })
                        }
                    }}
                    >
                        <Text style={{ color: COLOR_BLUE }}>{STRING.click_here_for_details}</Text>

                    </TouchableOpacity>
                </View>


                <CheckBox
                    style={{ flex: 1, paddingVertical: 12, marginLeft: -2, }}
                    checkBoxColor={this.getColor()}
                    onClick={this.clickAgree}
                    isChecked={this.state.isAgree}
                    rightText={STRING.agree}
                    rightTextStyle={{ color: this.getColor(), marginLeft: 8, }}
                />
            </View >
        );
    }
}
