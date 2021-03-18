import { concatenateString } from "../../../../commons";
import models, { getGenderName } from "../../../../models";
import Objectkey from "./Objectkey";

export default class ObjectData {
  constructor(dataFilter) {
    if (dataFilter) {
      Object.assign(this, dataFilter);
      this[Objectkey.RelationshipName] = models.getRelationshipName(
        dataFilter?.relationship
      );
      this[Objectkey.GenderName] = getGenderName(dataFilter?.gender);
      this[Objectkey.AreaFullName] = concatenateString(
        ", ",
        dataFilter?.wardName,
        dataFilter?.districtName,
        dataFilter?.cityName
      );
      this[Objectkey.height] = dataFilter[Objectkey.height]
        ? dataFilter[Objectkey.height] + ""
        : "";
      this[Objectkey.weight] = dataFilter[Objectkey.weight]
        ? dataFilter[Objectkey.weight] + ""
        : "";
    }
  }
  initialData() {
    return this;
  }
}

export const handleArea = (data, recordData) => {
  !data?.cityCode
    ? delete recordData[Objectkey.cityCode]
    : (recordData[Objectkey.cityCode] = data?.cityCode);
  !data?.districtCode
    ? delete recordData[Objectkey.districtCode]
    : (recordData[Objectkey.districtCode] = data?.districtCode);
  !data?.wardCode
    ? delete recordData[Objectkey.wardCode]
    : (recordData[Objectkey.wardCode] = data?.wardCode);
  !data?.areaFullName
    ? delete recordData[Objectkey.AreaFullName]
    : (recordData[Objectkey.AreaFullName] = data?.areaFullName);
};

export const checkForm = (objectData) => {
  return (
    objectData[Objectkey.name] &&
    objectData[Objectkey.relationship] &&
    objectData[Objectkey.Gender] &&
    objectData[Objectkey.dob] &&
    objectData[Objectkey.cityCode] &&
    objectData[Objectkey.districtCode] &&
    objectData[Objectkey.wardCode] &&
    objectData[Objectkey.phone]
  );
};
