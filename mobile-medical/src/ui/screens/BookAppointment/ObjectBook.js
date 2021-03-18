import { BookAppointmentKey } from "../../../models";
import ActionKey from "./ActionKey";
import { convertGetDateTime } from "../../../commons";

export default class ObjectBook {
  constructor(dataFilter) {
    if (dataFilter) {
      Object.assign(this, dataFilter);
    }
  }
  initialData() {
    return this;
  }
}

export const handleChooseValue = ({ id, data }, appointmentData) => {
  if (id === ActionKey.ShowPoupHeathFacilities) {
    appointmentData[BookAppointmentKey.HealthFacilityId] = data?.id;
    appointmentData[BookAppointmentKey.HealthFacilityName] = data?.name;
  } else if (id === ActionKey.ShowPopupMedicalServices) {
    appointmentData[BookAppointmentKey.MedicalServiceId] = data?.id;
    appointmentData[BookAppointmentKey.MedicalServiceName] = data?.name;
    appointmentData[BookAppointmentKey.MedicalServicePrice] = data?.price;
  } else if (id === ActionKey.ShowPopupMedicalSpecialist) {
    appointmentData[BookAppointmentKey.medicalSpecialityId] = data?.id;
    appointmentData[BookAppointmentKey.MedicalSpecialtyName] = data?.name;
  }
};
