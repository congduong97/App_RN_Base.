import React, { useEffect, createRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import messaging from "@react-native-firebase/messaging";

///

import SplashScreen from "../ui/screens/Splash";
import LoginScreen from "../ui/screens/Acounts/LoginScreen";
import VerifyPhoneScreen from "../ui/screens/VerifyPhoneScreen/index";
import SearchScreen from "../ui/screens/SearchScreen/index";
import HomeScreen from "../ui/screens/Home";
import ThongTinLichKhamScreen from "../ui/screens/ThongTinLichKhamScreen/index";
import XacThucThanhToanScreen from "../ui/screens/XacThucThanhToanScreen/index";
import ConfirmBankCard from "../ui/screens/XacThucThanhToanScreen/ConfirmBankCard";
import UpdateInfoUser from "../ui/screens/UpdateInfoUser/index";
///
import IntroduceScreen from "../ui/screens/Introduce";
///Bac sy
import DoctorSearchScreen from "../ui/screens/Doctor/SearchScreen";
import DoctorDetailScreen from "../ui/screens/Doctor/DoctorDetailScreen";
import DoctorFeedback from "../ui/screens/Doctor/DoctorFeedback";
import DoctorListingFeedback from "../ui/screens/Doctor/DoctorListingFeedback";

import FitterDoctorScreen from "../ui/screens/Doctor/FitterDoctorScreen";
import FilterSelectDoctor from "../ui/screens/Doctor/FilterSelectDoctor";
////Co so y te
import HealthFacilitiesSearch from "../ui/screens/HealthFacilities/SearchScreen";
import HealthFacilitiesDetail from "../ui/screens/HealthFacilities/HeathFacilitiesDetail";
// ////Gop ý
import FeedbackScreen from "../ui/screens/Feedback";
import FeedbackDetailScreen from "../ui/screens/Feedback/FeedbackDetailScreen";
import CreateFeedbackScreen from "../ui/screens/Feedback/CreateFeedbackScreen";
///

import HealthFacilitiesScreen from "../ui/screens/HealthFacilities/index";
import DetailHealthFacilitiesScreen from "../ui/screens/HealthFacilities/DetailHealthFacilitiesScreen";
import ExaminationResultsScreen from "../ui/screens/ExaminationResults/index";
import SearchExaminationResultsScreen from "../ui/screens/ExaminationResults/SearchScreen";
import FitterCodePatientScreen from "../ui/screens/ExaminationResults/FitterCodePatient";

import HealthDeclarationScreen from "../ui/screens/HealthDeclaration";
import HealthDeclarationListScreen from "../ui/screens/HealthDeclaration/HealthDeclarationListScreen";
import HealthDeclarationDetailScreen from "../ui/screens/HealthDeclaration/HealthDeclarationDetailScreen";
import NotificationsScreen from "../ui/screens/Notifications";
import WaitingApprovalScreen from "../ui/screens/Notifications/details/WaitingApprovalScreen";
import SearchAllScreen from "../ui/screens/GeneralInfo/SearchAllScreen";
import FiterCodeExaminationForm from "../ui/screens/AppointmentInfo/FiterCodeExaminationForm";
import {
  BookByDoctorScreen,
  BookByDayScreen,
  AppointmentInfoScreen,
} from "../ui/screens/BookAppointment";
/////ho so suc khoe
import CreateRecordScreen from "../ui/screens/PatientRecords/CreateRecord";
import PatientRecordsScreen from "../ui/screens/PatientRecords/PatientRecordsScreen";
import PatientInfoScreen from "../ui/screens/PatientRecords/PatientInfoScreen";
/////
import ChooseHealthFacilities from "../ui/screens/BookAppointment/ChooseHealthFacilities";
import ChooseBookTimeScreen from "../ui/screens/BookAppointment/ChooseBookTime";
import ChooseBookTimeByDoctor from "../ui/screens/BookAppointment/ChooseBookTime/ChooseBookTimeByDoctor";
import AboutScreen from "../ui/screens/GeneralInfo/AboutScreen";
import ContactScreen from "../ui/screens/GeneralInfo/ContactScreen";
import PrivacyPolicyScreen from "../ui/screens/GeneralInfo/PrivacyPolicyScreen";
import ContributeCommentsScreen from "../ui/screens/GeneralInfo/ContributeCommentsScreen";
import HistoryActivityScreen from "../ui/screens/GeneralInfo/HistoryActivityScreen";
import ExaminationCardScreen from "../ui/screens/AppointmentInfo/ExaminationCardScreen";
import AppointmentScreen from "../ui/screens/AppointmentInfo"; //Phieu kham
import ResultPatientScreen from "../ui/screens/ExaminationResults/ResultPatientScreen";
import RegulationsExaminationScreen from "../ui/screens/ExaminationResults/RegulationsExaminationScreen";
import DetailResultPatientScreen from "../ui/screens/ExaminationResults/DetailResultPatientScreen";
import IntroScreen from "../ui/screens/Splash/IntroScreen";
// import SearchScreen from "../ui/screens/SearchScreen";

// import FeedbackScreen from "../ui/screens/FeedbackScreen/index";
import FeedbackNewScreen from "../ui/screens/FeedbackScreen/FeedbackNewScreen";

import RegulationsBookScreen from "../ui/screens/GeneralInfo/RegulationsBookScreen";
import MainTabNavigator from "./MainTabNavigator";
import AppNavigate from "./AppNavigate";
import { useApp } from "../AppProvider";
/////
import NotificationsPopup from "../ui/screens/Notifications/popup";
import NotificationType from "../ui/screens/Notifications/NotificationType";
import models from "../models";
import schedule from "node-schedule";

import { NavigationCurrent } from "../components/NavigationCurrent";

export { AppNavigate, navigationRef };
const RootStack = createStackNavigator();
const navigationRef = createRef();
const isReadyRef = createRef();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

export default function App() {
  // const navigation = useNavigation();
  const { refDialog } = useApp();
  useEffect(() => {
    requestUserPermission();
    onPushLocalNotiPopup();
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from background state:"
          // remoteMessage.notification
        );
        clickNoti(JSON.stringify(remoteMessage));
      }

      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log("Voda day111", remoteMessage);
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:"
            // remoteMessage.notification
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!" + JSON.stringify(remoteMessage));
      showDialog(JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  /////
  const showDialog = (messageData) => {
    const notifiData = JSON.parse(messageData);
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <NotificationsPopup
            notifiData={notifiData.data}
            refDialog={refDialog.current}
            // onPress={handleSelected}
            navigation={navigationRef.current}
          />
        )
        .visibleDialog();
  };

  const clickNoti = (messageData) => {
    const { data } = JSON.parse(messageData);
    const { type, object } = data;
    const dataObject = JSON.parse(object);

    switch (type) {
      case NotificationType.SuccessfulAppointmentByDate:
      case NotificationType.SuccessfulAppointmentByDoctor:
      case NotificationType.RemindAppointmentByDate:
      case NotificationType.RemindAppointmentByDoctor:
        navigationRef.current?.navigate("ExaminationCardScreen", {
          idCard: dataObject?.id,
        });
        return;
      case NotificationType.FeedbackHospital:
        navigationRef.current?.navigate("FeedbackDetailScreen", {
          dataItem: dataObject,
        });
        return;
      case NotificationType.FeedbackDoctor:
        navigationRef.current?.navigate("DoctorDetailScreen", {
          dataItem: dataObject,
        });
        return;
      default:
        AppNavigate.navigateToNotifications(navigationRef.current.dispatch);
        return;
    }
  };

  const onPushLocalNotiPopup = () => {
    const data = models.getMedicalReminders();
    data.forEach((rs) => {
      if (rs.status === 1) {
        schedule.scheduleJob(rs.time, function () {
          refDialog &&
            refDialog?.current
              .configsDialog({
                // visibleClose: false,
                isScroll: true,
              })
              .drawContents(
                <NotificationsPopup
                  notifiData={{ type: NotificationType.MedicalReminder }}
                  refDialog={refDialog?.current}
                  navigation={null}
                />
              )
              .visibleDialog();
        });
      }
    });
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(event) => {
        let { index } = event;
        let nameScreen = event?.routes[index]?.name;
        NavigationCurrent.set(nameScreen);
      }}
      theme={MyTheme}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <RootStack.Navigator
        initialRouteName='SplashScreen'
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <RootStack.Navigator
        initialRouteName="PatientRecordsScreen"
        screenOptions={{
          headerShown: false,
        }}
      > */}
        <RootStack.Screen name='IntroduceScreen' component={IntroduceScreen} />
        <RootStack.Screen name='SplashScreen' component={SplashScreen} />
        <RootStack.Screen name='LoginScreen' component={LoginScreen} />
        <RootStack.Screen
          name='MainTabNavigator'
          component={MainTabNavigator}
        />
        {/* Bac sy */}
        <RootStack.Screen
          name='DoctorSearchScreen'
          component={DoctorSearchScreen}
        />
        <RootStack.Screen
          name='DoctorDetailScreen'
          component={DoctorDetailScreen}
        />
        <RootStack.Screen
          name='FitterDoctorScreen'
          component={FitterDoctorScreen}
        />
        <RootStack.Screen
          name='FilterSelectDoctor'
          component={FilterSelectDoctor}
        />
        <RootStack.Screen name='DoctorFeedback' component={DoctorFeedback} />
        <RootStack.Screen
          name={"DoctorListingFeedback"}
          component={DoctorListingFeedback}
        />
        <RootStack.Screen name={"UpdateInfoUser"} component={UpdateInfoUser} />

        {/* Co so y Te */}
        <RootStack.Screen
          name='HealthFacilitiesSearch'
          component={HealthFacilitiesSearch}
        />
        <RootStack.Screen
          name='HealthFacilitiesDetail'
          component={HealthFacilitiesDetail}
        />
        <RootStack.Screen
          name='HealthFacilitiesScreen'
          component={HealthFacilitiesScreen}
        />
        <RootStack.Screen
          name='DetailHealthFacilitiesScreen'
          component={DetailHealthFacilitiesScreen}
        />
        <RootStack.Screen
          name='ExaminationResultsScreen'
          component={ExaminationResultsScreen}
        />
        <RootStack.Screen
          name='FitterCodePatientScreen'
          component={FitterCodePatientScreen}
        />
        <RootStack.Screen
          name='HealthDeclarationScreen'
          component={HealthDeclarationScreen}
        />
        <RootStack.Screen
          name='HealthDeclarationListScreen'
          component={HealthDeclarationListScreen}
        />
        <RootStack.Screen
          name='HealthDeclarationDetailScreen'
          component={HealthDeclarationDetailScreen}
        />
        <RootStack.Screen
          name='NotificationsScreen'
          component={NotificationsScreen}
        />
        <RootStack.Screen
          name='WaitingApprovalScreen'
          component={WaitingApprovalScreen}
        />
        <RootStack.Screen name='SearchAllScreen' component={SearchAllScreen} />
        <RootStack.Screen name='BookByDayScreen' component={BookByDayScreen} />
        <RootStack.Screen
          name='BookByDoctorScreen'
          component={BookByDoctorScreen}
        />
        <RootStack.Screen
          name='RegulationsBookScreen'
          component={RegulationsBookScreen}
        />
        <RootStack.Screen
          name='PatientRecordsScreen'
          component={PatientRecordsScreen}
        />

        <RootStack.Screen
          name='CreateRecordScreen'
          component={CreateRecordScreen}
        />
        <RootStack.Screen
          name='PatientInfoScreen'
          component={PatientInfoScreen}
        />
        <RootStack.Screen
          name='ChooseHealthFacilities'
          component={ChooseHealthFacilities}
        />
        <RootStack.Screen
          name='ChooseBookTimeScreen'
          component={ChooseBookTimeScreen}
        />
        <RootStack.Screen
          name='ChooseBookTimeByDoctor'
          component={ChooseBookTimeByDoctor}
        />
        <RootStack.Screen name='AboutScreen' component={AboutScreen} />
        <RootStack.Screen
          name='PrivacyPolicyScreen'
          component={PrivacyPolicyScreen}
        />
        <RootStack.Screen name='ContactScreen' component={ContactScreen} />
        <RootStack.Screen
          name='ContributeCommentsScreen'
          component={ContributeCommentsScreen}
        />
        <RootStack.Screen
          name='HistoryActivityScreen'
          component={HistoryActivityScreen}
        />
        <RootStack.Screen
          name='ExaminationCardScreen'
          component={ExaminationCardScreen}
        />
        <RootStack.Screen
          name='AppointmentInfoScreen'
          component={AppointmentInfoScreen}
        />
        <RootStack.Screen
          name='AppointmentScreen'
          component={AppointmentScreen}
        />
        <RootStack.Screen
          name='ResultPatientScreen'
          component={ResultPatientScreen}
        />
        <RootStack.Screen
          name='RegulationsExaminationScreen'
          component={RegulationsExaminationScreen}
        />
        <RootStack.Screen
          name='SearchExaminationResultsScreen'
          component={SearchExaminationResultsScreen}
        />
        <RootStack.Screen
          name='DetailResultPatientScreen'
          component={DetailResultPatientScreen}
        />
        <RootStack.Screen name='FeedbackScreen' component={FeedbackScreen} />
        <RootStack.Screen
          name='FeedbackNewScreen'
          component={FeedbackNewScreen}
        />

        <RootStack.Screen
          name='FeedbackDetailScreen'
          component={FeedbackDetailScreen}
        />
        <RootStack.Screen
          name='CreateFeedbackScreen'
          component={CreateFeedbackScreen}
        />

        {/* ///// */}
        <RootStack.Screen
          name='VerifyPhoneScreen'
          component={VerifyPhoneScreen}
        />

        <RootStack.Screen name='SearchScreen' component={SearchScreen} />
        <RootStack.Screen name='HomeScreen' component={HomeScreen} />
        <RootStack.Screen
          name='ThongTinLichKhamScreen'
          component={ThongTinLichKhamScreen}
        />
        <RootStack.Screen
          name='XacThucThanhToanScreen'
          component={XacThucThanhToanScreen}
        />
        <RootStack.Screen name='ConfirmBankCard' component={ConfirmBankCard} />
        <RootStack.Screen name='IntroScreen' component={IntroScreen} />

        <RootStack.Screen
          name='FiterCodeExaminationForm'
          component={FiterCodeExaminationForm}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
