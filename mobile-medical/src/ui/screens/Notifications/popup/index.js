import NotificationType from "../NotificationType";
import WaitingApproval from "./WaitingApproval";
import RefuseAppointment from "./RefuseAppointment";
import FeedbackHospital from "./FeedbackHospital";
import SuccessfulAppointment from "./SuccessfulAppointment";
import RemindAppointment from "./RemindAppointment";
import ChangeAppointment from "./ChangeAppointment";
import ChangeAppointmentSuccess from "./ChangeAppointmentSuccess";
import WarningCancelAppointment from "./WarningCancelAppointment";
import CancelAppointment from "./CancelAppointment";
import MedicalReminder from "./MedicalReminder";
import CLSsuggest from "./CLSsuggest";
import CLSresult from "./CLSresult";
import FeedbackHospitalDone from "./FeedbackHospitalDone";
import FeedbackDoctor from "./FeedbackDoctor";
import SystemNoti from "./SystemNoti";
import CancelLichKham from "./CancelLichKham";
export { WaitingApproval };

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotificationsPopup(props) {
  const { refDialog, notifiData, navigation } = props;
  const { type } = notifiData;
  let popupView = () => {
    switch (type) {
      case NotificationType.WaitingApproval:
        return (
          <WaitingApproval navigation={navigation} refDialog={refDialog} />
        );
      case NotificationType.RefuseAppointment:
        return (
          <RefuseAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.SuccessfulAppointmentByDate:
        return (
          <SuccessfulAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.SuccessfulAppointmentByDoctor:
        return (
          <SuccessfulAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.RemindAppointmentByDate:
        return (
          <RemindAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData} />
        );
        case NotificationType.RemindAppointmentByDotor:
        return (
          <RemindAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData} />
        );
      case NotificationType.ChangeAppointment:
        return (
          <ChangeAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.ChangeAppointmentSuccess:
        return (
          <ChangeAppointmentSuccess navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.WarningCancelAppointment:
        return (
          <WarningCancelAppointment navigation={navigation} refDialog={refDialog} />
        );
      case NotificationType.CancelAppointmentSuccess:
        return (
          <CancelAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.CancelAppointmentFailed:
        return (
          <CancelAppointment navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.MedicalReminder:
        return (
          <MedicalReminder navigation={navigation} refDialog={refDialog} />
        );
      case NotificationType.CLSsuggest:
        return (
          <CLSsuggest navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        )
      case NotificationType.CLSresult:
        return (
          <CLSresult navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        )
      case NotificationType.FeedbackHospital:
        return (
          <FeedbackHospital navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.FeedbackHospitalDone:
        return (
          <FeedbackHospitalDone navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.FeedbackDoctor:
        return (
          <FeedbackDoctor navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.SystemNoti:
        return (
          <SystemNoti navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.CancelAppointment:
        return (
          <CancelLichKham navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      case NotificationType.RemindAppointmentByDoctor:
        return (
          <SystemNoti navigation={navigation} refDialog={refDialog} notifiData={notifiData}/>
        );
      default:
        break;
    }
  };
  return <View>{popupView()}</View>;
}

const styles = StyleSheet.create({});
