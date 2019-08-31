package com.hugong;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import com.bolan9999.SpringScrollViewPackage;
import com.beefe.picker.PickerViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.kishanjvaghela.cardview.RNCardViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.hugong.android_upgrade.UpgradePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AMap3DPackage(),
            new SpringScrollViewPackage(),
            new PickerViewPackage(),
            new LinearGradientPackage(),
            new BaiduMapPackage(),
            new RNCViewPagerPackage(),
            new PickerPackage(),
            new RNCardViewPackage(),
            new RNGestureHandlerPackage(),
            new AsyncStoragePackage(),
              new UpgradePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
