import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../theme/colors';
import { useToast } from '../context/ToastContext';
import { IconName } from '../types';

export const Toast: React.FC = () => {
  const { toast } = useToast();

  if (!toast) return null;

  const getIconName = (): IconName => {
    switch (toast.type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return '#065F46';
      case 'error':
        return '#991B1B';
      default:
        return '#1E293B';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBgColor() }]}>
      <Ionicons name={getIconName()} size={20} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.text}>{toast.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    alignSelf: 'center',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    maxWidth: '90%',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
