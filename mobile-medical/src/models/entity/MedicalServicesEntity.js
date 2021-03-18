import { MEDICAL_SERVICES_TABLE } from "./Schema";

export default {
  name: MEDICAL_SERVICES_TABLE,
  primaryKey: "id",
  properties: {
    id: { type: "int?" },
    code: { type: "string?" },
    name: { type: "string?" },
    price: { type: "double?" },
    status: { type: "int?" },
    createdBy: { type: "string?" },
    createdDate: { type: "date?" },
    lastModifiedBy: { type: "string?" },
    lastModifiedDate: { type: "date?" },
  },
};
