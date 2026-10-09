import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { OrderProgressTracker } from '../components/OrderProgressTracker';

export const OrderTrackingScreen: React.FC = () => {
  const {
    orders,
    activeOrder,
    setActiveOrderById,
    advanceOrderStatus,
    navigateTo,
    reorderPastOrder,
  } = useApp();

  const [simulatedMinutesLeft, setSimulatedMinutesLeft] = useState(8);

  const currentOrder = activeOrder || orders[0];

  // Countdown timer simulation
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'Completed') return;

    const timer = setInterval(() => {
      setSimulatedMinutesLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 45000);

    return () => clearInterval(timer);
  }, [currentOrder]);

  if (!currentOrder) {
    return (
      <View style={styles.container}>
        <Header title="Order Status Tracker" />
        <View style={styles.emptyBox}>
          <Ionicons name="time-outline" size={54} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Active Orders</Text>
          <Text style={styles.emptySub}>
            You don't have any placed orders yet. Choose something tasty from the menu!
          </Text>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => navigateTo('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuBtnText}>Browse Canteen Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Live Order Tracker" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Selector Tab if multiple orders exist */}
        {orders.length > 1 && (
          <View style={styles.orderSelector}>
            <Text style={styles.orderSelectorTitle}>Your Orders:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.orderChipsRow}
            >
              {orders.map((ord) => {
                const isSelected = ord.id === currentOrder.id;
                return (
                  <TouchableOpacity
                    key={ord.id}
                    style={[styles.orderChip, isSelected && styles.orderChipActive]}
                    onPress={() => setActiveOrderById(ord.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.orderChipText, isSelected && styles.orderChipTextActive]}>
                      {ord.orderNumber} ({ord.status})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Live Estimate Card */}
        <View style={styles.etaCard}>
          <View style={styles.etaHeader}>
            <View>
              <Text style={styles.etaSub}>ESTIMATED PICKUP STATUS</Text>
              <Text style={styles.etaTitle}>
                {currentOrder.status === 'Completed'
                  ? 'Order Completed'
                  : currentOrder.status === 'Ready for Pickup'
                    ? 'Ready at Counter!'
                    : `Approx. ${simulatedMinutesLeft} Mins Remaining`}
              </Text>
            </View>
            <View style={styles.etaIconCircle}>
              <Ionicons
                name={
                  currentOrder.status === 'Completed'
                    ? 'checkmark-done-circle'
                    : currentOrder.status === 'Ready for Pickup'
                      ? 'bag-check'
                      : 'flame'
                }
                size={28}
                color={
                  currentOrder.status === 'Ready for Pickup' ? Colors.secondary : Colors.primary
                }
              />
            </View>
          </View>

          <View style={styles.etaCounterRow}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.etaCounterText}>
              Pickup Location:{' '}
              <Text style={{ fontWeight: '800' }}>{currentOrder.pickupCounter}</Text>
            </Text>
          </View>
        </View>

        {/* Dynamic Stepper Visualizer with Activity Simulation Controls */}
        <OrderProgressTracker
          status={currentOrder.status}
          onAdvanceStatus={() => advanceOrderStatus(currentOrder.id)}
          showControls={true}
        />

        {/* Items Summary in this order */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Order Items Details</Text>
            <Text style={styles.orderIdTag}>{currentOrder.orderNumber}</Text>
          </View>

          {currentOrder.items.map((it, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemQtyCircle}>
                <Text style={styles.itemQtyText}>{it.quantity}</Text>
              </View>
              <View style={styles.itemTextCol}>
                <Text style={styles.itemName}>{it.menuItem.name}</Text>
                {it.customization?.spiceLevel ? (
                  <Text style={styles.itemCustom}>Spice: {it.customization.spiceLevel}</Text>
                ) : null}
              </View>
              <Text style={styles.itemPrice}>Rs. {it.itemTotal.toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.billDivider} />

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total Paid ({currentOrder.paymentMethod})</Text>
            <Text style={styles.summaryTotalAmount}>Rs. {currentOrder.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Quick Contact & Reorder Actions */}
        <View style={styles.quickActionRow}>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => alert('Canteen Intercom: Counter #2 - Extension 402')}
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={16} color={Colors.textPrimary} />
            <Text style={styles.helpBtnText}>Canteen Helpdesk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => reorderPastOrder(currentOrder)}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.reorderBtnText}>Reorder Items</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
    marginBottom: Spacing.lg,
  },
  menuBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: BorderRadius.pill,
  },
  menuBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  orderSelector: {
    marginBottom: Spacing.xs,
  },
  orderSelectorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  orderChipsRow: {
    flexDirection: 'row',
  },
  orderChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  orderChipActive: {
    backgroundColor: Colors.dark,
    borderColor: Colors.dark,
  },
  orderChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  orderChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  etaCard: {
    backgroundColor: Colors.dark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  etaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaSub: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  etaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 3,
  },
  etaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: 6,
  },
  etaCounterText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  orderIdTag: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemQtyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  itemQtyText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  itemTextCol: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemCustom: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  summaryTotalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  helpBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  helpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reorderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  reorderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
