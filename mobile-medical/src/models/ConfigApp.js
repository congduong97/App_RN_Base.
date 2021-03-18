export const configLocate = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  dayNames: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Aujourd'hui",
};

export const periodDataMorning = [
  {
    id: 1,
    title: "08:00 - 08:30",
    startTime: "08:00",
    endTime: "08:30",
  },
  {
    id: 2,
    title: "08:30 - 09:00",
    startTime: "08:30",
    endTime: "09:00",
  },
  {
    id: 3,
    title: "09:00 - 09:30",
    startTime: "90:00",
    endTime: "09:30",
  },
  {
    id: 4,
    title: "09:30 - 10:00",
    startTime: "09:30",
    endTime: "10:00",
  },
  {
    id: 5,
    title: "10:00 - 10:30",
    startTime: "10:00",
    endTime: "10:30",
  },
  {
    id: 6,
    title: "10:30 - 11:00",
    startTime: "10:30",
    endTime: "11:00",
  },
  {
    id: 7,
    title: "11:00 - 11:30",
    startTime: "11:00",
    endTime: "13:30",
  },
];
export const periodDataAfternoon = [
  {
    id: 8,
    title: "13:00 - 13:30",
    startTime: "13:00",
    endTime: "13:30",
  },
  {
    id: 9,
    title: "13:30 - 14:00",
    startTime: "13:30",
    endTime: "14:00",
  },
  {
    id: 10,
    title: "14:00 - 14:30",
    startTime: "14:00",
    endTime: "14:30",
  },
  {
    id: 11,
    title: "14:30 - 15:00",
    startTime: "14:30",
    endTime: "15:00",
  },
  {
    id: 12,
    title: "15:00 - 15:30",
    startTime: "15:00",
    endTime: "15:30",
  },
  {
    id: 13,
    title: "15:30 - 16:00",
    startTime: "15:30",
    endTime: "16:00",
  },
  {
    id: 14,
    title: "16:00 - 16:30",
    startTime: "16:00",
    endTime: "16:30",
  },
];
export const Gender = [
  {
    id: 1,
    name: "Nam",
    code: "MALE",
  },
  {
    id: 2,
    name: "Nữ",
    code: "FEMALE",
  },
  {
    id: 3,
    name: "Khác",
    code: "OTHER",
  },
];

export const getGenderName = (code) => {
  if (code) {
    let dataGender = Gender.filter((item) => item.code == code.toUpperCase())
    return dataGender && dataGender[0] && dataGender[0].name ? dataGender[0].name: '';
  }
  return "...";
};
// Gender.filter((item) => item.code === code)[0].name;
