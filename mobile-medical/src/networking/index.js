import networking, { instance, requestALl, post, get } from "./ApiHelper";

import * as ApiUrl from "./ApiUrl";
import CommonsAPI from "./Commons";
import AccountAPI from "./Account";
import HeathFacilitiesAPI from "./HeathFacilitiesAPI";
import PantientAPI from "./PantientAPI";
import ExaminationCardAPI from "./ExaminationCardAPI";
import DoctorAPI from "./DoctorAPI";
import Notifications from "./NotificationsAPI";
import FeedbackAPI from "./FeedbackAPI";
import AppointmentsAPI from "./Appointments";
import GeneralInfoAPI from "./GeneralInfoAPI";
import PaymentVerificationAPI from "./PaymentVerification";
import HealthDeclarationAPI from "./HealthDeclarationAPI";
import OTPGeneratorApi from "./OTPGeneratorApi";

export { ApiUrl, instance, requestALl, post, get };

export default {
  instance,
  requestALl,
  post,
  get,
  ...CommonsAPI,
  ...AccountAPI,
  ...HeathFacilitiesAPI,
  ...PantientAPI,
  ...ExaminationCardAPI,
  ...DoctorAPI,
  ...Notifications,
  ...FeedbackAPI,
  ...AppointmentsAPI,
  ...GeneralInfoAPI,
  ...PaymentVerificationAPI,
  ...HealthDeclarationAPI,
  ...OTPGeneratorApi,
};
