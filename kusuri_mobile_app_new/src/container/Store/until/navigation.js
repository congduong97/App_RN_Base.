import StoreScreen from "../screen/StoreScreen";
import StoreMap from "../screen/StoreMap";
import DetailStore from "../screen/DetailStore";
import WebViewScreen from '../screen/WebViewScreen';
export const StoreStack = {
  STORE: {
    screen: StoreScreen,
    navigationOptions: {
      header: null
    }
  },
  StoreMap: {
    screen: StoreMap,
    navigationOptions: {
      header: null
    }
  },
  DetailStore: {
    screen: DetailStore,
    navigationOptions: {
      header: null
    }
  },
  WebViewScreen:{
    screen: WebViewScreen,
    navigationOptions: {
      header: null
    }
  }

};
