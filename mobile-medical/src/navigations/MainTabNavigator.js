import React from "react";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import { IconView } from "../components";
import { IconViewType } from "../components/IconView";
import { Colors, Dimension, ImagesUrl } from "../commons";
import HomeScreen from "../ui/screens/Home";
import PatientRecordsScreen from "../ui/screens/PatientRecords/PatientRecordsScreen";
import GeneralInfoScreen from "../ui/screens/GeneralInfo";
import NotificationsScreen from "../ui/screens/Notifications";
import { View, Text, Image } from "react-native";
import { useSelector } from "react-redux";
const Tabs = AnimatedTabBarNavigator();

export default function MainTabNavigator() {
  const { resultNotifications } = useSelector(
    (state) => state.NotificationsReducer
  );

  return (
    <Tabs.Navigator
      appearence={{
        // dotCornerRadius: 10,
        whenInactiveShow: 'both',
        tabButtonLayout: 'vertical',
        dotSize: 'small',
        dotCornerRadius: 0,
        topPadding: 0,
        horizontalPadding: 0,
        bottomPadding: 0
      }}
      tabBarOptions={{
        //  floating: true,
        tabStyle: {
          //  fontSize: 11,
          // alignItems: "center",
          // shadowOpacity: 0.5,
          // shadowRadius: 2,
          // shadowOffset: {
          //   width: 0,
          //   height: 0,
          // },
          // shadowColor: "#000000",
          // elevation: 5,
          // padding: 0
        },
        labelStyle: {
          fontSize: 11
        },
        activeTintColor: Colors.colorMain,
        inactiveTintColor: Colors.colorTabMenuBarInActive,
        activeBackgroundColor: "white",

      }}
      tabBarPosition="bottom"
      lazy={true}
      initialRouteName="HomeScreen"
    >
      <Tabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <IconView
              name={"first-aid-kit"}
              size={Dimension.sizeIconMenu}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="PatientRecordsScreen"
        component={PatientRecordsScreen}
        initialParams={{ typeScreen: 1 }}
        options={{
          tabBarLabel: "Hồ sơ sức khỏe",
          tabBarIcon: ({ color }) => (
            // <Image source={ImagesUrl.singleIcon} style={{ tintColor: color, width: 26, height: 23, marginTop: 3, marginBottom: 3 }} />
            <IconView
              name={"ic_record"}
              size={Dimension.sizeIconMenu}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Thông báo",
          tabBarIcon: ({ color }) => (
            <View>
              {resultNotifications.totalUnread > 0 ?
                <View style={{
                  position: 'absolute',
                  backgroundColor: Colors.colorMain,
                  borderRadius: 20,
                  height: 25,
                  width: 25,
                  zIndex: 999,
                  left: 20,
                  bottom: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    color: '#ffff',
                    fontSize: 12,
                  }}>{resultNotifications.totalUnread > 99 ? "99+" : resultNotifications.totalUnread}</Text>
                </View>
                : <View></View>}
              <IconView
                name={"ic-bell"}
                size={Dimension.sizeIconMenu}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="GeneralInfoScreen"
        component={GeneralInfoScreen}
        options={{
          tabBarLabel: "Mở rộng",
          tabBarIcon: ({ color }) => (
            <IconView
              name={"ellipsis-horizontal-circle"}
              type={IconViewType.Ionicons}
              size={Dimension.sizeIconMenu}
              color={color}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
