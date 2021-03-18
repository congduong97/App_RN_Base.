import { MEDICAL_REMINDER_TABLE } from "./Schema";

export default {
  name: MEDICAL_REMINDER_TABLE,
  primaryKey: "id",
  properties: {
    id: { type: "string?" },
    time: { type: "date?" },
    status: { type: "int?" },
    name: { type: "string?" }
  },
};
