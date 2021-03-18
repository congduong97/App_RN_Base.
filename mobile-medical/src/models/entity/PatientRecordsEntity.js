import { PATIENT_RECORDS_TABLE } from "./Schema";

export default {
  name: PATIENT_RECORDS_TABLE,
  primaryKey: "id",
  properties: {
    id: { type: "int?" },
    patientRecordCode: { type: "string?" },
    name: { type: "string?" },
    gender: { type: "string?" },
    dob: { type: "date?" },
    healthInsuranceCode: { type: "string?" },
    height: { type: "double?" },
    weight: { type: "double?" },
    address: { type: "string?" },
    phone: { type: "string?" },
    email: { type: "string?" },
    avatar: { type: "string?" },
    userId: { type: "int?" },
    cityName: { type: "string?" },
    cityCode: { type: "string?" },
    districtName: { type: "string?" },
    districtCode: { type: "string?" },
    wardName: { type: "string?" },
    wardCode: { type: "string?" },
    relationship: { type: "string?" },
  },
};
