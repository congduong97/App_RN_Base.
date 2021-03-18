package jp.co.reactnative;

import jp.co.android.ads.banner.AdsBannerView;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

class ReactBannerView extends ReactViewGroup  {

    protected AdsBannerView bannerView;

    public ReactBannerView(final Context context) {
        super(context);
        this.createAdView();
    }

    private void createAdView() {
        final Context context = getContext();
       bannerView = new AdsBannerView (context);
       RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
       bannerView.setLayoutParams(params);
       bannerView.setBackgroundColor(0xFFFFFFAA);
        this.addView(this.bannerView);
    }
}
