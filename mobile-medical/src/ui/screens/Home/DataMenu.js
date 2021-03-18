import { Colors, NavigationKey } from "../../../commons";

const dataMenu1 = [
  {
    id: 1,
    iconName: "ic-stethoscope",
    title: "Tra cứu Bác sĩ",
    color: Colors.colorMain,
    bgColor: "#00C6AD80",
  },
  {
    id: 2,
    iconName: "ic-circle-plus",
    title: "Tra cứu cơ sở y tế",
    color: Colors.colorCancel,
    bgColor: Colors.colorBtEdit,
  },
  {
    id: 3,
    iconName: "ic-report",
    title: "Tra cứu kết quả khám",
    color: Colors.colorIcon,
    bgColor: "#2AD3E780",
  },
  {
    id: 4,
    iconName: "ic-diseases-person",
    title: "Tờ khai y tế Covid-19",
    color: Colors.colorCancel,
    bgColor: Colors.colorBtEdit,
  },
];

const dataMenu2 = {
  BookByDay: {
    id: NavigationKey.NextToBookByDay,
    iconName: "ic-medical",
    title: "Đặt lịch khám",
    bgColor: Colors.colorBtEdit,
    iconColor: Colors.colorCancel,
    bgIconColor: "#FF6F5B70",
  },
  BookByDoctor: {
    id: NavigationKey.NextToBookByDoctor,
    iconName: "ic-validating-ticket",
    title: "Đặt lịch khám theo bác sỹ",
    bgColor: Colors.colorBtBack,
    iconColor: Colors.colorIcon,
    bgIconColor: "#00C6AD70",
  },
};

export { dataMenu1, dataMenu2 };
