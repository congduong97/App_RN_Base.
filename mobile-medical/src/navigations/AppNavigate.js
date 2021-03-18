import {
  StackActions,
  CommonActions,
  TabActions,
} from "@react-navigation/native";
import models from "../models";

async function navigateWhenAppStart(dispatch, params) {
  if (models.isLoggedIn()) {
    dispatch(StackActions.replace("MainTabNavigator", params));
  } else {
    dispatch(StackActions.replace("IntroScreen", params));
  }
}

async function navigateWhenAppStartAndSaveAccount(dispatch, params) {
  if (models.isLoggedInAndSaveAccount()) {
    dispatch(StackActions.replace("MainTabNavigator", params));
  } else {
    dispatch(StackActions.replace("IntroScreen", params));
  }
}

function navigateToDoctorSearch(dispatch, params) {
  dispatch(StackActions.push("DoctorSearchScreen", params));
}
function navigateToDoctorDetail(dispatch, params) {
  dispatch(StackActions.push("DoctorDetailScreen", params));
}
function navigateToDoctorFeedback(dispatch, params) {
  dispatch(StackActions.push("DoctorFeedback", params));
}
function navigateToListFeedback(dispatch, params) {
  dispatch(StackActions.push("DoctorListingFeedback", params));
}
function navigateToHealthFacilitySearch(dispatch, params) {
  dispatch(StackActions.push("HealthFacilitiesSearch", params));
}
function navigateToHealthFacilityScreen(dispatch, params) {
  dispatch(StackActions.push("HealthFacilitiesScreen", params));
}
function navigateToDetailHealthFacilityScreen(dispatch, params) {
  dispatch(StackActions.push("DetailHealthFacilitiesScreen", params));
}

function navigateToHealthFacilitiesDetail(dispatch, params) {
  dispatch(StackActions.push("HealthFacilitiesDetail", params));
}

function navigateToExaminationResultsSearch(dispatch, params) {
  dispatch(StackActions.push("ExaminationResultsScreen", params));
}

function navigateToSearchFitterCodePatientScreen(dispatch, params) {
  dispatch(StackActions.push("FitterCodePatientScreen", params));
}

function navigateToHealthDeclaration(dispatch, params) {
  dispatch(StackActions.push("HealthDeclarationScreen", params));
}

function navigateToHealthDeclarationList(dispatch, params) {
  dispatch(StackActions.push("HealthDeclarationListScreen", params));
}

function navigateToHealthDeclarationDetail(dispatch, params) {
  dispatch(StackActions.push("HealthDeclarationDetailScreen", params));
}

function navigateToNotifications(dispatch, params) {
  dispatch(StackActions.push("NotificationsScreen", params));
}

function navigateToWaitingApproval(dispatch, params) {
  dispatch(StackActions.push("WaitingApprovalScreen", params));
}

function navigateToSearchAll(dispatch, params) {
  dispatch(StackActions.push("SearchAllScreen", params));
}

function navigateToBookByDay(dispatch, params) {
  dispatch(StackActions.push("BookByDayScreen", params));
}

function navigateToBookByDoctor(dispatch, params) {
  dispatch(StackActions.push("BookByDoctorScreen", params));
}

function navigateToFitterDoctorScreen(dispatch, params) {
  dispatch(StackActions.push("FitterDoctorScreen", params));
}
function navigateToFilterSelectDoctor(dispatch, params) {
  dispatch(StackActions.push("FilterSelectDoctor", params));
}
function navigateToRegulationsBook(dispatch, params) {
  dispatch(StackActions.push("RegulationsBookScreen", params));
}

function navigateToPatientRecords(dispatch, params) {
  dispatch(StackActions.push("PatientRecordsScreen", params));
}

