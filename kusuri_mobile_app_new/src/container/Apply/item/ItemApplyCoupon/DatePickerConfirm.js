import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { APP_COLOR, COLOR_GRAY, } from '../../../../const/Color';
import Icon from 'react-native-vector-icons/Ionicons';


export class DatePickerConfirm extends PureComponent {


    render() {
        const { dateInit, name } = this.props;
        return (
            <View>


                <View style={{ height: 30, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon size={20} name={'md-calendar'} color={APP_COLOR.COLOR_TEXT} />
                        <Text style={{ color: COLOR_GRAY, fontSize: 15, marginLeft: 8 }}>{name}</Text>
                    </View>
                </View>

                    <Text style={{ color: APP_COLOR.COLOR_TEXT, fontSize: 14, marginVertical: 5 }}>{dateInit}</Text>


            </View>

        );
    }

}

const styles = StyleSheet.create({


});
