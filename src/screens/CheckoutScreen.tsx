import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Order } from '../types';

export const CheckoutScreen: React.FC = () => {
  const { cart, cartTotal, cartItemCount, user, placeOrder, goBack, navigateTo, showToast } =
    useApp();

  const pickupSlots = [
    { id: 'asap', label: 'Express ASAP (~10-15 min)', icon: 'flash-outline' },
    { id: 'break1', label: 'Morning Break (10:45 AM)', icon: 'time-outline' },
    { id: 'lunch', label: 'Lunch Break (1:15 PM)', icon: 'restaurant-outline' },
    { id: 'break2', label: 'Afternoon Break (4:00 PM)', icon: 'cafe-outline' },
  ];

  type PaymentOption = Order['paymentMethod'];
  const paymentMethods: { id: PaymentOption; label: string; icon: string; desc: string }[] = [
    {
      id: 'Campus Smartcard',
      label: 'Campus Smartcard / RFID',
      icon: 'card-outline',
      desc: `Balance: Rs. ${user?.walletBalance.toFixed(2) || '0.00'}`,
    },
    {
      id: 'LankaQR',
      label: 'LankaQR',
      icon: 'qr-code-outline',
      desc: 'Scan & pay with your bank or wallet app',
    },
    {
      id: 'Credit/Debit Card',
      label: 'Credit / Debit Card',
      icon: 'card',
      desc: 'Visa, Mastercard, Amex',
    },
    {
      id: 'Cash on Pickup',
      label: 'Cash on Counter Pickup',
      icon: 'cash-outline',
      desc: 'Pay at canteen pickup counter #2',
    },
  ];

  const [selectedSlot, setSelectedSlot] = useState(pickupSlots[0].label);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>('Campus Smartcard');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWalletInsufficient =
    selectedPayment === 'Campus Smartcard' && (user?.walletBalance || 0) < cartTotal;

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      showToast('Cart is empty. Please add items first.', 'error');
      navigateTo('Home');
      return;
    }

    if (isWalletInsufficient) {
      showToast(
        'Insufficient Smartcard balance. Please top-up or choose another payment method.',
        'error',
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(selectedSlot, selectedPayment, orderNotes);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout & Pickup" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Pickup Time Slot */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Select Pickup Time Slot</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Order ahead so food is fresh & hot right when your lecture finishes.
          </Text>

          <View style={styles.slotsGrid}>
            {pickupSlots.map((slot) => {
              const isSelected = selectedSlot === slot.label;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.slotCard, isSelected && styles.slotCardActive]}
                  onPress={() => setSelectedSlot(slot.label)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={slot.icon as any}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.slotLabel, isSelected && styles.slotLabelActive]}>
                    {slot.label}
                  </Text>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentList}>
            {paymentMethods.map((pm) => {
              const isSelected = selectedPayment === pm.id;
              return (
                <TouchableOpacity
                  key={pm.id}
                  style={[styles.paymentCard, isSelected && styles.paymentCardActive]}
                  onPress={() => setSelectedPayment(pm.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentLeft}>
                    <View
                      style={[
                        styles.paymentIconBox,
                        isSelected && { backgroundColor: Colors.primaryLight },
                      ]}
                    >
                      <Ionicons
                        name={pm.icon as any}
                        size={20}
                        color={isSelected ? Colors.primary : Colors.textSecondary}
                      />
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text
                        style={[
                          styles.paymentTitle,
                          isSelected && { color: Colors.primaryDark, fontWeight: '800' },
                        ]}
                      >
                        {pm.label}
                      </Text>
                      <Text style={styles.paymentDesc}>{pm.desc}</Text>
                    </View>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {isWalletInsufficient && (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={18} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningText}>
                  Your campus balance (Rs. {user?.walletBalance.toFixed(2)}) is less than total
                  amount (Rs. {cartTotal.toFixed(2)}).
                </Text>
                <TouchableOpacity onPress={() => navigateTo('Profile')}>
                  <Text style={styles.topUpLink}>Top-up campus wallet now →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Step 3: Kitchen Instructions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Pickup / Kitchen Note</Text>
          </View>

          <TextInput
            style={styles.notesInput}
            placeholder="Add any specific pickup instruction (e.g., pack cutlery, separate bags)"
            placeholderTextColor={Colors.textMuted}
            value={orderNotes}
            onChangeText={setOrderNotes}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Order Summary Snapshot */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items in order ({cartItemCount})</Text>
            <Text style={styles.summaryVal}>
              {cart.map((c) => `${c.quantity}x ${c.menuItem.name}`).join(', ')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Payable Amount</Text>
            <Text style={styles.summaryTotalVal}>Rs. {cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Confirm & Place Order Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleConfirmOrder}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Placing Order...' : `Pay & Place Order • Rs. ${cartTotal.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
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
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: Spacing.sm,
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    marginLeft: 30,
  },
  slotsGrid: {
    gap: Spacing.sm,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  slotLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: Spacing.md,
  },
  slotLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  paymentList: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  paymentDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  topUpLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  notesInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 50,
    marginTop: Spacing.xs,
  },
  summaryBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    maxWidth: '50%',
    textAlign: 'right',
  },
  summaryTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmBtn: {
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
    elevation: 5,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
