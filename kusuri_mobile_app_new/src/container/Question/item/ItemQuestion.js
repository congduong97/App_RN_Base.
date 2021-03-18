import React, { PureComponent } from 'react';
import { View } from 'native-base';
import Icons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {
    Text, StyleSheet, TouchableOpacity
} from 'react-native';
import { COLOR_GRAY, COLOR_WHITE, APP_COLOR, COLOR_GRAY_LIGHT }
    from '../../../const/Color';

export class ItemQuestion extends PureComponent {
    render() {
        const { question, title } = this.props.data;
        const { navigation, index, detail } = this.props;
        return (
            <TouchableOpacity
                style={styles.wrapperContainer}
                onPress={() => {
                    if (!detail) {
                        navigation.navigate('QuestionDetail', { item: this.props.data, index });
                    }
                }}
            >
                <View >
                    <Text style={[styles.textOrder, { fontSize: 16, color: APP_COLOR.COLOR_TEXT }]}>{title}<Text style={[styles.textOrder, { color: APP_COLOR.COLOR_TEXT }]}>{index + 1}</Text></Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        marginLeft: 8,
                        marginVertical: 16,
                        justifyContent: 'center',
                        textAlignVertical: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12, textAlignVertical: 'center'
                        }}
                    >{question}</Text>
                </View>

                <View>
                    {detail ? null :
                        <Icons name="chevron-right" size={25} style={{ marginLeft: 7 }} color={COLOR_GRAY} />
                    }
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({

    textOrder: {
        fontSize: 12,
        textAlign: 'center'
    },

    wrapperContainer: {
        // height: 55,
        padding: 5,
        backgroundColor: COLOR_WHITE,
        // backgroundColor: 'blue',
        flexDirection: 'row',
        paddingLeft: 15,
        borderColor: COLOR_GRAY_LIGHT,
        alignItems: 'center',
        textAlignVertical: 'center',
        borderBottomWidth: 1
    }
});
