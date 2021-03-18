const typeConfigs = {
  SyncData: 1,
  Setting: 2,
};

export default {
  SyncData: {
    id: 1,
    name: 'Đồng bộ',
    code: 'SYNC-DATA',
    value: false,
    descriptions: 'Đã đồng bộ xong chưa',
    type: typeConfigs.SyncData,
  },
  QuickOrder: {
    id: 2,
    name: 'Đặt hàng nhanh',
    code: 'QUICK_ORDER',
    value: false,
    descriptions: 'Lưu thông tin đặt hàng nhanh hay không',
    type: typeConfigs.Setting,
  },
  ShowWebPrices: {
    id: 3,
    name: 'Hiển thị giá Web',
    code: 'SHOW_WEB_PRICE',
    value: false,
    descriptions: 'Lưu thông tin đặt có hiển thị giá Web không',
    type: typeConfigs.Setting,
  },
  CompactUnit: {
    id: 4,
    name: 'Copy theo đơn vị K',
    code: 'COMPACT_UNTIT',
    value: false,
    descriptions: 'Lưu thông tin đặt có Copy theo đơn vị K',
    type: typeConfigs.Setting,
  },
};
