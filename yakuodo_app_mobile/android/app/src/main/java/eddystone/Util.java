package eddystone;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.concurrent.TimeUnit;

public class Util {

    @RequiresApi(api = Build.VERSION_CODES.M)
    public static void scanJob(Context context) {
        Log.d("tranta", "Util, scanJob() WorkManager");
        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.UNMETERED)
                .setRequiresCharging(false)
                .setRequiresDeviceIdle(false)
                .build();
        String deviceId = AppInfo.getInstance().getDeviceId();
        String accessToken = AppInfo.getInstance().getAccessToken();
        String url = AppInfo.getInstance().getUrl();
        String namespace = AppInfo.getInstance().getNamespace();
        String memberCode = AppInfo.getInstance().getMemberCode();
        Data inputData = new Data.Builder()
                         .putString("token", accessToken)
                         .putString("url", url)
                         .putString("deviceId", deviceId)
                         .putString("namespace", namespace)
                         .putString("memberCode", memberCode)
                         .build();
        PeriodicWorkRequest scanBeaconRequest =
                new PeriodicWorkRequest.Builder(ScanBeaconWorker.class, 15, TimeUnit.MINUTES, 5, TimeUnit.MINUTES)
                        .setConstraints(constraints)
                        .setInitialDelay(10, TimeUnit.SECONDS)
                        .setInputData(inputData)
                        .addTag("scanBeaconRequest")
                        .build();
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                "scanBeaconId",
                ExistingPeriodicWorkPolicy.KEEP,
                scanBeaconRequest
        );
    }

    public static void stopScan(Context context) {
        Log.d("tranta", "stopScan Job WorkManager");
        WorkManager.getInstance(context)
                .cancelUniqueWork("scanBeaconId");
    }
}
