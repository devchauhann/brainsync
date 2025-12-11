import { CapacitorConfig } from '@capacitor/cli';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class MobileUtils {
  static async initializeMobileFeatures() {
    try {
      // Set up status bar
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#000000' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      console.log('StatusBar setup failed:', error);
    }
  }

  static async vibrate(style: ImpactStyle = ImpactStyle.Light) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  static setupBackButtonHandler(
    onBack: () => void,
    shouldExit: () => boolean = () => false
  ) {
    App.addListener('backButton', () => {
      if (shouldExit()) {
        App.minimizeApp();
      } else {
        onBack();
      }
    });
  }

  static removeBackButtonHandler() {
    App.removeAllListeners();
  }

  // Prevent default browser behaviors on mobile
  static setupMobileGestures() {
    // Prevent pull-to-refresh
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    // Prevent zoom
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gesturechange', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gestureend', (e) => {
      e.preventDefault();
    });
  }

  // Check if running in native app
  static isNativeApp(): boolean {
    return !!(window as any).Capacitor;
  }

  // Get safe area insets
  static getSafeAreaInsets() {
    const style = getComputedStyle(document.documentElement);
    return {
      top: style.getPropertyValue('--sat'),
      right: style.getPropertyValue('--sar'),
      bottom: style.getPropertyValue('--sab'),
      left: style.getPropertyValue('--sal'),
    };
  }
}