function navigateToCreateRecord(dispatch, params) {
  dispatch(StackActions.push("CreateRecordScreen", params));
}
function navigateToPatientInfo(dispatch, params) {
  dispatch(StackActions.push("PatientInfoScreen", params));
}
function navigateToChooseHealthFacilities(dispatch, params) {
  dispatch(StackActions.push("ChooseHealthFacilities", params));
}
function navigateToChooseBookTime(dispatch, params) {
  dispatch(StackActions.push("ChooseBookTimeScreen", params));
}
function navigateToChooseBookTimeByDoctor(dispatch, params) {
  dispatch(StackActions.push("ChooseBookTimeByDoctor", params));
}
function navigateToContact(dispatch, params) {
  dispatch(StackActions.push("ContactScreen", params));
}
function navigateToPrivacyPolicy(dispatch, params) {
  dispatch(StackActions.push("PrivacyPolicyScreen", params));
}
function navigateToIntroduce(dispatch, params) {
  dispatch(StackActions.push("IntroduceScreen", params));
}
function navigateToAbout(dispatch, params) {
  dispatch(StackActions.push("AboutScreen", params));
}
function navigateToContributeComments(dispatch, params) {
  dispatch(StackActions.push("ContributeCommentsScreen", params));
}
function navigateToHistoryActivity(dispatch, params) {
  dispatch(StackActions.push("HistoryActivityScreen", params));
}
function navigateToExaminationCard(dispatch, params) {
  dispatch(StackActions.push("ExaminationCardScreen", params));
}
function navigateToAppointmentInfo(dispatch, params) {
  dispatch(StackActions.push("AppointmentInfoScreen", params));
}
function navigateToAppointment(dispatch, params) {
  dispatch(StackActions.push("AppointmentScreen", params));
}
function navigateToResultPatient(dispatch, params) {
  dispatch(StackActions.push("ResultPatientScreen", params));
}
function navigateToRegulationsExaminationScreen(dispatch, params) {
  dispatch(StackActions.push("RegulationsExaminationScreen", params));
}
function navigateToSearchExaminationResults(dispatch, params) {
  dispatch(StackActions.push("SearchExaminationResultsScreen", params));
}
function navigateToDetailResultPatient(dispatch, params) {
  dispatch(StackActions.push("DetailResultPatientScreen", params));
}
function navigateToFeedbackScreen(dispatch, params) {
  dispatch(StackActions.push("FeedbackScreen", params));
}
function navigateToFeedbackNewScreen(dispatch, params) {
  dispatch(StackActions.push("FeedbackNewScreen", params));
}
function navigateToFeedback(dispatch, params) {
  dispatch(StackActions.push("FeedbackScreen", params));
}
function navigateToFeedbackDetail(dispatch, params) {
  dispatch(StackActions.push("FeedbackDetailScreen", params));
}
function navigateToCreateFeedback(dispatch, params) {
  dispatch(StackActions.push("CreateFeedbackScreen", params));
}
function navigateToSearchScreen(dispatch, params) {
  dispatch(StackActions.push("SearchScreen", params));
}
function navigateToXacThucThanhToanScreen(dispatch, params) {
  dispatch(StackActions.push("XacThucThanhToanScreen", params));
}
function navigateToConfirmBankCard(dispatch, params) {
  dispatch(StackActions.push("ConfirmBankCard", params));
}
function navigateToVerifyPhoneScreen(dispatch, params) {
  dispatch(StackActions.push("VerifyPhoneScreen", params));
}
function navigateToLoginScreen(dispatch, params) {
  dispatch(StackActions.push("LoginScreen", params));
}
function navigateToEditAccount(dispatch, params) {
  dispatch(StackActions.push("UpdateInfoUser", params));
}
function navigateToFiterCodeExaminationForm(dispatch, params) {
  dispatch(StackActions.push("FiterCodeExaminationForm", params));
}

function navigateToTabSetting(dispatch, params) {
  dispatch((state) => {
    return CommonActions.reset({ ...state, index: 3 });
  });
  // dispatch(
  //   CommonActions.reset({
  //     index: 3,
  //     routes: [
  //       {name: 'HomeScreen'},
  //       {name: 'SearchGuideScreen'},
  //       {name: 'OrderStack'},
  //       {
  //         name: 'AccountStack',
  //         params,
  //       },
  //     ],
  //   }),
  // );
  // dispatch(TabActions.jumpTo('AccountStack', params));
}

