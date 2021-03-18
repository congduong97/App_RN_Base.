//Library:
import React, { Component } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

//Setup:
import { Api } from "../util/api";
import { COLOR_BACKGROUND_RECORDS } from "../../../const/Color";

//Component:
import ItemMenu from "../item/ItemMenu";
import MaintainView from "../../../commons/MaintainView";
import UserHeaderSelect from "../item/UserHeaderSelect";
import ModalPolicyNotice from "../item/ModalPolicyNotice";
import { HeaderIconLeft, Loading, NetworkError } from "../../../commons";

//Services:
import { UserService } from "../util/UserService";
import { STRING_VALIDATE } from "../util/constant";
import { keyAsyncStorage } from "../../../const/System";
import { AlertNotifyUserDeletedService } from "../util/AlertNotifyUserDeletedService";
import AlertNotifyUserIsDeleted from "../item/AlertNotifyUserIsDeleted";

export default class SettingRecords extends Component {
  constructor(props) {
    super(props);
    this.modalPolicyNoticeRef = React.createRef();
    this.listMenuHomeRecord = [
      {
        id: 1,
        name: "お薬を登録する",
        icon: require("../imgs/menu1.png"),
        keyNavigation: "HOME_REGISTER_MEDICINE_RECORD",
      },
      {
        id: 2,
        name: "登録したお薬を見る",
        icon: require("../imgs/menu2.png"),
        keyNavigation: "LIST_REGISTER_MEDICINE",
      },
      {
        id: 3,
        name: "お薬手帳を見せる",
        icon: require("../imgs/menu3.png"),
        keyNavigation: "ELINK_RECORDS",
      },
      {
        id: 4,
        name: "設定",
        icon: require("../imgs/menu4.png"),
        keyNavigation: "SETTINGS_RECORDS",
      },
    ];
    this.state = {
      userCurrent: null,
      data: [],
      isLoadingRefresh: false,
      isLoading: true,
      isMaintain: false,
      networkError: false,
      disabled: false,
    };
  }

  componentDidMount() {
    this.fetchApiGetListUser(false);
    this.checkAcceptpolicy();
  }

  componentWillUnmount() {
    this.timeOut && clearTimeout(this.timeOut);
  }

  checkAcceptpolicy = async () => {
    const accept = await AsyncStorage.getItem(
      keyAsyncStorage.healthRecordPolicy
    );
    if (!accept) {
      this.modalPolicyNoticeRef.current.handleVisible();
    }
  };

  fetchApiGetListUser = async (loadRefresh, keyNavigation) => {
    try {
      if (!!keyNavigation) {
        this.setState({
          disabled: true,
          networkError: false,
          isMaintain: false,
        });
      } else {
        if (loadRefresh) {
          this.setState({
            disabled: false,
            isLoadingRefresh: true,
            networkError: false,
            isMaintain: false,
          });
        } else {
          this.setState({
            disabled: false,
            isLoading: true,
            isMaintain: false,
            networkError: false,
          });
        }
      }

      const response = await Api.patientInfo();
      if (response.code === 502) {
        this.setState({
          isLoadingRefresh: false,
          isLoading: false,
          isMaintain: true,
        });
        return;
      }
      if (
        !!response &&
        response.code == 200 &&
        response.res.status.code == 1000
      ) {
        if (!!keyNavigation) {
          this.timeOut = setTimeout(() => {
            this.setState({
              disabled: false,
            });
          }, 200);
          if (!!response.res.data.currentUser) {
            this.props.navigation.navigate(keyNavigation);
          } else {
            Alert.alert(STRING_VALIDATE.Not_Have_Current_User);
          }
        } else {
          let data = response.res.data.listOtherUser
            ? response.res.data.listOtherUser
            : [];
          UserService.setListUser(response.res.data.currentUser, data, "");
          this.setState({
            data,
            userCurrent: response.res.data.currentUser,
            isLoading: false,
            isMaintain: false,
            isLoadingRefresh: false,
          });
        }
        return;
      }
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    }
  };
  renderContent = () => {
    const { isLoadingRefresh, isLoading, networkError } = this.state;
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.fetchApiGetListUser(false);
          }}
        />
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: COLOR_BACKGROUND_RECORDS,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.fetchApiGetListUser(true);
            }}
          />
        }
      >
        <UserHeaderSelect navigation={this.props.navigation} />
        {this.listMenuHomeRecord.map((item, index) => {
          return (
            <ItemMenu
              key={`${index}`}
              onPress={() => {
                console.log("Click ItemMenu");
                this.fetchApiGetListUser(false, item.keyNavigation);
              }}
              item={item}
              index={index}
              disabled={this.state.disabled}
            />
          );
        })}
      </ScrollView>
    );
  };

  render() {
    const { navigation } = this.props;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          onPress={() => this.fetchApiGetListUser(false)}
          timeOut={10000}
        />
      );
    }
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <HeaderIconLeft goBack={navigation.goBack} />
        {this.renderContent()}
        <ModalPolicyNotice ref={this.modalPolicyNoticeRef} />
        <AlertNotifyUserIsDeleted
          ref={(ref) => AlertNotifyUserDeletedService.setTopLevelAlert(ref)}
        />
      </View>
    );
  }
}
