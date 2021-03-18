import { FB_TOPICS } from "./Schema";

export default {
  name: FB_TOPICS,
  primaryKey: "id",
  properties: {
    id: { type: "int?" },
    code: { type: "string?" },
    name: { type: "string?" },
    status: { type: "int?" },
  },
};
