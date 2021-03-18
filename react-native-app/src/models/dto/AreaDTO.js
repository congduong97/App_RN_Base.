export default class AreaDTO {
  constructor(dataInput) {
    let areaData = [];
    if (dataInput && dataInput.length > 0) {
      areaData = dataInput.map((item) => {
        let parentId = '';
        let parentName = '';
        if (item['district']) {
          parentId = item['district']?.id;
          parentName = item['district']?.name;
        }
        if (item['province']) {
          parentId = item['province']?.id;
          parentName = item['province']?.name;
        }
        // console.log(item);
        return {
          id: item?.id,
          code: item?.code,
          name: item?.name,
          parentId,
          parentName,
        };
      });
    }
    return areaData
  }
}
