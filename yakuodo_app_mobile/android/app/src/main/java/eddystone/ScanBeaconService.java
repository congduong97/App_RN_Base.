package eddystone;

import android.app.Service;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.ParcelUuid;
import android.util.Log;

import androidx.annotation.Nullable;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class ScanBeaconService extends Service {

    /** @property ParcelUuid The service id for Eddystone beacons */
    public static final ParcelUuid SERVICE_UUID = ParcelUuid.fromString("0000feaa-0000-1000-8000-00805f9b34fb");

    /** @property ParcelUuid The configuration service id for Eddystone beacon */
    public static final ParcelUuid CONFIGURATION_UUID = ParcelUuid.fromString("a3c87500-8ed3-4bdf-8a39-a01bebede295");


    /** @property {BluetoothLeScanner} The Bluetooth LE scanner instance */
    private BluetoothLeScanner scanner;

    /** @property byte UID frame type byte identifier */
    public static final byte FRAME_TYPE_UID = 0x00;

    /** @property byte URL frame type byte identifier */
    public static final byte FRAME_TYPE_URL = 0x10;

    /** @property byte TLM frame type byte identifier */
    public static final byte FRAME_TYPE_TLM = 0x20;

    /** @property byte EID frame type byte identifier */
    public static final byte FRAME_TYPE_EID = 0x30;

    /** @property byte Empty frame type byte identifier */
    public static final byte FRAME_TYPE_EMPTY = 0x40;

    private ReactContext mContext;

    private final IBinder scanBeaconBinder = new ScanBeaconBinder();

    private ArrayList<Beacon> detectedBeaconArr = new ArrayList<>();

    private Handler handler = new Handler();

    private Runnable scanBeaconTask = new Runnable() {
        @Override
        public void run() {
            startScanning();
            handler.postDelayed(this, 40000L);
        }
    };

    private Timer stopScanTimer = null;
    private boolean isRunning = false;

    public class ScanBeaconBinder extends Binder {
        public ScanBeaconService getService() {
            return ScanBeaconService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        //Log.d("tranta", "onCreate service");
        BluetoothManager manager =
                (BluetoothManager) getSystemService(BLUETOOTH_SERVICE);
        scanner = manager.getAdapter().getBluetoothLeScanner();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //Log.d("tranta", "onBind");
        if (!isRunning) {
            isRunning = true;
            startScanning();
            handler.postDelayed(scanBeaconTask, 40000L);
        }
        return scanBeaconBinder;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        //Log.d("tranta", "onUnbind");
        stopScanning();
        stopScanTimer.cancel();
        scanner = null;
        stopScanTimer = null;
        isRunning = false;
        if (handler != null ) {
            handler.removeCallbacks(scanBeaconTask);
        }
        return super.onUnbind(intent);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        //Log.d("tranta", "onDestroy service");
    }

    ScanCallback scanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            //Log.d("tranta", "onScanResult");
            handleResult(result);
        }

        @Override
        public void onBatchScanResults(List<ScanResult> results) {
            Log.d("tranta", "onBatchScanResults");
//            for (ScanResult result : results) {
//                handleResult(result);
//            }
        }

        @Override
        public void onScanFailed(int errorCode) {
            super.onScanFailed(errorCode);
            //Log.d("tranta", "onScanFailed "+errorCode);
        }

        public void handleResult(ScanResult result) {
            //Log.d("tranta", "handleResult");
            // attempt to get sevice data from eddystone uuid
            byte[] serviceData = result.getScanRecord().getServiceData(SERVICE_UUID);

            // handle all possible frame types
            byte frameType = serviceData[0];
            if (frameType == FRAME_TYPE_UID) {
                int length = 18;
                String event = "onUIDFrame";
                // reconstruct the beacon id from hex array
                StringBuilder builder = new StringBuilder();
                for (int i = 2; i < length; i++) {
                    builder.append(Integer.toHexString(serviceData[i] & 0xFF));
                }
                String id = builder.toString();
                if (frameType == FRAME_TYPE_UID) {
                    String namespace = id.substring(0,20);
                    String instance  = id.substring(20);
                    final long now = System.currentTimeMillis();
                    Beacon beacon = new Beacon(namespace, instance, now);
                    updateBeacon(beacon);
                }
                //Log.d("tranta", "beacons " + id);

            } else if (frameType == FRAME_TYPE_URL) {

            } else if (frameType == FRAME_TYPE_TLM) {
            } else if (frameType == FRAME_TYPE_EMPTY) {
            }
        }
    };

    public void updateBeacon(Beacon beacon) {
        Beacon e = isSame(beacon);
        if (e != null) {
            e.lastDetectedTimestamp = beacon.lastDetectedTimestamp;
        } else {
            this.detectedBeaconArr.add(beacon);
            //sendInBeaconEvent(beacon);
            this.updateBeaconInfo(beacon);
        }
    }

    public void startScanning() {
        Log.d("tranta", "startScanning");
        if (detectedBeaconArr != null) {
            detectedBeaconArr.removeAll(detectedBeaconArr);
        }
        ScanFilter serviceFilter = new ScanFilter.Builder().setServiceUuid(SERVICE_UUID).build();


        final List<ScanFilter> filters = new ArrayList<>();
        filters.add(serviceFilter);

        ScanSettings settings = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();

        // start scanning
        scanner.startScan(filters, settings, scanCallback);
        stopScanTimer = new Timer();
        stopScanTimer.schedule(new TimerTask() {
            @Override
            public void run() {
              stopScanning();
            }
        }, 10000L);
    }

    public void stopScanning() {
        Log.d("tranta", "stopScanning");
        if (scanner != null) {
            scanner.stopScan(scanCallback);
        }
    }

    public void setContext(ReactContext context) {
        mContext = context;
    }

    public Beacon isSame(Beacon beacon) {
        for (int i = 0; i < this.detectedBeaconArr.size(); i++) {
            Beacon e = this.detectedBeaconArr.get(i);
            if (beacon.namespace.equals(e.namespace) && beacon.instance.equals(e.instance)) {
                return e;
            }
        }
        return null;
    }

    public void sendInBeaconEvent(Beacon e) {
        AppInfo appInfo = AppInfo.getInstance();
        String deviceId = appInfo.getDeviceId();
        String accessToken = appInfo.getAccessToken();
        String url = appInfo.getUrl();
        String namespace = appInfo.getNamespace();
        String memberCode = appInfo.getMemberCode();
        //Log.d("tranta", "deviceId 111 " + deviceId + " accesstoken " + accessToken + " url:  "+ url + " namespace "+namespace);
        if (!namespace.equals(e.namespace))
            return;
        BeaconInfo beaconInfo = BeaconInfo.getInstance();
        String urlRequest = url + "beacon/in?deviceId="+ deviceId +"&namespace="+e.namespace+"&instance="+e.instance;
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        StringRequest strRequest = new StringRequest(Request.Method.GET, urlRequest,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.d("tranta", "sendInBeaconEvent success " + response);
                        long curTime = System.currentTimeMillis();
                        String key = e.instance + memberCode;
                        beaconInfo.set(key, curTime);
                        if (response.contains("1000")) {
                            Log.d("tranta", "save isShowListAdvertisement");
                            beaconInfo.setShowAdvPopupState("isShowListAdvertisement", "SHOW");
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d("tranta", "call api error " + error.getMessage());
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> header = new HashMap<>();
                header.put("accessToken", accessToken);
                return header;
            }
        };
        strRequest.setRetryPolicy(new DefaultRetryPolicy(
                0,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT
        ));
        requestQueue.add(strRequest);
    }

    public void updateBeaconInfo(Beacon beacon) {
        String namespace = AppInfo.getInstance().getNamespace();
        if (!namespace.equals(beacon.namespace))
            return;
        long curTime = System.currentTimeMillis();
        BeaconInfo beaconInfo = BeaconInfo.getInstance();
        String key = beacon.instance + AppInfo.getInstance().getMemberCode();
        long lastDetectedTimestamp = beaconInfo.get(key);
        Log.d("tranta", " lastDetectedTimestamp " + lastDetectedTimestamp);
        if (lastDetectedTimestamp == -1) {
            //beaconInfo.set(beacon.instance, curTime);
            sendInBeaconEvent(beacon);
        } else if (curTime - lastDetectedTimestamp > 24 * 60 * 60 * 1000L) {
            //beaconInfo.set(beacon.instance, curTime);
            sendInBeaconEvent(beacon);
        }
    }
}
