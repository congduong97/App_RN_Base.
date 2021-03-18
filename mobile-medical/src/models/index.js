import BusinessDB from "./bo";

import {
  periodDataMorning,
  periodDataAfternoon,
  configLocate,
  Gender,
  getGenderName,
} from "./ConfigApp";
import BookAppointmentKey from "./BookAppointmentKey";
export {
  BookAppointmentKey,
  periodDataMorning,
  periodDataAfternoon,
  configLocate,
  Gender,
  getGenderName,
};
export default {
  ...BusinessDB,
  periodDataMorning,
  periodDataAfternoon,
  configLocate,
  Gender,
  getGenderName,
};
