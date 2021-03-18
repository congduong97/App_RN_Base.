
package jp.co.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

import java.util.*;

import android.content.Context;
import android.util.Log;
import android.content.Intent;
import android.app.Activity;
import android.location.LocationManager;
import android.os.Build;
import android.content.pm.PackageManager;

import jp.co.android.ads.AdsSdk;
import jp.co.android.ads.DataSenderListener;

import org.json.JSONObject;

public class RNShopSdkModule extends ReactContextBaseJavaModule {

  private final static String TAG = "RNShopSdkModule";
  private final ReactApplicationContext reactContext;
  private final static int PERMISSION_ACCESS_FINE_LOCATION = 1001;

  public RNShopSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNShopSdk";
  }

  private boolean checkGpsStatus(){
    LocationManager locationManager = (LocationManager)reactContext.getSystemService(Context.LOCATION_SERVICE);
    if (locationManager == null){
      return false;
    }
    return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    // || locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
  }

  @ReactMethod
  public void init() {
    AdsSdk.initApp(reactContext);
  }
  @ReactMethod
  public void saveMemberCode(String memberCode){
    AdsSdk.saveMemberCode(reactContext,memberCode);
  }
  @ReactMethod
  public void getUserAds(final Callback callback){
    AdsSdk.getUserAds(reactContext, new DataSenderListener() {
      @Override
      public void onResponse(String s) {
          Log.d(TAG, "getUserAds: " + s);
          callback.invoke(s);
          try {
              JSONObject json = new JSONObject(s);
              JSONObject data = json.getJSONObject("data");
              AdsSdk.loadAd(reactContext, data);
          } catch (Exception e) {
            callback.invoke(e.toString());
              e.printStackTrace();
          }
      }

      @Override
      public void onFailed(int i) {
        Log.d(TAG, "getUserAds: " + i);
        callback.invoke(i);
      }
    });
  }
  @ReactMethod
  public void collectDeviceInfoWithContainsLocation(Boolean containersLocation, String memberCode,
  String name, String zipCode,String  birthday,
  String gender,String occupation,String coexistence,final Callback callback) {
  if(!checkGpsStatus()){
     if(callback!=null){
      AdsSdk.collectDeviceInfo(reactContext,
    false,
    memberCode,
    name,
    zipCode,
    birthday,
    gender,
    occupation,
    coexistence,
    new DataSenderListener() {
        @Override
        public void onResponse(String response) {
          Log.d(TAG, "collectDeviceInfo: " + response);
          if(callback!=null){
            callback.invoke(response);
          }
        }
        @Override
        public void onFailed(int errorCode) {
            Log.d(TAG, "collectDeviceInfo: " + errorCode);
            if(callback!=null){
              callback.invoke(errorCode);
            }
        }
      });
      }
  } else {
    AdsSdk.collectDeviceInfo(reactContext,
    containersLocation,
    memberCode,
    name,
    zipCode,
    birthday,
    gender,
    occupation,
    coexistence,
    new DataSenderListener() {
        @Override
        public void onResponse(String response) {
          Log.d(TAG, "collectDeviceInfo: " + response);
          if(callback!=null){
            callback.invoke(response);
          }
        }
        @Override
        public void onFailed(int errorCode) {
            Log.d(TAG, "collectDeviceInfo: " + errorCode);
            if(callback!=null){
              callback.invoke(errorCode);
            }
        }
      });
    }
  }
  @ReactMethod
  public void showBannerWithData(ReadableMap data) {
    Map<String,String> map=new HashMap<String,String>();
    if(data.hasKey("content")){
      String content= data.getString("content");
      map.put("content", content);

    }
    if(data.hasKey("width")){
      String width= String.valueOf(data.getInt("width"));
      map.put("width", width);
    }
    if(data.hasKey("height")){
      String height=  String.valueOf(data.getInt("height"));
      map.put("height", height);
    }
    if(data.hasKey("type")){
      String type=String.valueOf(data.getInt("type"));
      map.put("type", type);
    }
    if(data.hasKey("url")){
      String url= data.getString("url");
      map.put("url", url);
    }
    if(data.hasKey("ads_id")){
      String ads_id= data.getString("ads_id");
      map.put("ads_id", ads_id);
    }
    AdsSdk.loadAd(reactContext,map);
  }
  @ReactMethod
  public void   locationUpdateBackgroundMode  (Boolean status) {
    AdsSdk.locationUpdateBackgroundMode(reactContext,status);
  }
  @ReactMethod
  public void   registDeviceToken  (String token,String memberCode) {
    AdsSdk.registDeviceToken(reactContext, token, memberCode);
  }
}