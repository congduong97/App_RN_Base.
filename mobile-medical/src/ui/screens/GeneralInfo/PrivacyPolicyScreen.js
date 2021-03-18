import React from "react";
import { Image, Text } from "react-native";
import { ImagesUrl } from "../../../commons";
import { ScreensView } from "../../../components";
import styles from "./styles";
const textContent =
  "Khi sử dụng dịch vụ của chúng tôi, bạn tin tưởng cung cấp thông tin của bạn cho chúng tôi. Chúng tôi hiểu rằng đây là một trách nhiệm lớn và chúng tôi nỗ lực bảo vệ thông tin của bạn cũng như để bạn nắm quyền kiểm soát.\n\nChính sách bảo mật này nhằm mục đích giúp bạn hiểu rõ những thông tin chúng tôi thu thập, lý do chúng tôi thu thập và cách bạn có thể cập nhật, quản lý, xuất và xóa thông tin của mình.";

export default function PrivacyPolicyScreen(props) {
  return (
    <ScreensView
      titleScreen={"Chính sách bảo mật"}
      styleContent={styles.styleContent}
    >
      <Image source={ImagesUrl.logoBKAV} style={styles.stImage} />
      <Text style={styles.styleTextContent}>{textContent}</Text>
    </ScreensView>
  );
}
