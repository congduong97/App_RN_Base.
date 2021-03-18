package eddystone;

import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.ParcelUuid;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import static android.content.Context.BLUETOOTH_SERVICE;

public class ScanBeaconWorker extends Worker {

    /** @property ParcelUuid The service id for Eddystone beacons */
    public static final ParcelUuid SERVICE_UUID = ParcelUuid.fromString("0000feaa-0000-1000-8000-00805f9b34fb");

    /** @property ParcelUuid The configuration service id for Eddystone beacon */
    public static final ParcelUuid CONFIGURATION_UUID = ParcelUuid.fromString("a3c87500-8ed3-4bdf-8a39-a01bebede295");


    /** @property {BluetoothLeScanner} The Bluetooth LE scanner instance */
    private BluetoothLeScanner scanner;

    /** @property byte UID frame type byte identifier */
    public static final byte FRAME_TYPE_UID = 0x00;

    private ArrayList<Beacon> detectedBeaconArr = new ArrayList<>();

    private Timer stopScanTask = null;
    private SharedPreferences preferences = null;

    public ScanBeaconWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        Log.d("tranta", "ScanBeaconWorker");
        preferences = context.getSharedPreferences("yakuodoBeaconInfo", Context.MODE_PRIVATE);
        //workerParams.getInputData().
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.d("tranta", "onStartJob doWork");
        String url = AppInfo.getInstance().getUrl();
        if ("".equals(url)) {
            BluetoothManager manager =
                    (BluetoothManager)  getApplicationContext().getSystemService(BLUETOOTH_SERVICE);
            scanner = manager.getAdapter().getBluetoothLeScanner();
            if (detectedBeaconArr != null) {
                detectedBeaconArr.removeAll(detectedBeaconArr);
            }
            startScanning();
        }
        return null;
    }

    @Override
    public void onStopped() {
        super.onStopped();
        Log.d("tranta", "ScanBeaconWorker onStopped()");
    }

    public void stopScanning() {
        Log.d("tranta", "stopScanning");
        scanner.stopScan(scanCallback);
        scanner = null;
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
                Log.d("tranta", "worker, beacons " + id);

            }
        }
    };

    public void startScanning() {
        //Log.d("tranta", "startScanning");
        ScanFilter serviceFilter = new ScanFilter.Builder().setServiceUuid(SERVICE_UUID).build();


        final List<ScanFilter> filters = new ArrayList<>();
        filters.add(serviceFilter);

        ScanSettings settings = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();

        // start scanning
        scanner.startScan(filters, settings, scanCallback);
        stopScanTask = new Timer();
        stopScanTask.schedule(new TimerTask() {
            @Override
            public void run() {
                stopScanning();
            }
        }, 20000L);
    }

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
        String deviceId = getInputData().getString("deviceId");
        String accessToken = getInputData().getString("token");
        String url = getInputData().getString("url");
        String namespace = getInputData().getString("namespace");
        String memberCode = getInputData().getString("memberCode");
        //Log.d("tranta", "deviceId 111 " + deviceId + " accesstoken " + accessToken + " url:  "+ url + " namespace "+namespace);
        if (!namespace.equals(e.namespace))
            return;
        String urlRequest = url + "beacon/in?deviceId="+ deviceId +"&namespace="+e.namespace+"&instance="+e.instance;
        RequestQueue requestQueue = Volley.newRequestQueue(getApplicationContext());
        StringRequest strRequest = new StringRequest(Request.Method.GET, urlRequest,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.d("tranta", "worker sendInBeaconEvent success " + response);
                        long curTime = System.currentTimeMillis();
                        String key = e.instance + memberCode;
                        set(key, curTime);
                        if (response.contains("1000")) {
                            Log.d("tranta", "worker save isShowListAdvertisement");
                            setShowAdvPopupState("isShowListAdvertisement","SHOW");
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

    public void set(String key, Long value) {
        if (preferences == null)
            return;
        preferences.edit().putLong(key, value).apply();
    }

    public long get(String key) {
        if (preferences == null)
            return -1;
        long time = preferences.getLong(key, -1);
        return time;
    }

    public void setShowAdvPopupState(String key, String value) {
        if (preferences == null)
            return;
        preferences.edit().putString(key, value).apply();
    }

    public String isShowAdvPopup(String key) {
        if (preferences == null)
            return "";
        String isShow = preferences.getString(key, "");
        return isShow;
    }

    public void updateBeaconInfo(Beacon beacon) {
        String namespace = getInputData().getString("namespace");
        if (!namespace.equals(beacon.namespace))
            return;
        long curTime = System.currentTimeMillis();
        String key = beacon.instance + getInputData().getString("memberCode");
        long lastDetectedTimestamp = get(key);
        Log.d("tranta", "worker, lastDetectedTimestamp " + lastDetectedTimestamp);
        if (lastDetectedTimestamp == -1) {
            //set(beacon.instance, curTime);
            sendInBeaconEvent(beacon);
        } else if (curTime - lastDetectedTimestamp > 24 * 60 * 60 * 1000L) {
            //set(beacon.instance, curTime);
            sendInBeaconEvent(beacon);
        }
    }

}
