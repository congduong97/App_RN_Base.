import * as SchemaTable from "./Schema";
import AppConfigEntity from "./AppConfigEntity";
import AuthentEntity from "./AuthentEntity";
import UserEntity from "./UserEntity";
import HeathFacilitiesEntity from "./HeathFacilitiesEntity";
import PatientRecordsEntity from "./PatientRecordsEntity";
import RelationshipEntity from "./RelationshipEntity";
import ProvinceEntity from "./ProvinceEntity";
import HeathPacilitiesConfigEntity from "./HeathPacilitiesConfigEntity";
import TopicsEntity from "./TopicsEntity";
import MedicalServicesEntity from "./MedicalServicesEntity";
import CodePatientShortEntity from "./CodePatientShortEntity";
import MedicalReminderEntity from "./MedicalReminderEntity";

const schemaArray = [
  AppConfigEntity,
  AuthentEntity,
  UserEntity,
  HeathFacilitiesEntity,
  PatientRecordsEntity,
  RelationshipEntity,
  ProvinceEntity,
  HeathPacilitiesConfigEntity,
  TopicsEntity,
  MedicalServicesEntity,
  CodePatientShortEntity,
  MedicalReminderEntity
];

export {
  schemaArray,
  SchemaTable,
  AppConfigEntity,
  AuthentEntity,
  UserEntity,
  HeathFacilitiesEntity,
  PatientRecordsEntity,
  RelationshipEntity,
  ProvinceEntity,
  HeathPacilitiesConfigEntity,
  TopicsEntity,
  MedicalServicesEntity,
  CodePatientShortEntity,
  MedicalReminderEntity
};
