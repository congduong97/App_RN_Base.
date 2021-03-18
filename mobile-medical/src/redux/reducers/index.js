import { combineReducers } from "redux";
import CommonsReducer from "./Commons";
import AccountReducer from "./Account";
import MakeAppointmentReducer from "./MakeAppointment";
import PatientRecordsReducer from "./PatientRecords";
import HeathFacilitiesReducer from "./HeathFacilities";
import NotificationsReducer from "./Notifications";
import FeedbacksReducer from "./Feedbacks";
import HealthDeclarationReducer from "./HealthDeclaration";
import DoctorReducer from "./Doctors";

const rootReducer = combineReducers({
  CommonsReducer,
  AccountReducer,
  MakeAppointmentReducer,
  HeathFacilitiesReducer,
  PatientRecordsReducer,
  NotificationsReducer,
  FeedbacksReducer,
  HealthDeclarationReducer,
  DoctorReducer,
});
export default rootReducer;
