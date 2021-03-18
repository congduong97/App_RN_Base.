import React from 'react';
import {View, Text} from 'react-native';
import {windowSize} from '../../commons/utils/devices';
import { DialogBox } from '../../components';

const Notification = ({message, visible, onClose}) => (
  <DialogBox visible={visible} onRequestClose={onClose} transparent>
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={{fontSize: 18, textAlign:'center'}}>{message}</Text>
      </View>
    </View>
  </DialogBox>
);
export default Notification;
const styles = {
  overlay: {
    width: windowSize.width,
    height: windowSize.height,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
  },
  textContainer: {
    backgroundColor: '#fff',
    width: windowSize.width * 0.8,
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
