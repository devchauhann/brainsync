package com.csemate.app;

import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Handle system UI and navigation
        setupSystemUI();
        setupWebViewBehavior();
    }
    
    private void setupSystemUI() {
        Window window = getWindow();
        
        // Set proper system bars behavior like native apps
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        
        // Ensure content doesn't go under system bars
        WindowCompat.setDecorFitsSystemWindows(window, true);
        
        // Set status bar and navigation bar appearance to match app theme
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            // Dark content on light status bar = false (we want light content on dark status bar)
            controller.setAppearanceLightStatusBars(false);
            controller.setAppearanceLightNavigationBars(false);
            // Hide system UI behavior like native apps
            controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
        
        // Force solid black colors to match app header (no transparency)
        window.setStatusBarColor(0xFF000000); // Pure black
        window.setNavigationBarColor(0xFF000000); // Pure black - no transparency
        
        // Additional styling for immersive black theme
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        );
        
        // Ensure navigation bar is always black and visible
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
            // For Android 9+ with gesture navigation
            window.getAttributes().layoutInDisplayCutoutMode = 
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }
        
        // Force navigation bar contrast for gesture area
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            window.setNavigationBarDividerColor(0xFF000000);
        }
    }
    
    private void setupWebViewBehavior() {
        // Configure WebView for native-like behavior
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            webView.setVerticalScrollBarEnabled(false);
            webView.setHorizontalScrollBarEnabled(false);
        }
    }
    
    @Override
    public void onBackPressed() {
        // Always send back button event to the web app first
        if (bridge != null && bridge.getWebView() != null) {
            // Send back button event to the web app and let it handle navigation
            bridge.getWebView().evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('capacitor:hardwareBackButton'))", 
                null
            );
            // Don't call super.onBackPressed() - let the web app control navigation
        } else {
            // Only if bridge is not available, use default behavior
            super.onBackPressed();
        }
    }
}
