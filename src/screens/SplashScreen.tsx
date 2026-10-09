import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo, loginUser } = useApp();

  return (
    <View style={styles.container}>
      {/* Decorative gradient / background elements */}
      <View style={styles.circleBg1} />
      <View style={styles.circleBg2} />

      <View style={styles.content}>
        {/* Logo and Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="fast-food" size={48} color="#FFFFFF" />
          </View>
          <View style={styles.badgePulse}>
            <Ionicons name="flash" size={14} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.appName}>
          Quick<Text style={styles.appNameHighlight}>Bite</Text>
        </Text>
        <Text style={styles.tagline}>Campus Food Ordering App</Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons name="flash-outline" size={18} color={Colors.primary} />
            <Text style={styles.featureText}>Skip the long canteen queues</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <Text style={styles.featureText}>Order ahead between lectures</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="qr-code-outline" size={18} color={Colors.primary} />
            <Text style={styles.featureText}>Fast counter pickup with QR code</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigateTo('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Quick guest jump */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => loginUser('guest', 'Guest', true)}
          activeOpacity={0.7}
        >
          <Text style={styles.guestButtonText}>Browse Menu as Guest →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Cross-Platform Mobile Prototype • React Native / Expo</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  circleBg1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
  },
  circleBg2: {
    position: 'absolute',
    bottom: 50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  badgePulse: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  appNameHighlight: {
    color: Colors.primary,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: Spacing.xxl,
    fontWeight: '500',
  },
  featureList: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  guestButton: {
    marginTop: Spacing.lg,
    paddingVertical: 8,
  },
  guestButtonText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    textAlign: 'center',
  },
});
