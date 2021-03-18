import OptionStore from "../screen/OptionStore";
import HistoryStore from "../screen/HistoryStore";
import ListStoreInDistrict from "../screen/ListStoreInDistrict";
import Camera from "../screen/Camera";
import DetailOrderPrescription from "../screen/DetailOrderPrescription";
import NearbyStore from "../screen/NearbyStore";
import SuccessNotification from "../screen/SuccessNotification";
import StoreDetailOnMap from "../screen/StoreDetailOnMap";
export const ChooseStoreStack = {
  OPTION_STORE: {
    screen: OptionStore,
  },
  HISTORY_STORE: {
    screen: HistoryStore,
  },
  NEARBY_STORE: {
    screen: NearbyStore,
  },
  LIST_STORE_DISTRICT: {
    screen: ListStoreInDistrict,
  },
  STORE_DETAIL_ON_MAP: {
    screen: StoreDetailOnMap
  },
  CAMERA: {
    screen: Camera,
  },
  DETAIL_ORDER_PRESCRIPTION: {
    screen: DetailOrderPrescription,
  },
  SUCCESS_NOTIFICATION: {
    screen: SuccessNotification
  }
};
