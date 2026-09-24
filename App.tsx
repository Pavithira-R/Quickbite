import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ItemDetailScreen } from './src/screens/ItemDetailScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { OrderConfirmationScreen } from './src/screens/OrderConfirmationScreen';
import { OrderTrackingScreen } from './src/screens/OrderTrackingScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TestSuiteScreen } from './src/screens/TestSuiteScreen';
import { BottomNavigation } from './src/components/BottomNavigation';
import { Toast } from './src/components/Toast';
import { Colors } from './src/theme/colors';

const MainNavigator: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'Home':
        return <HomeScreen />;
      case 'ItemDetail':
        return <ItemDetailScreen />;
      case 'Cart':
        return <CartScreen />;
      case 'Checkout':
        return <CheckoutScreen />;
      case 'OrderConfirmation':
        return <OrderConfirmationScreen />;
      case 'OrderTracking':
        return <OrderTrackingScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'TestSuite':
        return <TestSuiteScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Toast />
      {renderScreen()}
      <BottomNavigation />
    </View>
  );
};

export default function App() {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'full'>('mobile');

  return (
    <AppProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

        {Platform.OS === 'web' ? (
          <View style={styles.webWrapper}>
            {/* Top Device Switcher bar for testing responsive requirements (Part D Task 12) */}
            <View style={styles.responsiveHeader}>
              <View style={styles.responsiveBrand}>
                <Ionicons name="fast-food" size={18} color={Colors.primary} />
                <Text style={styles.responsiveTitle}>QuickBite MVP Preview</Text>
                <View style={styles.crossPlatformBadge}>
                  <Text style={styles.crossPlatformBadgeText}>Android & iOS Codebase</Text>
                </View>
              </View>

              <View style={styles.viewportSelector}>
                <TouchableOpacity
                  style={[styles.viewportBtn, deviceMode === 'mobile' && styles.viewportBtnActive]}
                  onPress={() => setDeviceMode('mobile')}
                >
                  <Ionicons
                    name="phone-portrait-outline"
                    size={15}
                    color={deviceMode === 'mobile' ? '#FFFFFF' : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.viewportBtnText,
                      deviceMode === 'mobile' && styles.viewportBtnTextActive,
                    ]}
                  >
                    Phone View (390px)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.viewportBtn, deviceMode === 'tablet' && styles.viewportBtnActive]}
                  onPress={() => setDeviceMode('tablet')}
                >
                  <Ionicons
                    name="tablet-portrait-outline"
                    size={15}
                    color={deviceMode === 'tablet' ? '#FFFFFF' : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.viewportBtnText,
                      deviceMode === 'tablet' && styles.viewportBtnTextActive,
                    ]}
                  >
                    Tablet View (720px)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.viewportBtn, deviceMode === 'full' && styles.viewportBtnActive]}
                  onPress={() => setDeviceMode('full')}
                >
                  <Ionicons
                    name="expand-outline"
                    size={15}
                    color={deviceMode === 'full' ? '#FFFFFF' : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.viewportBtnText,
                      deviceMode === 'full' && styles.viewportBtnTextActive,
                    ]}
                  >
                    Full Width
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Container */}
            <View style={styles.contentCenteringArea}>
              <View
                style={[
                  styles.deviceFrame,
                  deviceMode === 'mobile' && styles.mobileWidth,
                  deviceMode === 'tablet' && styles.tabletWidth,
                  deviceMode === 'full' && styles.fullWidth,
                ]}
              >
                <MainNavigator />
              </View>
            </View>
          </View>
        ) : (
          <MainNavigator />
        )}
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  webWrapper: {
    flex: 1,
    backgroundColor: '#090D16',
    flexDirection: 'column',
  },
  responsiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  responsiveBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  responsiveTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  crossPlatformBadge: {
    backgroundColor: 'rgba(225, 29, 72, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
  },
  crossPlatformBadgeText: {
    color: '#FB7185',
    fontSize: 10,
    fontWeight: '700',
  },
  viewportSelector: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  viewportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  viewportBtnActive: {
    backgroundColor: Colors.primary,
  },
  viewportBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  viewportBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentCenteringArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  deviceFrame: {
    height: '100%',
    maxHeight: 900,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: Colors.background,
  },
  mobileWidth: {
    width: '100%',
    maxWidth: 420,
  },
  tabletWidth: {
    width: '100%',
    maxWidth: 720,
  },
  fullWidth: {
    width: '100%',
    maxWidth: 1100,
    borderRadius: 12,
  },
});
