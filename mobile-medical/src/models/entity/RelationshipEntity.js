import { RELATIONSHIP_TABLE } from "./Schema";

export default {
  name: RELATIONSHIP_TABLE,
  primaryKey: "code",
  properties: {
    code: { type: "string?" },
    gender: { type: "string?" },
    name: { type: "string?" },
  },
};
