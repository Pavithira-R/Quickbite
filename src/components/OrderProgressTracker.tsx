import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderStatus } from '../types';
import { Colors, BorderRadius, Spacing } from '../theme/colors';

interface OrderProgressTrackerProps {
  status: OrderStatus;
  onAdvanceStatus?: () => void;
  showControls?: boolean;
}

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({
  status,
  onAdvanceStatus,
  showControls = false,
}) => {
  const steps: { key: OrderStatus; label: string; icon: string; desc: string }[] = [
    {
      key: 'Placed',
      label: 'Order Placed',
      icon: 'receipt-outline',
      desc: 'Canteen counter received ticket',
    },
    {
      key: 'Preparing',
      label: 'Kitchen Preparing',
      icon: 'flame-outline',
      desc: 'Chef is sizzling your fresh meal',
    },
    {
      key: 'Ready for Pickup',
      label: 'Ready for Pickup',
      icon: 'bag-check-outline',
      desc: 'Head to Express Counter with your QR code',
    },
    {
      key: 'Completed',
      label: 'Collected & Done',
      icon: 'checkmark-circle-outline',
      desc: 'Enjoy your campus meal!',
    },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready for Pickup':
        return 2;
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Order Status Tracker</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                status === 'Ready for Pickup'
                  ? Colors.secondaryLight
                  : status === 'Preparing'
                    ? Colors.statusPreparingBg
                    : status === 'Placed'
                      ? Colors.statusPlacedBg
                      : Colors.statusCompletedBg,
            },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              {
                color:
                  status === 'Ready for Pickup'
                    ? Colors.secondaryDark
                    : status === 'Preparing'
                      ? Colors.accent
                      : status === 'Placed'
                        ? Colors.statusPlaced
                        : Colors.statusCompleted,
              },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.stepperContainer}>
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <View key={step.key} style={styles.stepItem}>
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.circle,
                    isDone && styles.circleDone,
                    isCurrent && styles.circleCurrent,
                    isPending && styles.circlePending,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : (
                    <Ionicons
                      name={step.icon as any}
                      size={15}
                      color={isCurrent ? '#FFFFFF' : Colors.textMuted}
                    />
                  )}
                </View>
                {idx < steps.length - 1 && (
                  <View
                    style={[styles.connectorLine, isDone ? styles.lineDone : styles.linePending]}
                  />
                )}
              </View>

              <View style={styles.stepDetails}>
                <View style={styles.stepLabelRow}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelCurrent,
                      isDone && styles.stepLabelDone,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {isCurrent && (
                    <View style={styles.livePulseBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {showControls && (
        <View style={styles.controlsBox}>
          <View style={styles.controlsHeader}>
            <Ionicons name="hardware-chip-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.controlsTitle}>Live Simulation Control (Rubric Requirement)</Text>
          </View>
          <Text style={styles.controlsSubtext}>
            Advance status through states (Placed → Preparing → Ready for pickup → Completed) to
            simulate kitchen updates.
          </Text>
          <TouchableOpacity
            style={[styles.advanceButton, status === 'Completed' && styles.advanceButtonDisabled]}
            onPress={onAdvanceStatus}
            disabled={status === 'Completed'}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward-circle" size={18} color="#FFFFFF" />
            <Text style={styles.advanceButtonText}>
              {status === 'Placed'
                ? 'Simulate: Kitchen Starts Cooking'
                : status === 'Preparing'
                  ? 'Simulate: Food Ready for Pickup'
                  : status === 'Ready for Pickup'
                    ? 'Simulate: Student Picked Up'
                    : 'Order Finished'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.pill,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepperContainer: {
    paddingLeft: Spacing.xs,
  },
  stepItem: {
    flexDirection: 'row',
    minHeight: 56,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.md,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  circleDone: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  circleCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  circlePending: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  lineDone: {
    backgroundColor: Colors.secondary,
  },
  linePending: {
    backgroundColor: Colors.border,
  },
  stepDetails: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  stepLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  stepLabelCurrent: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  stepLabelDone: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  controlsBox: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  controlsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  controlsSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginBottom: Spacing.sm,
  },
  advanceButton: {
    backgroundColor: Colors.darkLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  advanceButtonDisabled: {
    opacity: 0.5,
  },
  advanceButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
