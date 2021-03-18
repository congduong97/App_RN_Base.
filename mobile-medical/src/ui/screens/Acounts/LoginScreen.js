import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Alert, Modal, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  ScreensView,
  InputView,
  ButtonView,
  Checkbox,
  TouchableOpacityEx,
} from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import {
  Colors,
  Dimension,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../commons";
import API from "../../../networking";
import AppNavigate from "../../../navigations/AppNavigate";
import { WebView } from "react-native-webview";
import actions from "../../../../src/redux/actions";
import DropShadow from "react-native-drop-shadow";

const KeyLogin = {
  UserName: "username",
  Password: "password",
  FirebaseToken: "firebaseToken",
};

function FormLoginView(props) {
  const { onChangeText, onPress } = props;
  const [isRemember, setIsRemember] = useState(true);
  const [secure, setStateSecure] = useState(true);
  const [isShowQuenMatKhau, setIsShowQuenMatKhau] = useState(false);
  const showPass = () => {
    setStateSecure(!secure);
  };
  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.025,
        shadowRadius: 10,
      }}
    >
      <View style={styles.stContainForm}>
        <InputView
          id={KeyLogin.UserName}
          iconLeft={"account-details"}
          iconLeftColor={"#CBCCD0"}
          label={"Tên đăng nhập"}
          placeholder={"Tên đăng nhập"}
          placeholderTextColor={Colors.textLabel}
          style={styles.stInput}
          styleInput={{ borderWidth: 0 }}
          styleTextInput={{ height: "100%" }}
          onChangeText={onChangeText}
          selectionColor={Colors.colorMain}
        />
        <InputView
          hasEye
          pressShowPass={showPass}
          secureTextEntry={secure}
          id={KeyLogin.Password}
          iconLeft={"change-password"}
          iconLeftColor={Colors.colorMain}
          style={styles.stInput}
          styleInput={{ borderWidth: 0 }}
          label={"Mật khẩu"}
          placeholder={"Mật khẩu"}
          placeholderTextColor={Colors.textLabel}
          onChangeText={onChangeText}
          styleTextInput={{ height: "100%" }}
          // iconRightName={"Group-9"}
          // iconRighSize={14}
        />
        <View style={styles.stContainCheck}>
          <Checkbox
            id={"isSaveAccount"}
            onToggle={(data) => {
              onChangeText({ id: data.id, data: data.isChecked });
            }}
            isSelected={isRemember}
            label={"Lưu mật khẩu"}
            // onChange={onChangeText}
            // label={"Nhớ mật khẩu"}
            // labelStyle={{ marginLeft: 12, fontSize: 12, color: "black" }}
            // containerStyle={[
            //   {
            //     alignItems: "flex-start",
            //     justifyContent: "flex-start",
            //   },
            // ]}
          />
          <Text
            onPress={() => {
              setIsShowQuenMatKhau(true);
            }}
            style={styles.styleText}
          >
            {"Quên mật khẩu?"}
          </Text>
        </View>
        <ButtonView
          waitTitme={100}
          onPress={onPress}
          title={"Đăng nhập"}
          style={styles.stButtonLogin}
        />
      </View>
      <Modal
        animationType='slide'
        transparent={false}
        visible={isShowQuenMatKhau}
      >
        <IconView
          name={"cancel"}
          color={Colors.colorCancel}
          type={IconViewType.MaterialIcons}
          size={Dimension.fontSizeHeaderPopup}
          style={{ alignSelf: "flex-end", marginRight: 5 }}
          onPress={() => {
            setIsShowQuenMatKhau(false);
          }}
        />
        <WebView
          // onNavigationStateChange={onNavigationStateChangeAction}
          source={{
            uri:
              "https://login.yenbai.gov.vn/authenticationendpoint/identity/accountAuth.html",
          }}
        ></WebView>
      </Modal>
    </DropShadow>
  );
}

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refLoginParams = useRef({
    username: "",
    password: "",
    isSaveAccount: false,
  });
  const [ssoUrl, setSsoUrl] = useState("");

  useEffect(() => {
    if (Platform.OS) {
      GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        iosClientId:
          "862535373415-l7a8vdnu2eq1a6pf7anhlh74pc4osknr.apps.googleusercontent.com",
        webClientId:
          "862535373415-r9ugmdq3rv09id66fh6aqe3ub27d28qf.apps.googleusercontent.com",
        offlineAccess: false,
      });
    } else {
      GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        webClientId:
          "862535373415-67o9fjo7or3mrlbvnhd2lsb9n5ppms3m.apps.googleusercontent.com",
      });
    }
  });
  const handleOnLogin = async () => {
    let loginSuccess = await API.requestAccountSignin(
      dispatch,
      refLoginParams.current
    );
    if (loginSuccess) {
      handleLoginResponse();
    } else {
      Alert.alert(
        "Đăng nhập thất bại",
        "Vui lòng kiểm tra lại thông tin đăng nhập",
        [
          {
            text: "Đóng",
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  };

  const handleLoginResponse = async () => {
    // AppNavigate.navigateWhenAppStart(navigation.dispatch);
    let isDone = await API.requestDataAfterAuthent(dispatch, {});
    if (isDone) {
      AppNavigate.navigateToTabHome1(navigation.dispatch);
      AppNavigate.navigateWhenAppStart(navigation.dispatch);
    }
  };

  const onLoginSSO = async () => {
    let rs = await API.requestSSO(dispatch);
    if (rs.url) {
      setSsoUrl(rs.url);
    } else {
      Alert.alert(
        "Đăng nhập thất bại",
        "Kết nối đến hệ thống SSO không thành công",
        [
          {
            text: "Đóng",
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  };

  const oncloseModal = () => {
    setSsoUrl("");
  };

  const onNavigationStateChangeAction = async (webViewState) => {
    var regexp = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      check;
    while ((check = regexp.exec(webViewState.url))) {
      params[check[1]] = check[2];
    }
    if (params.jwt) {
      const data = {
        id_token: params.jwt,
      };
      await dispatch(actions.saveAccountAuthent(data));
      handleLoginResponse();
    }
  };

  //Xin tất cả các quyền fb cho phép để lấy thông tin tài khoản.
  const checkPermissionFacebook = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            if (data && data.accessToken) {
              loginFaceBook(data.accessToken);
            }
          });
        }
      },
      function (error) {
        console.log("error", error);
      }
    );
  };

  const loginFaceBook = async (tokenAccount) => {
    let response = await API.requestAccountSignInFaceBook(dispatch, {
      accessToken: tokenAccount,
    });
    if (response && response.id_token) {
      const data = {
        id_token: response.id_token,
      };
      await dispatch(actions.saveAccountAuthent(data));
      handleLoginResponse();
    } else {
      Alert.alert("Đăng nhập thất bại.Vui lòng thử lại sau!");
    }
  };
  const handleLoginResponseGoogle = async () => {
    let isDone = await API.requestDataAfterAuthent(dispatch, {});
    if (!isDone) {
      Alert.alert("Đăng nhập thất bại.Vui lòng thử lại sau!");
    } else {
      isDone && AppNavigate.navigateWhenAppStart(navigation.dispatch);
    }
  };

  const loginGoogle = async (tokenAccount) => {
    let response = await API.requestAccountSignInGoogle(dispatch, {
      idToken: tokenAccount,
      rememberMe: false,
    });
    if (response && response.id_token) {
      const data = {
        id_token: response.id_token,
      };
      let loginGoogle = await dispatch(actions.saveAccountAuthent(data));
      if (loginGoogle && loginGoogle.data.id_token) {
        handleLoginResponseGoogle();
      } else {
        Alert.alert("Đăng nhập thất bại.Vui lòng thử lại sau!");
      }
    } else {
      Alert.alert("Đăng nhập thất bại.Vui lòng thử lại sau!");
    }
  };
  const onChangeText = ({ id, data }) => {
    refLoginParams.current[id] = data;
  };

  const pressBntGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo;
      if (idToken) {
        loginGoogle(idToken);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ScreensView
      isShowBack={true}
      titleScreen={"Đăng nhập"}
      bgColorStatusBar='transparent'
      // styleContent={styles.styleContent}
      styleTitle={{ color: "black" }}
      // colorsLinearGradient={[
      //   Colors.colorMain,
      //   Colors.colorMain,
      //   Colors.colorMain,
      // ]}
    >
      {/* <View
        colors={[Colors.colorMain, Colors.colorMain, Colors.colorMain]}
        style={[styles.styleHeader]}
      /> */}
      <FormLoginView
        // id={ActionKey.NextToEditPatientRecords}
        onChangeText={onChangeText}
        onPress={handleOnLogin}
      />
      <View
        style={{
          // width: "100%",
          // flex: 1,
          flexDirection: "row",
          // justifyContent: "space-between",
        }}
      >
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.08,
            shadowRadius: 10,
          }}
        >
          <View>
            <TouchableOpacityEx
              onPress={checkPermissionFacebook}
              style={styles.styleButtonFace}
            >
              <IconView
                name={"ic-facebook"}
                size={24}
                color={"#00C6AD"}
                style={{
                  backgroundColor: "#D4FAFF",
                  borderRadius: 12,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              <Text style={{ flex: 1, textAlign: "center" }}>{"FaceBook"}</Text>
            </TouchableOpacityEx>
          </View>
        </DropShadow>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.08,
            shadowRadius: 10,
          }}
        >
          <View>
            <TouchableOpacityEx
              onPress={pressBntGoogle}
              style={styles.styleButtonFace}
            >
              <IconView
                name={"google-plus-1"}
                size={18}
                color={"red"}
                style={{
                  backgroundColor: "#FFE2DE",
                  borderRadius: 12,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              <Text style={{ textAlign: "center", flex: 1 }}>{"Google"}</Text>
            </TouchableOpacityEx>
          </View>
        </DropShadow>
      </View>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={styles.styleTextOr}>{"---------- hoặc ----------"}</Text>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.025,
            shadowRadius: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: 5,
              paddingHorizontal: 19,
            }}
          >
            <TouchableOpacityEx style={styles.styleBtnSso} onPress={onLoginSSO}>
              <Text style={{ textAlign: "center", color: "#FF6F5B" }}>
                {"Đăng nhập SSO Yên Bái"}
              </Text>
            </TouchableOpacityEx>
          </View>
        </DropShadow>
      </View>
      <Modal animationType='slide' transparent={false} visible={!!ssoUrl}>
        <IconView
          name={"cancel"}
          color={Colors.colorCancel}
          type={IconViewType.MaterialIcons}
          size={Dimension.fontSizeHeaderPopup}
          style={{ alignSelf: "flex-end", marginRight: 5 }}
          onPress={oncloseModal}
        />
        <WebView
          onNavigationStateChange={onNavigationStateChangeAction}
          source={{ uri: ssoUrl }}
        ></WebView>
      </Modal>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
  },

  styleHeader: {
    height: 230,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    backgroundColor: Colors.colorMain,
    ///
    shadowOpacity: 0.25,
    shadowRadius: 60,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowColor: "#000000",
    elevation: 5,
  },

  styleToolbar: {
    paddingHorizontal: 16,
  },

  stContainForm: {
    // zIndex: 1,
    alignSelf: "center",
    backgroundColor: "white",
    // width: SCREEN_WIDTH - 48,
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 70,
    // marginTop: -160,
    // shadowOpacity: 0.25,
    // shadowRadius: 24,
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowColor: "#000000",
    // elevation: 5,
  },

  stInput: {
    marginVertical: Dimension.margin2x,
    // backgroundColor: "#3456",
    borderRadius: Dimension.radiusButton,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },

  stContainCheck: {
    marginVertical: 8,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },

  styleText: {
    alignSelf: "center",
    flex: 1,
    fontSize: Dimension.fontSize14,
    color: Colors.colorMain,
    fontFamily: Fonts.SFProDisplayRegular,
    textAlign: "right",
  },
  stButtonLogin: {
    marginTop: 16,
  },

  styleTextOr: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorText1,
    fontFamily: Fonts.SFProDisplayRegular,
  },

  styleButtonFace: {
    marginTop: 16,
    // paddingRight: fontsValue(32),
    // paddingVertical: Dimension.padding,
    padding: Dimension.padding,
    width: "85%",
    flexDirection: "row",
    borderRadius: 8,
    // marginHorizontal: fontsValue(16),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    alignSelf: "center",
    ///
    // shadowOpacity: 0.25,
    // shadowRadius: 8,
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowColor: "#000000",
    // elevation: 5,
  },
  styleBtnSso: {
    marginTop: 18,
    marginHorizontal: 22,
    padding: 14,
    backgroundColor: "#FFE2DE",
    borderRadius: Dimension.radiusButton,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    ///
    // shadowOpacity: 0.25,
    // shadowRadius: 8,
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowColor: "#000000",
    // elevation: 5,
  },
});
