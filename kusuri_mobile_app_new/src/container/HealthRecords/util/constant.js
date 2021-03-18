const TYPE_USER_INFO_SPECIAL = {
  HISTORY_ALLERGY: "HISTORY_ALLERGY",
  HISTORY_SIDE_EFFECT: "HISTORY_SIDE_EFFECT",
  HISTORY_ILLNESS: "HISTORY_ILLNESS",
  OTHER: "OTHER",
};
const TYPE_UPDATE = {
  BASIC: "BASIC",
  DETAIL: "DETAIL",
  SPECIAL: "SPECIAL",
};
const COLOR_TEXT = "black";
const COLOR_GREEN_PRIMARY = "#06B050";

const TYPE_MODAL = {
  DELETE: "DELETE",
  CONFIRM: "CONFIRM",
};

const STRING_VALIDATE = {
  //Đăng kí đơn thuốc thành công:
  Register_Prescription_Success: "Register Prescription Success!",
  //Đăng kí đơn thuốc thất bại:
  Register_Prescription_Error: "Register_Prescription_Error",
  //Không có câu hỏi và câu trả lời nào:
  Not_Have_Question: "Not Have Question",
  //Chưa khởi tạo user:
  Not_Have_Current_User: "Not_Have_Current_User",
  //Vui lòng nhập đầy đủ thông tin:
  Please_Check_Validate_Info_Input: "Please_Check_Validate_Info_Input",
  //Tên thuốc là bắt buộc:
  Need_DrugName: "Need_DrugName",
  //Dạng bào chế là bắt buộc:
  Need_DosageFormCode: "Need_DosageFormCode",
  //Lượng sử dụng là bắt buộc:
  Need_Dosing: "Need_Dosing",
  //Lượng thuốc được kê là bắt buộc:
  Need_DrugVolume: "Need_DrugVolume",
  //Cách dùng là bắt buộc:
  Need_UsingInstruction: "Need_UsingInstruction",
};
const EVENT_CHANGE_CURRENT_USER = "EVENT_CHANGE_CURRENT_USER";
const DOSAGE_FORM_CODE_DATA = [
  {
    //Thuốc uống:
    id: 1,
    name: "内服",
    code: "1",
    dosageFormCode_301_5: "使用量(1日)",
    drugVolume_301_3: "",
    drugUnitName_301_4: "日分",
    dosageFormCode: "ORAL_DRUG",
    dosageFormCodeContent: "内服", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(1日)", //Nhãn cột 3.
  },
  {
    //Thuốc nhỏ:
    id: 2,
    name: "内滴",
    code: "2",
    dosageFormCode_301_5: "使用量(1日)",
    drugVolume_301_3: "1固定",
    drugUnitName_301_4: "調剤",
    dosageFormCode: "DROP_DRUG",
    dosageFormCodeContent: "内滴", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(1日)", //Nhãn cột 3.
  },
  {
    //Thuốc do bác sĩ kê đơn:
    id: 3,
    name: "頓服",
    code: "3",
    dosageFormCode_301_5: "使用量(1回)",
    drugVolume_301_3: "",
    drugUnitName_301_4: "回分",
    dosageFormCode: "CLOTHES_DRUG",
    dosageFormCodeContent: "頓服", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(1回)", //Nhãn cột 3.
  },
  {
    //Thuốc tiêm:
    id: 4,
    name: "注射",
    code: "4",
    dosageFormCode_301_5: "使用量(全量)",
    drugVolume_301_3: "1固定",
    drugUnitName_301_4: "調剤",
    dosageFormCode: "INJECT_DRUG",
    dosageFormCodeContent: "注射", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(全量)", //Nhãn cột 3.
  },
  {
    //Thuốc bôi ngoài da:
    id: 5,
    name: "外用",
    code: "5",
    dosageFormCode_301_5: "使用量(全量)",
    drugVolume_301_3: "1固定",
    drugUnitName_301_4: "調剤",
    dosageFormCode: "TOPICAL_DRUG",
    dosageFormCodeContent: "外用", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(全量)", //Nhãn cột 3.
  },
  {
    //Thuốc bắc, sẵc lên rồi uống:
    id: 6,
    name: "浸煎",
    code: "6",
    dosageFormCode_301_5: "使用量(1日)",
    drugVolume_301_3: "",
    drugUnitName_301_4: "日分",
    dosageFormCode: "DECOCTION_DRUG",
    dosageFormCodeContent: "浸煎", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(1日)", //Nhãn cột 3.
  },
  {
    //Thuốc uống nóng:
    id: 7,
    name: "湯",
    code: "7",
    dosageFormCode_301_5: "使用量(1日)",
    drugVolume_301_3: "",
    drugUnitName_301_4: "日分",
    dosageFormCode: "HOT_WATER_DRUG",
    dosageFormCodeContent: "湯", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(1日)", //Nhãn cột 3.
  },
  {
    //Có cái thuốc này id = 8 nhưng mã code nó trong tài liệu là 9 nhé. (Thuốc nguyên liệu)
    id: 8,
    name: "材料",
    code: "9",
    dosageFormCode_301_5: "使用量(全量)",
    drugVolume_301_3: "1固定",
    drugUnitName_301_4: "調剤",
    dosageFormCode: "RAW_DRUG",
    dosageFormCodeContent: "材料", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(全量)", //Nhãn cột 3.
  },
  {
    //Có cái thuốc này id = 9 nhưng mã code nó trong tài liệu là 10 nhé. (Loại khác)
    id: 9,
    name: "その他",
    code: "10",
    dosageFormCode_301_5: "使用量(全量)",
    drugVolume_301_3: "1固定",
    drugUnitName_301_4: "調剤",
    dosageFormCode: "OTHERS",
    dosageFormCodeContent: "その他", //Nội dung cột 2.
    dosageFormCodeDescription: "使用量(全量)", //Nhãn cột 3.
  },
];

