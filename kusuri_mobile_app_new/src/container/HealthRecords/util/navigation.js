import SettingRecords from "../screen/SettingRecords";
import ElinkRecords from "../screen/ElinkRecords";
import QuestionRecords from "../screen/QuestionRecords";
import PrescriptionDetails from "../screen/PrescriptionDetails";
import HomeRecords from "../screen/HomeRecords";
import RegisterHomeMedicineRecord from "../screen/RegisterHomeMedicineRecord";
import RegisterQR from "../screen/RegisterQR";
import ListUserOfMember from "../screen/ListUserOfMember";
import CreateUser from "../screen/CreateUser";
import DetailUser from "../screen/DetailUser";
import ChangeBasicUserInfo from "../screen/ChangeBasicUserInfo";
import ChangeDetailUserInfo from "../screen/ChangeDetailUserInfo";
import ChangeSpecialUserInfo from "../screen/ChangeSpecialUserInfo";
import ListRegisteredMedicine from "../screen/ListRegisteredMedicine";
import RegisterManualPrescription from "../screen/RegisterManualPrescription";
import RegisterOrUpdateMedicine from "../screen/RegisterOrUpdateMedicine";
import RegisterMarketDrug from "../screen/RegisterMarketDrug";
import Term from "../screen/Term";
import NotificationSuccess from "../screen/NotificationSuccess";


export const HealthRecordsStack = {
  SETTINGS_RECORDS: {
    screen: SettingRecords,
  },
  ELINK_RECORDS: {
    screen: ElinkRecords,
  },
  DRUG_USING_APP: {
    screen: QuestionRecords,
  },
  HEALTH_RECORD: {
    screen: HomeRecords,
  },
  HOME_REGISTER_MEDICINE_RECORD: {
    screen: RegisterHomeMedicineRecord,
  },
  QR_REGISTER: { screen: RegisterQR },
  PRESCRIPTION_DETAILS: { screen: PrescriptionDetails },
  LIST_USER_OF_MEMBER: {
    screen: ListUserOfMember,
  },
  CREATE_USER: {
    screen: CreateUser,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  DETAIL_USER: {
    screen: DetailUser,
  },
  CHANGE_BASIC_INFO: {
    screen: ChangeBasicUserInfo,
  },
  CHANGE_DETAIL_INFO: {
    screen: ChangeDetailUserInfo,
  },
  CHANGE_SPECIAL_INFO: {
    screen: ChangeSpecialUserInfo,
  },
  LIST_REGISTER_MEDICINE: {
    screen: ListRegisteredMedicine,
  },
  REGISTER_MANUAL_PRESCRIPTION: {
    screen: RegisterManualPrescription,
  },
  REGISTER_MANUAL_MEDICINE: {
    screen: RegisterOrUpdateMedicine,
  },
  DRUG_TERM: { screen: Term },
  REGISTER_MARKET_DRUG: {
    screen: RegisterMarketDrug,
  },
  NOTIFICATION_SUCCESS: {
    screen: NotificationSuccess,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },

};
