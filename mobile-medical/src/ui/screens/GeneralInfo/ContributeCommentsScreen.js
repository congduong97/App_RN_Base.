import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import { Colors, Dimension } from "../../../commons";
import { ScreensView, ButtonView } from "../../../components";
const textContent =
  "Khi sử dụng dịch vụ của chúng tôi, bạn tin tưởng cung cấp thông tin của bạn cho chúng tôi. Chúng tôi hiểu rằng đây là một trách nhiệm lớn và chúng tôi nỗ lực bảo vệ thông tin của bạn cũng như để bạn nắm quyền kiểm soát.\n\nChính sách bảo mật này nhằm mục đích giúp bạn hiểu rõ những thông tin chúng tôi thu thập, lý do chúng tôi thu thập và cách bạn có thể cập nhật, quản lý, xuất và xóa thông tin của mình.";

export default function ContributeCommentsScreen(props) {
  return (
    <ScreensView titleScreen={"Ý kiến đóng góp"}>
      <Text style={styles.styleTextContent}>{textContent}</Text>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleTextContent: {
    marginTop: 32,
    marginHorizontal: 24,
    color: Colors.colorTitleScreen,
    lineHeight: 24,
    fontSize: Dimension.fontSizeButton16,
  },
});
