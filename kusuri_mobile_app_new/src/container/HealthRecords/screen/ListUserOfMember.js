//Library:
import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

//Setup:
import {
  APP_COLOR,
  COLOR_GRAY_LIGHT,
  COLOR_BACKGROUND_RECORDS,
} from "../../../const/Color";
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { EVENT_CHANGE_CURRENT_USER } from "../util/constant";

//Component:
import UserItem from "../item/UserItem";
import MaintainView from "../../../commons/MaintainView";
import ReloadScreen from "../../../service/ReloadScreen";
import { HeaderIconLeft, NetworkError, Loading } from "../../../commons";

//Services:
import { UserService } from "../util/UserService";

export default class ListUserOfMember extends Component {
  constructor() {
    super();
    this.state = {
      userCurrent: UserService.getListUser().currentUser,
      data: UserService.getListUser().listOtherUser,
      isLoadingRefresh: false,
      isLoading: false,
      isMaintain: false,
      networkError: false,
      loadingActiveUser: false,
    };
  }
  componentDidMount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.onChange(routeName, (currentScreen) => {
      if (currentScreen == "LIST_USER_OF_MEMBER") {
        this.fetchApiGetListUser(false, EVENT_CHANGE_CURRENT_USER);
      }
    });
  }

  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
    !!this.timeOutLoading && clearTimeout(this.timeOutLoading);
  }

  fetchApiGetListUser = async (loadRefresh, event = "") => {
    try {
      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
          networkError: false,
          isMaintain: false,
        });
      } else {
        this.setState({
          isLoading: true,
          isMaintain: false,
          networkError: false,
        });
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
        let data = response.res.data.listOtherUser
          ? response.res.data.listOtherUser
          : [];
        UserService.setListUser(response.res.data.currentUser, data, event);
        this.setState({
          data,
          userCurrent: response.res.data.currentUser,
          isLoading: false,
          isMaintain: false,
          isLoadingRefresh: false,
        });
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
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    }
  };
  onPressActiveUser = async (id) => {
    try {
      this.setState({
        loadingActiveUser: true,
      });
      const response = await Api.changeCurrentUser(id);
      if (response.code === 502) {
        this.setState({
          isMaintain: true,
          loadingActiveUser: false,
        });
        return;
      }
      if (
        !!response &&
        response.code == 200 &&
        response.res.status.code == 1000
      ) {
        let data = response.res.data.listOtherUser
          ? response.res.data.listOtherUser
          : [];
        UserService.setListUser(
          response.res.data.currentUser,
          data,
          EVENT_CHANGE_CURRENT_USER
        );
        this.setState({
          data,
          userCurrent: response.res.data.currentUser,
          loadingActiveUser: false,
        });
        if (!!this.refScroll) {
          this.refScroll.scrollResponderScrollTo({
            x: 0,
            y: 0,
            animated: true,
          });
        }
        return;
      }
      this.setState({
        ...this.state,
        networkError: true,
        loadingActiveUser: false,
      });
    } catch (error) {
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        loadingActiveUser: false,
      });
    }
  };

  renderContent = () => {
    const {
      isLoadingRefresh,
      data,
      isLoading,
      networkError,
      loadingActiveUser,
      userCurrent,
    } = this.state;
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
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={(ref) => {
            this.refScroll = ref;
          }}
          style={{ flex: 1, backgroundColor: COLOR_GRAY_LIGHT }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={() => {
                this.fetchApiGetListUser(true);
              }}
            />
          }
        >
          <Text
            style={{
              color: "black",
              paddingHorizontal: 15,
              paddingVertical: 10,
              fontSize: SIZE.H14,
              fontWeight: "bold",
              backgroundColor: COLOR_BACKGROUND_RECORDS,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
            }}
          >
            現在選択中のユーザー
          </Text>
          {!!userCurrent && (
            <UserItem
              item={userCurrent}
              typeUserItem={"current"}
              onPress={() => {
                this.props.navigation.navigate("DETAIL_USER", {
                  user: userCurrent,
                });
              }}
            />
          )}
          <Text
            style={{
              color: "black",
              paddingHorizontal: 15,
              paddingVertical: 10,
              fontSize: SIZE.H14,
              backgroundColor: COLOR_BACKGROUND_RECORDS,
              marginTop: !!userCurrent ? 0 : 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
            }}
          >
            登録済みのユーザー
          </Text>
          {data.length > 0 &&
            data.map((item, index) => {
              return (
                <UserItem
                  key={`${index}`}
                  item={item}
                  typeUserItem={"other"}
                  loadingActiveUser={loadingActiveUser}
                  onPressActiveUser={this.onPressActiveUser}
                  styleContainer={{
                    borderBottomWidth: index == data.length - 1 ? 0.5 : 0,
                  }}
                />
              );
            })}
        </ScrollView>
        <View style={{ width: "100%", backgroundColor: COLOR_GRAY_LIGHT }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#06B050",
              borderRadius: 3,
              width: SIZE.width(70),
              marginLeft: 15,
              alignItems: "center",
              marginVertical: SIZE.height(2),
            }}
            onPress={() => {
              UserService.resetUser();
              this.props.navigation.navigate("CREATE_USER");
            }}
          >
            <Text
              style={{
                color: "white",
                marginVertical: 10,
                marginHorizontal: 25,
                fontSize: SIZE.H14,
              }}
            >
              新しくユーザーを登録する
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          onPress={() => this.fetchApiGetListUser(false)}
          timeOut={10000}
        />
      );
    }
    return (
      <View
        style={{
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          flex: 1,
        }}
      >
        <StatusBar
          backgroundColor={APP_COLOR.BACKGROUND_COLOR}
          barStyle='dark-content'
        />
        <HeaderIconLeft goBack={goBack} />
        {this.renderContent()}
      </View>
    );
  }
}
