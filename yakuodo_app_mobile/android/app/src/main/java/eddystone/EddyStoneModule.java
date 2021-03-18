package eddystone;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.work.WorkInfo;
import androidx.work.WorkManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.List;
import java.util.concurrent.ExecutionException;

import javax.annotation.Nonnull;
import static android.content.Context.BLUETOOTH_SERVICE;


public class EddyStoneModule extends ReactContextBaseJavaModule {

    /** @property {ReactApplicationContext} The react app context */
    private ReactApplicationContext reactContext;
    private ScanBeaconService scanBeaconService;
    private boolean mBound = false;

    public EddyStoneModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        BeaconInfo.getInstance().setContext(reactContext.getApplicationContext());
    }

    @Nonnull
    @Override
    public String getName() {
        return "EddyStoneScanner";
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    public void startScanning() {
        if (checkBluetoothStatus()) {
            Log.d("tranta", "Build.VERSION.SDK_INT "+ Build.VERSION.SDK_INT);
            if (!mBound) {
                Intent intent = new Intent(reactContext, ScanBeaconService.class);
                reactContext.bindService(intent, connection, Context.BIND_AUTO_CREATE);
            }
//            if (Build.VERSION.SDK_INT >= 23) {
//                if (!isRunningWorker()){
//                    Util.scanJob(reactContext);
//                }
//            }
        }
    }

    @ReactMethod
    public void stopScanning() {
        try {
            if (mBound) {
                reactContext.unbindService(connection);
            }
            mBound = false;

//            if (isRunningWorker()) {
//               Util.stopScan(getReactApplicationContext());
//            }
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void setShowAdvPopupState(String state) {
      try {
         BeaconInfo.getInstance().setShowAdvPopupState("isShowListAdvertisement", state);
      } catch (Exception e) {

      }
    }

    @ReactMethod
    public void isShowAdvPopup(Promise promise) {
      try {
        String isShow = BeaconInfo.getInstance().isShowAdvPopup("isShowListAdvertisement");
        WritableMap map = Arguments.createMap();
        map.putString("isShowListAdvertisement", isShow);
        promise.resolve(map);
      } catch (Exception e) {
        promise.reject(e);
      }
    }

    public boolean isRunningWorker() {
        boolean status = false;
        try {
            List<WorkInfo> workInfos = WorkManager.getInstance(reactContext)
                    .getWorkInfosForUniqueWork("scanBeaconId").get();

            if (workInfos.size() > 0) {
                for (int i = 0; i < workInfos.size(); i++) {
                    WorkInfo.State state = workInfos.get(i).getState();
                    if (state == WorkInfo.State.RUNNING || state == WorkInfo.State.ENQUEUED) {
                        status = true;
                        break;
                    }
                }
            }
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return status;
    }


    @ReactMethod
    public void setUp(String url, String accessToken, String deviceId, String namespace, String memberCode) {
      //Log.d("tranta", "url "+ url + " token "+accessToken + " deviceId " + deviceId + " namespace "+ namespace + " memberCode "+ memberCode);
      AppInfo.getInstance().setAccessToken(accessToken);
      AppInfo.getInstance().setDeviceId(deviceId);
      AppInfo.getInstance().setUrl(url);
      AppInfo.getInstance().setNamespace(namespace);
      AppInfo.getInstance().setMemberCode(memberCode);
    }

    public boolean checkBluetoothStatus() {
        BluetoothManager manager =
                (BluetoothManager) this.reactContext.getSystemService(BLUETOOTH_SERVICE);
        BluetoothAdapter adapter = manager.getAdapter();
        if (adapter == null || !adapter.isEnabled()) {
            //Bluetooth is disabled
            return false;
        }
        if (!this.reactContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            return false;
        }
        return true;
    }

    /** Defines callbacks for service binding, passed to bindService() */
    private ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName className,
                                       IBinder service) {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            ScanBeaconService.ScanBeaconBinder binder = (ScanBeaconService.ScanBeaconBinder) service;
            scanBeaconService = binder.getService();
            scanBeaconService.setContext(reactContext);
            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mBound = false;
        }
    };
}
