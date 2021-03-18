package com.yoneyama_app;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash;
public class MainActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    
    return "yoneyama_app";
  }
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
          RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
    }

}
