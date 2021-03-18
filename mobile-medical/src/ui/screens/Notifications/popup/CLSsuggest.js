import React from "react";
import { Text, View, FlatList } from "react-native";
import { Dimension, Colors } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";

export default function CLSsuggest(props) {
  const { refDialog, navigation, notifiData } = props;
  const { object } = notifiData;
  let clsSuggest = [];
  try {
    clsSuggest = JSON.parse(JSON.parse(object));
  } catch (error) {
    clsSuggest = JSON.parse(object);
  }

  const handleOnPress = ({ id }) => {
    if (id === "NaviDetail") {
      AppNavigate.navigateToWaitingApproval(navigation.dispatch, {});
    }
    refDialog.hideDialog();
  };
  const renderItem = ({ item, index }) => (
    <Text style={{ ...styles.stTextContent, marginTop: 0, textAlign: "left", marginHorizontal: Dimension.padding2x, letterSpacing: 0.1 }}>{index + 1}. {item.clsName + ' - ' + item.clsDepartment}</Text>
  );
  return (
    <View style={{ ...styles.stContain, alignItems: 'center' }}>
      <Text style={{ ...styles.stTextTitle, textAlign: 'center' }}>{"Thông báo"}</Text>
      <Text style={{ ...styles.stTextContent, letterSpacing: 0.1, textAlign: 'left' }}>
        {"Bác sĩ đã chuẩn đoán xong, mời bạn thực hiện các dịch vụ sau:"}
      </Text>
      <FlatList
        data={clsSuggest}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.stFooterButton}>
        <ButtonView
          id={"Closed"}
          title={"Đóng"}
          onPress={handleOnPress}
          bgColor={"white"}
          textColor={Colors.colorMain}
          style={{
            ...styles.stButtonConfirm,
            borderColor: Colors.colorMain,
            borderWidth: 1,
            marginBottom: 0,
          }}
        />
      </View>
    </View>
  );
}
