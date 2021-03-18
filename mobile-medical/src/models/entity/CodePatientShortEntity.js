import { CODE_PATIENT_SHORT_TABLE } from "./Schema";

export default {
  name: CODE_PATIENT_SHORT_TABLE,
  primaryKey: "id",
  properties: {
    id: { type: "int?" },
    codePatient: { type: "string?" },
  },
};
