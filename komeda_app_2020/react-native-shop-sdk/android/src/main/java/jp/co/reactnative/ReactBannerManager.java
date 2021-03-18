package jp.co.reactnative;

import jp.co.android.ads.banner.AdsBannerView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewGroupManager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import android.view.ViewGroup;
import android.view.View;
import android.widget.RelativeLayout;
import android.util.Log;

public class ReactBannerManager extends ViewGroupManager<ReactBannerView> {
    public static final String REACT_CLASS = "RCTBannerView";
    private ReactBannerView bannerView;
    ReactApplicationContext mContext;

    public ReactBannerManager(ReactApplicationContext reactContext) {
        mContext = reactContext;

    }
    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @Override
    public void addView(ReactBannerView parent, View child, int index) {
        throw new RuntimeException("ReactBannerView cannot have subviews");
    }
    @Override
    public ReactBannerView createViewInstance(ThemedReactContext context) {
        bannerView = new ReactBannerView(context);
        bannerView.setBackgroundColor(0xFFFFFFAA);
        return bannerView;
    }

    @ReactProp(name = "test")
  public void test(ReactBannerView view,  String testString) {
    String a=testString;
    Log.e("ahahsdf",a);
  }
}