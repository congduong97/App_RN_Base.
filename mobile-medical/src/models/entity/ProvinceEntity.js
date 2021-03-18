import { PROVINCES_TABLE } from "./Schema";

export default {
  name: PROVINCES_TABLE,
  primaryKey: "id",
  properties: {
    id: { type: "int?" },
    name: { type: "string?" },
    areaCode: { type: "string?" },
    alias: { type: "string?" },
    parentCode: { type: "string?" },
    type: { type: "string?" },
    postalCode: { type: "string?" },
    status: { type: "int?" },
    priority: { type: "int?" },
    latitude: { type: "double?" },
    longitude: { type: "double?" },
    shortName: { type: "string?" },
    level: { type: "int?" },
  },
};
