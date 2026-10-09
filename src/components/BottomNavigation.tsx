import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { IconName, ScreenName } from '../types';

export const BottomNavigation: React.FC = () => {
  const { currentScreen, navigateTo, cartItemCount, orders } = useApp();

  if (currentScreen === 'Splash' || currentScreen === 'Login') {
    return null;
  }

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready for Pickup',
  ).length;

  interface TabItem {
    id: ScreenName;
    label: string;
    icon: IconName;
    activeIcon: IconName;
    badge?: number;
  }

  const tabs: TabItem[] = [
    {
      id: 'Home',
      label: 'Menu',
      icon: 'restaurant-outline',
      activeIcon: 'restaurant',
    },
    {
      id: 'Cart',
      label: 'Cart',
      icon: 'cart-outline',
      activeIcon: 'cart',
      badge: cartItemCount,
    },
    {
      id: 'OrderTracking',
      label: 'Tracker',
      icon: 'time-outline',
      activeIcon: 'time',
      badge: activeOrdersCount,
    },
    {
      id: 'Profile',
      label: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => navigateTo(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? Colors.primary : Colors.textMuted}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <View style={[styles.badge, isActive && styles.activeBadge]}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 58,
  },
  activeTabButton: {},
  iconWrapper: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  activeBadge: {
    backgroundColor: Colors.primaryDark,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
