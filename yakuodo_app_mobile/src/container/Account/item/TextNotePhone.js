import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { COLOR_BLACK, COLOR_RED } from '../../../const/Color';

export default class TextNotePhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ width: '100%', padding: 8, borderWidth: 1, borderColor: COLOR_RED,marginTop:10 }}>
                <Text style={styles.textNote}>
                    <Text style={styles.textRed} >{'【ご注意】\nSMS（ショートメッセージサービス）が受信できない場合、キャリアまたは端末のSMS受信拒否設定を解除した上で再送'}</Text>
                    をお試しください。また、<Text style={styles.textRed} >{'SMS送信は1日8通までが上限'}</Text>となります。上限を越える再送を行った場合は翌日以降にお試しください。
             </Text>
            </View>
        );
    }
}
const styles = {
    textNote: {
        color: COLOR_BLACK,
        fontSize: 12,
        lineHeight: 16

    },
    textRed: {
        color: COLOR_RED,

    }
}