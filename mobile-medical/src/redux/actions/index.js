import * as types from "./actionTypes";
import * as CommonActions from "./Commons";
import * as AccountActions from "./Account";
import * as MakeAppointment from "./MakeAppointment";
import * as HeathFacilities from "./HeathFacilities";
import * as PatientRecords from "./PatientRecords";
import * as Notifications from "./Notifications";
import * as Feedback from "./Feedback";
import * as HealthDeclaration from "./HealthDeclaration"
import * as DoctorActions from "./DoctorActions"
export { types };

const actions = {
  ...CommonActions,
  ...AccountActions,
  ...MakeAppointment,
  ...HeathFacilities,
  ...PatientRecords,
  ...Notifications,
  ...Feedback,
  ...HealthDeclaration,
  ...DoctorActions,
};

export default actions;