function navigateToTabPatientRecord(dispatch, params) {
  dispatch((state) => {
    return CommonActions.reset({ ...state, index: 1 });
  });
}

function navigateToTabHome(dispatch, params) {
  dispatch(TabActions.jumpTo("HomeScreen", params));

  // dispatch((state) => {
  //   return StackActions.popToTop();
  // });
}

function navigateToTabHome1(dispatch, params) {
  dispatch((state) => {
    return StackActions.popToTop();
  });
  // dispatch(TabActions.jumpTo("HomeScreen", params));
}

export default {
  navigateWhenAppStart,
  navigateWhenAppStartAndSaveAccount,
  navigateToTabHome,
  navigateToTabHome1,
  navigateToTabSetting,
  navigateToDoctorSearch, // tim kiem bac si
  navigateToDoctorDetail, // thong tin chi tiết bác sy
  navigateToDoctorFeedback, // nhận xét của bạn
  navigateToListFeedback, // danh sách nhận xét bác sỹ
  navigateToHealthFacilitySearch, // tim kiem co so y te
  navigateToHealthFacilityScreen, // man hinh home co so y te
  navigateToDetailHealthFacilityScreen, // chi tiet man hinh home co so y te
  navigateToExaminationResultsSearch, /// tim kiem ket qua kham
  navigateToHealthDeclaration, // To khai y te
  navigateToHealthDeclarationList,
  navigateToHealthDeclarationDetail,
  navigateToNotifications, // Thong bao
  navigateToSearchAll, // Tim kiem tat ca
  navigateToBookByDay, // Dat lịch kham theo ngauy
  navigateToBookByDoctor, // Dat lich kham theo bac si
  navigateToRegulationsBook, // Quy dinh dat lich kham,
  /////Ho so benh nhan
  navigateToCreateRecord, // Tao ho so benh nhan
  navigateToPatientRecords, // Danh sach benh nha
  navigateToPatientInfo, // Thông tin ho so
  navigateToTabPatientRecord, // Chuýena ng tab
  /////
  navigateToChooseHealthFacilities, // Chọnu co so kham benh
  navigateToChooseBookTime, // Chon thoi gian kham
  navigateToChooseBookTimeByDoctor, // Chon thoi gian kham
  navigateToContact, // Lien he
  navigateToPrivacyPolicy, // Chinh sach bao mat
  navigateToIntroduce, // Intro
  navigateToAbout, // Gioi thieu
  navigateToContributeComments, // Dong gop ý kien
  navigateToHistoryActivity, // Nhat ky hoat dong
  navigateToAppointmentInfo, // Thong tin lich kham
  navigateToAppointment, // Thong tin phieu kham
  navigateToExaminationCard, // Thong tin phieu kham
  navigateToHealthFacilitiesDetail, // Thông tin chi tiết bệnh viện

  navigateToResultPatient, // Kêt qua kham benh
  navigateToSearchExaminationResults, // search benh nhan
  navigateToSearchFitterCodePatientScreen, // search benh nhan
  navigateToDetailResultPatient, // search benh nhan
  //Gop y
  navigateToFeedbackScreen, // Màn hình góp ý
  navigateToFeedbackNewScreen, // tao góp ý

  navigateToFeedback, //Danh sach gop y
  navigateToFeedbackDetail, // chi tiet gop ý
  navigateToCreateFeedback, // Tao moi gop y
  navigateToSearchScreen, // Tao moi gop y
  navigateToWaitingApproval, // Chi tiet thong báo cho duyet lich
  navigateToFitterDoctorScreen, //
  navigateToFilterSelectDoctor, //
  navigateToXacThucThanhToanScreen, ///
  navigateToConfirmBankCard, ///

  navigateToVerifyPhoneScreen, /// xac thuc so phone
  navigateToRegulationsExaminationScreen, /// xac thuc so phone
  navigateToLoginScreen,
  navigateToEditAccount,
  navigateToFiterCodeExaminationForm,
};
