import { HEATH_FACILITIES_CONFIG_TABLE } from "./Schema";

export default {
  name: HEATH_FACILITIES_CONFIG_TABLE,
  primaryKey: "id",
  properties: {
    id: { type: "int?" },
    healthFacilitiesId: { type: "int?" },
    appointmentDaily: { type: "int?" },
    appointmentDoctor: { type: "int?" },
    minutesPerAppointmentSchedule: { type: "int?" },
    startDayOfWeekMorning: { type: "int?" },
    endDayOfWeekMorning: { type: "int?" },
    startDayOfWeekAfternoon: { type: "int?" },
    endDayOfWeekAfternoon: { type: "int?" },
    startTimeMorning: { type: "string?" },
    endTimeMorning: { type: "string?" },
    startTimeAfternoon: { type: "string?" },
    endTimeAfternoon: { type: "string?" },
    allowTimeDefault: { type: "int?" },
    maxRegisteredPatientsByDaily: { type: "int?" },
    maxRegisteredPatientsByDoctor: { type: "int?" },
    connectWithHis: { type: "int?" },
    prepaymentMedicalService: { type: "int?" },
    status: { type: "int?" },
  },
};
