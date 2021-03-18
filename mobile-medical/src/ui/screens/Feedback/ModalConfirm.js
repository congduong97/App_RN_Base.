import React from "react";
import {
  Text,
  View,
  Image,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";

const ModalConfirm = (props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.viewModalContainer}>
        <View style={styles.viewModalContent}>
          <Text style={styles.textTitle}>Thông báo</Text>
          <Text style={styles.textContent}>
            {
              "Cám ơn bạn đã gửi góp ý cho chúng tôi \n Chúng tôi sẽ xử lý trong thời gian sớm nhất"
            }
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{marginTop: 40}}
            onPress={props.closeModal}
          >
            <Text
              style={{
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#00C6AD",
                color: '#00C6AD'
              }}
            >
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirm;
