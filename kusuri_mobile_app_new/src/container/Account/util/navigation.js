import EnterMemberCodeScreen from "../screen/EnterMemberCodeScreen";
import LoginWithBarCodeScreen from "../screen/LoginWithBarCodeScreen";
import MyPageScreen from "../screen/MyPageScreen";
import EnterPasswordScreen from "../../Account/screen/EnterPasswordScreen";
import SecuritySettings from "../screen/SecuritySettings";
import ResetPasswordScreen from "../screen/ResetPasswordScreen";
import EnterPasswordApp from "../screen/EnterPasswordApp";
import ForgotPassWord from "../screen/ForgotPassWord";
import ChangePhoneNumber from "../screen/ChangePhoneNumber";
import LoginWithPhoneNumber from "../screen/LoginWithPhoneNumber";
import SliderPhoneNumberBirthDayScreen from "../screen/SliderPhoneNumberBirthDayScreen";
import EnterPhoneScreen from "../screen/EnterPhoneScreen";
import EnterOtpScreen from "../screen/EnterOtpScreen";
import EnterBirthDayScreen from "../screen/EnterBirthDayScreen";
import EnterValidateBirthDayScreen from "../screen/EnterValidateBirthDayScreen";
import OtpLoginWithPhoneNumber from "../screen/OtpLoginWithPhoneNumber";
import UpdatePhoneWhenLoginByPhone from "../screen/UpdatePhoneWhenLoginByPhone";

export const AccountStack = {
  MY_PAGE: {
    screen: MyPageScreen,
  },
};
export const LoginStack = {
  LoginWithBarCode: {
    screen: LoginWithBarCodeScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterPasswordScreen: {
    screen: EnterPasswordScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterMemberCodeScreen: {
    screen: EnterMemberCodeScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterMemberCodeOpenAppScreen: {
    screen: EnterMemberCodeScreen,
    navigationOptions: {
      header: null,
    },
  },

  SECURITY_SETTING: {
    screen: SecuritySettings,
    navigationOptions: {
      header: null,
    },
  },
  ResetPasswordScreen: {
    screen: ResetPasswordScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterPasswordApp: {
    screen: EnterPasswordApp,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ForgotPassWord: {
    screen: ForgotPassWord,
    navigationOptions: {
      header: null,
    },
  },
  LoginWithPhoneNumber: {
    screen: LoginWithPhoneNumber,
    navigationOptions: {
      header: null,
    },
  },
  ChangePhoneNumber: {
    screen: ChangePhoneNumber,
    navigationOptions: {
      header: null,
    },
  },
  OtpLoginWithPhoneNumber: {
    screen: OtpLoginWithPhoneNumber,
    navigationOptions: {
      header: null,
    },
  },
  SliderPhoneNumberBirthDayScreen: {
    screen: SliderPhoneNumberBirthDayScreen,
    navigationOptions: {
      header: null,
    },
  },

  EnterPhoneScreen: {
    screen: EnterPhoneScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterOtpScreen: {
    screen: EnterOtpScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterBirthDayScreen: {
    screen: EnterBirthDayScreen,
    navigationOptions: {
      header: null,
    },
  },
  EnterValidateBirthDayScreen: {
    screen: EnterValidateBirthDayScreen,
    navigationOptions: {
      header: null,
    },
  },
  UpdatePhoneWhenLoginByPhone: {
    screen: UpdatePhoneWhenLoginByPhone,
    navigationOptions: {
      header: null,
    },
  },
};

// <Text style={{ color: APP_COLOR.COLOR_TEXT, fontWeight: "500" }}>
// 注意文言の追加　＊管理画面から変更可能とする
// </Text>
// <Text style={{ color: APP_COLOR.COLOR_TEXT, fontWeight: "500" }}>
// ーーー
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 7,
//   fontWeight: "500",
//   lineHeight: 15
// }}
// >
// 本カードは、クスリのアオキメンバーズカード及びプリペイドカードの両方の機能を備えています。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 7,
//   fontWeight: "500"
// }}
// >
// メンバーズカードのご利用について
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8, lineHeight: 15 }}>●</Text>
// 本カードに有効期限はございませんが、1年間カードのご使用がない場合は、ポイントは失効します。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8, lineHeight: 15 }}>●</Text>
// 本カードの紛失、盗難、改ざん及びお客様の許可なく第三者に使用された場合であっても、当社はポイントの損害については、一切その責を負いません。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 7,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8 }}>●</Text>
// 一部当社指定のポイント付与対象外商品がございます。ご了承ください。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 10,
//   fontWeight: "500"
// }}
// >
// プリペイドカードのご利用について
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8, lineHeight: 15 }}>●</Text>
// 本カードは、Aoca取扱店（クスリのアオキ各店舗等）でのご精算や残高照会にご利用いただけます。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8, lineHeight: 15 }}>●</Text>
// 本カードへのチャージ（ご入金）上限額は50,000円、入金は1,000円単位となり、一回当たりの入金上限額は49,000円までとなります。残高はレシートに記載されます。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8, lineHeight: 15 }}>●</Text>
// 本カードの紛失、盗難、改ざん及びお客様の許可なく第三者に使用された場合でもあっても、当社はポイントの保証、カード残高の返金又は再発行には一切応じかねます。本カードの換金及び本カードへの質権等担保権の設定はできません。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8 }}>●</Text>
// 本カードは、ご本人様以外は使用できません。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// <Text style={{ fontSize: 8 }}>●</Text>
// 本カードのご利用に関する詳細は、当社ホームページまたは約款をご確認ください。
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// https://www.kusuri-aoki.co.jp/aoca-terms/
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 7,
//   fontWeight: "500"
// }}
// >
// カード発行元：株式会社クスリのアオキ
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 0,
//   fontWeight: "500"
// }}
// >
// https://www.kusuri-aoki.co.jp
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 7,
//   fontWeight: "500"
// }}
// >
// {" "}
// お問合せ
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500"
// }}
// >
// 0120-212132（平日10:00～17:30）
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 0,
//   fontWeight: "500"
// }}
// >
// 石川県白山市松本町2512番地
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 7,
//   fontWeight: "500"
// }}
// >
// ・Aoca取扱店舗
// </Text>
// <Text
// style={{
//   color: APP_COLOR.COLOR_TEXT,
//   paddingTop: 5,
//   fontWeight: "500",
//   lineHeight: 15
// }}
// >
// 　＊＊＊＊＊　ここにPDFへとぶURL（時期対応はチラシアップカテゴリで対応？）　＊＊＊＊＊
// </Text>
