import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
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
  return (
    <AppProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
        <View style={styles.appColumn}>
          <MainNavigator />
        </View>
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? Colors.border : Colors.background,
  },
  // On wide web screens keep the mobile layout in a centered column
  appColumn: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    alignSelf: 'center',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
});
