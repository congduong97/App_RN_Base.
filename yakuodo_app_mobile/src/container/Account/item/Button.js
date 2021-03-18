import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOR_WHITE, COLOR_BLACK, COLOR_BLUE_LIGHT } from '../../../const/Color';
import { Loading } from '../../../commons'
import Spinner from 'react-native-spinkit';


export class Button extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { loading, onPress, style, type, title } = this.props
        return (
            <TouchableOpacity onPress={() => {
                if (!loading) {
                    onPress()

                }
            }} style={[type == 'canel' ? styles.buttonCanel : styles.buttonOk, style]}>
                {loading ?
                    <Spinner color={type == 'canel' ? COLOR_BLUE_LIGHT : COLOR_WHITE} type={'ThreeBounce'} />
                    :
                    <Text style={{ color: type == 'canel' ? COLOR_BLACK : COLOR_WHITE }}>
                        {title}
                    </Text>

                }

            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    buttonOk: {
        backgroundColor: COLOR_BLUE_LIGHT, height: 45, width: '80%', justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginBottom: 16,

    },
    buttonCanel: {
        borderWidth: 1, height: 45, width: '80%', justifyContent: 'center', alignItems: 'center', borderRadius: 4,

    }
})