//Dữ liệu liều lượng sử dụng cho ModalInputSelect:
const DATA_DOSE_AND_UNIT_NAME = [
  //viên nang:
  "錠",
  "g",
  "mg",
  "ml",
  //viên con nhộng:
  "カプセル",
  //gói đếm thuốc bột:
  "包",
  //Túi:
  "袋",
  //Ống:
  "筒",
  //Chiếc, viên:
  "個",
  //Chiếc:
  "本",
  //Tấm:
  "枚",
  //tấm miếng:
  "シート",
  // clgt???
  "ブリスター",
  //Đơn vị:
  "単位",
  //Loại khác:
  "その他",
];

//Dữ liệu liều lượng được kê cho ModalInputSelect:
const DATA_DRUG_VOLUME_AND_UNIT_NAME = ["日分", "調剤", "回分"];

//Ojb mặc định khởi tạo thuốc mới:(Không phải đơn thuốc mới nhé!)
const mapRpDtoDefault = (rpNumberNext) => {
  return {
    doctorMakeOutPresId: null,
    id: null,
    p201_drugInfos: [
      {
        dosing: null,
        drugCode: null,
        drugCodeType: "RECEIVE_COMPUTER_CODE",
        drugName: null,
        id: null,
        imageName: null,
        imageUrl: null,
        medicateInfoId: null,
        p281_additionalDrugs: [
          {
            content: null,
            drugInfoId: null,
            id: null,
            medicateInfoId: null,
            recordCreator: "PATIENT",
            rpNumber: rpNumberNext,
          },
        ],
        p291_usingDrugNotes: [
          {
            content: null,
            drugInfoId: null,
            id: null,
            medicateInfoId: null,
            recordCreator: "PATIENT",
            rpNumber: rpNumberNext,
          },
        ],
        recordCreator: "PATIENT",
        rpInfoId: null,
        rpNumber: rpNumberNext,
        unitName: null,
        usingInstructionId: null,
      },
    ],
    p301_usingInstruction: {
      dosageFormCode: null,
      drugUnitName: null,
      drugVolume: null,
      dosageFormCodeContent: null,
      dosageFormCodeDescription: null,
      id: null,
      medicateInfoId: null,
      recordCreator: "PATIENT",
      rpInfoId: null,
      rpNumber: rpNumberNext,
      unitName: null,
      usageCode: null,
      usageCodeType: "NO_CODE",
      usingInstructionName: null,
      p311_additionalUsingInstructions: [
        {
          content: null,
          id: null,
          medicateInfoId: null,
          recordCreator: "PATIENT",
          rpInfoId: null,
          rpNumber: rpNumberNext,
          usingInstructionId: null,
        },
      ],
    },
    p391_noteWhenTakingDrugs: [
      {
        content: null,
        id: null,
        medicateInfoId: null,
        recordCreator: "PATIENT",
        rpInfoId: null,
        rpNumber: rpNumberNext,
      },
    ],
    rpNumber: rpNumberNext,
  };
};

export {
  TYPE_USER_INFO_SPECIAL,
  TYPE_UPDATE,
  COLOR_TEXT,
  TYPE_MODAL,
  mapRpDtoDefault,
  DOSAGE_FORM_CODE_DATA,
  DATA_DOSE_AND_UNIT_NAME,
  DATA_DRUG_VOLUME_AND_UNIT_NAME,
  COLOR_GREEN_PRIMARY,
  STRING_VALIDATE,
  EVENT_CHANGE_CURRENT_USER,
};
