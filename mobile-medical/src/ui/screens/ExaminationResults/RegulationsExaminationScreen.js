import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Dimension, Fonts, fontsValue } from "../../../commons";
import { ButtonView, Checkbox, ScreensView } from "../../../components";
import AppNavigate from "../../../navigations/AppNavigate";
const textQuyDinh =
  "Chúng tôi cam kết sẽ bảo mật các Thông tin cá nhân của Khách hàng, nỗ lực hết sức và sử dụng các biện pháp thích hợp để các thông tin mà Khách hàng cung cấp cho chúng tôi trong quá trình sử dụng website này được bảo mật và bảo vệ khỏi sự truy cập trái phép. Tuy nhiên, chúng tôi không đảm bảo ngăn chặn được tất cả các truy cập trái phép. Trong trường hợp truy cập trái phép nằm ngoài khả năng kiểm soát của chúng tôi, BVĐK sẽ không chịu trách nhiệm dưới bất kỳ hình thức nào đối với bất kỳ khiếu nại, tranh chấp hoặc thiệt hại nào phát sinh từ hoặc liên quan đến truy cập trái phép đó.";

export default function RegulationsExaminationScreen(props) {
  const navigation = useNavigation();
  const [isCheckBox, setIsCheckBox] = useState(false);

  const route = useRoute();
  const dataItem = route?.params?.data;
  const handleAgree = () => {
    navigation.pop();
    // AppNavigate.navigateToResultPatient(navigation.dispatch, { data: dataItem })
    AppNavigate.navigateToExaminationResultsSearch(navigation.dispatch, {
      data: dataItem,
    });
  };
  return (
    <ScreensView
      titleScreen={"Cam kết bảo mật kết quả"}
      renderFooter={
        <View>
          <View style={styles.stContainCheck}>
            <Checkbox
              style={{
                justifyContent: 'center',
                paddingHorizontal: fontsValue(12),
                 marginHorizontal:Dimension.margin3x
              }}
              id={"1"}
              styleLabel={{ color: 'black', fontSize: Dimension.fontSize14, fonFamily: Fonts.SFProDisplayRegular }}
              onToggle={(data) => setIsCheckBox(data.isChecked)}
              isSelected={false}
              label={"Tôi đồng ý theo điều khoản và cam kết bảo mật đưa ra"}
            />
          </View>

          <ButtonView
            title={"Tôi đồng ý"}
            onPress={handleAgree}
            disabled={!isCheckBox}
            style={{ marginBottom: fontsValue(20), marginHorizontal: fontsValue(15) }}
          />
        </View>
      }
    >
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.styleTextContent}>{textQuyDinh}</Text>
      </ScrollView>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleTextContent: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize14,
    color: 'black',
    lineHeight: 28,
    marginTop: fontsValue(31),
    marginHorizontal: Dimension.margin2x,
  },
  stContainCheck: {
    marginVertical: fontsValue(12),
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    

  },
});
