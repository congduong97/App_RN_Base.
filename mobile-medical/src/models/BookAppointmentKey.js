export default Object.freeze({
  TypeBook: "type",
  ///Thoi gian
  DateChoose: "DateChoose",
  TimeDisPlay: "TimeDisPlay",
  StartTime: "startTime",
  EndTime: "endTime",
  ///
  id: "id",//muc dich de dat lại lich kham
  MedicalReason: "medicalReason", // Lý do
  //Co so y te
  HealthFacilityId: "healthFacilityId",
  HealthFacilityName: "healthFacilityName",
  HealthFacilityAddress: "healthFacilityAdrress",
  connectWithHis: "connectWithHis", // kiểm tra xem cơ sở y tế này kn với his, duyệt tự động?1: kết nối với his.    2: không kn với his, duyệt tự động.    3: không kn với his, duyệt thủ công
  prepaymentMedicalService: "prepaymentMedicalService", // 1 cho phép thanh toán online, 2 là k
  ///chuyen khoa kham
  medicalSpecialityId: "medicalSpecialityId",
  MedicalSpecialtyName: "medicalSpecialtyName",
  ///phòng khám
  ClinicsId: "clinicId",
  ClinicName: "clinicName",
  ///
  //Bac si kham
  DoctorId: "doctorId",
  DoctorName: "doctorName",
  DoctorGender: "gender",
  AcademicCode: "AcademicCode", //them học hàm hoc vị để hiển thị thông báo
  AcademicName: "AcademicName", //them học hàm hoc vị để hiển thị thông báo
  workingTime: "workingTime", //them học hàm hoc vị để hiển thị thông báo
  DoctorAvatar: "doctorAvatar",
  //////
  ///benh nha
  PatientRecordId: "patientRecordId",
  PatientRecordName: "patientRecordName",
  PatientRecordCode: "patientRecordCode",
  PatientRecordBirthday: "patientRecordBirthday",
  HealthInsuranceCode: "healthInsuranceCode",
  PatientRecorAvatar: "PatientRecorAvatar",
  OldAppointmentCode: "oldAppointmentCode",

  ////
  HaveHealthInsurance: "haveHealthInsurance",
  HaveHealthInsuranceYes: "haveHealthInsuranceYes",
  HaveHealthInsuranceNo: "haveHealthInsuranceNo",
  IsReExamination: "isReExamination",
  IsReExaminationYes: "isReExaminationYes",
  IsReExaminationNo: "isReExaminationNo",
  //Dich vu kham
  MedicalServiceId: "medicalServiceId",
  MedicalServiceIdOld: "medicalServiceIdOld",
  MedicalServiceName: "medicalServiceName",
  MedicalServicePrice: "medicalServicePrice",
  MedicalServicePriceOld: "medicalServicePriceOld"
});
