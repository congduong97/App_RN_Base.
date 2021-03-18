package eddystone;

import android.content.Context;
import android.content.SharedPreferences;

public class BeaconInfo {
    private Context context;
    public static BeaconInfo instance = null;
    private SharedPreferences preferences = null;
    public static BeaconInfo getInstance() {
        if (instance == null) {
            instance = new BeaconInfo();
        }
        return instance;
    }

    public void setContext(Context context) {
        this.context = context;
        preferences = context.getSharedPreferences("yakuodoBeaconInfo", Context.MODE_PRIVATE);
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
}
