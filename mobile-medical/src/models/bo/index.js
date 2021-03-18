import * as AppConfigs from "./AppConfigs";
import * as Authent from "./Authent";
import * as User from "./User";
import * as HeathFacilities from "./HeathFacilities";
import * as PatientRecords from "./PatientRecords";
import * as MedicalServices from "./MedicalServices";
import * as Province from "./Province";
import * as CodePatientShortServices from "./CodePatientShortServices";
import * as MedicalReminder from "./MedicalReminder";

export default {
  ...AppConfigs,
  ...Authent,
  ...User,
  ...HeathFacilities,
  ...PatientRecords,
  ...MedicalServices,
  ...Province,
  ...CodePatientShortServices,
  ...MedicalReminder
};
