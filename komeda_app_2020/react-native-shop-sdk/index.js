import {NativeModules} from 'react-native';
import ReactBanner from './banner/ReactBanner';
import {RNShopSDKWebLink} from './weblink/RNShopSDKWebLink';

const {RNShopSdk,ShopSdk} = NativeModules;
console.log('NativeModules', NativeModules);

let RNShopSdkBanner = ShopSdk;
if(RNShopSdk) RNShopSdkBanner=RNShopSdk;
export {RNShopSdkBanner, RNShopSDKWebLink, ReactBanner};
