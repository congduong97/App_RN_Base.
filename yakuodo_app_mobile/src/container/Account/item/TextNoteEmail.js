import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { COLOR_RED } from '../../../const/Color'
export default class TextNoteEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (

      <View style={{ borderWidth: 1, borderColor: '#cecece', borderRadius: 2, width: '100%', padding: 8, marginTop: 16, fontSize: 12 }} >
        <Text style={{ fontSize: 12 }}>
          ご注意 {'\n'}
          「<Text style={styles.textEmail}>{'authcode@yakuodo-info.com'}</Text>」からのメールを受信できるようインターネットメール受信拒否されている場合は受信許可の設定をお願いします。{`\n \n`}
          <Text style={styles.textError}>{'ご入力の電話番号は本人認証情報としてご登録します。'}</Text>存在しない電話番号など不正利用の疑いがある場合、お問い合わせさせていただく可能性がございます。{`\n \n`}
          <Text style={styles.textError}>{'ご入力のメールアドレスは一時的な利用でありご登録されません'}</Text>。携帯電話番号登録済みのWA!CAをアプリへ再連携する場合、ご登録の携帯電話番号に対し、再度SMS認証を実施いたします。
        </Text>

      </View>
    );
  }
}

const styles = {
  textEmail: {
    color: '#0396A7',
    fontSize: 10,


  },
  textError: {
    color: COLOR_RED
  }
}