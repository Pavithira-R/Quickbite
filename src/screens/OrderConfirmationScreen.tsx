import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';

export const OrderConfirmationScreen: React.FC = () => {
  const { activeOrder, navigateTo } = useApp();

  const order = activeOrder;

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>No order found</Text>
        <TouchableOpacity onPress={() => navigateTo('Home')}>
          <Text>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Success Banner */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-circle" size={54} color={Colors.secondary} />
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successSub}>
            Your food ticket was received at the Campus Canteen kitchen.
          </Text>
        </View>

        {/* Pickup Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.orderNumLabel}>CANTEEN TOKEN</Text>
              <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            </View>
            <View style={styles.counterBadge}>
              <Ionicons name="location-outline" size={14} color={Colors.primary} />
              <Text style={styles.counterBadgeText}>{order.pickupCounter}</Text>
            </View>
          </View>

          <View style={styles.ticketDottedLine} />

          {/* Pickup time highlight */}
          <View style={styles.pickupHighlightBox}>
            <Ionicons name="time" size={24} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pickupHighlightLabel}>Ready for Pickup at</Text>
              <Text style={styles.pickupHighlightTime}>{order.pickupTime}</Text>
            </View>
          </View>

          {/* QR Code Verification Simulation */}
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code" size={110} color={Colors.dark} />
              <Text style={styles.qrScanHint}>Scan at Counter to Collect</Text>
            </View>
            <Text style={styles.tokenCode}>{order.qrCodeData}</Text>
          </View>

          {/* Order Details List */}
          <View style={styles.itemsSummary}>
            <Text style={styles.itemsSummaryTitle}>Ordered Food Summary</Text>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemQty}>{item.quantity}x</Text>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.menuItem.name}
                </Text>
                <Text style={styles.itemPrice}>${item.itemTotal.toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Paid with {order.paymentMethod}</Text>
              <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigateTo('OrderTracking', { orderId: order.id })}
            activeOpacity={0.85}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
            <Text style={styles.trackBtnText}>Track Live Order Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigateTo('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBtnText}>Return to Main Menu</Text>
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
    paddingVertical: Spacing.xl,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.lg,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  checkCircle: {
    marginBottom: Spacing.sm,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  ticketCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  orderNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  counterBadgeText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  ticketDottedLine: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
    borderStyle: 'dashed',
    marginVertical: Spacing.md,
  },
  pickupHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  pickupHighlightLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
    textTransform: 'uppercase',
  },
  pickupHighlightTime: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.dark,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  qrBox: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  qrScanHint: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 4,
  },
  tokenCode: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
  },
  itemsSummary: {
    paddingTop: Spacing.sm,
  },
  itemsSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQty: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    width: 24,
  },
  itemName: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  actionsBox: {
    gap: Spacing.sm,
  },
  trackBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  homeBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  homeBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
