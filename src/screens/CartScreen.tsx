import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const CartScreen: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartPackagingFee,
    cartTotal,
    cartItemCount,
    appliedPromoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    navigateTo,
    showToast,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError('Please enter a coupon code.');
      return;
    }
    const res = applyPromoCode(promoInput.trim());
    if (res.success) {
      setPromoError('');
      setPromoInput('');
      showToast(res.message, 'success');
    } else {
      setPromoError(res.message);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Your cart" showBack={false} />
        <View style={styles.emptyCartBox}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={54} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add something from the menu to order ahead.</Text>
          <TouchableOpacity
            style={styles.browseMenuBtn}
            onPress={() => navigateTo('Home')}
            activeOpacity={0.85}
          >
            <Ionicons name="restaurant-outline" size={18} color="#FFFFFF" />
            <Text style={styles.browseMenuText}>Browse menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Your cart"
        subtitle={`${cartItemCount} item(s) selected`}
        rightAction={
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Items</Text>

          {cart.map((item, index) => {
            return (
              <View key={item.id} style={[styles.cartItemRow, index > 0 && styles.cartItemBorder]}>
                <Image
                  source={{ uri: item.menuItem.image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemDetails}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.menuItem.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.trashBtn}
                      accessibilityLabel="Remove item"
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.customizationsWrap}>
                    {item.customization?.size && (
                      <Text style={styles.customPill}>{item.customization.size}</Text>
                    )}
                    {item.customization?.spiceLevel && (
                      <Text style={styles.customPill}>{item.customization.spiceLevel} spice</Text>
                    )}
                    {item.customization?.addOns?.map((addon) => (
                      <Text key={addon.id} style={styles.customPill}>
                        + {addon.name}
                      </Text>
                    ))}
                    {item.customization?.notes ? (
                      <Text style={styles.customPill}>Note: {item.customization.notes}</Text>
                    ) : null}
                  </View>

                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemTotalPrice}>Rs. {item.itemTotal.toFixed(2)}</Text>

                    <View style={styles.qtyStepper}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                          size={14}
                          color={item.quantity === 1 ? '#EF4444' : Colors.textPrimary}
                        />
                      </TouchableOpacity>

                      <Text style={styles.qtyNum}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={14} color={Colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Promo code</Text>
          {appliedPromoCode ? (
            <View style={styles.appliedPromoBox}>
              <View style={styles.appliedPromoLeft}>
                <Ionicons name="ticket" size={20} color={Colors.secondary} />
                <View>
                  <Text style={styles.appliedCodeText}>Promo applied: {appliedPromoCode}</Text>
                  <Text style={styles.appliedSavingsText}>
                    You saved Rs. {promoDiscount.toFixed(2)}!
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={removePromoCode} style={styles.removePromoBtn}>
                <Text style={styles.removePromoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.promoInputRow}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter promo code"
                  placeholderTextColor={Colors.textMuted}
                  value={promoInput}
                  onChangeText={(t) => {
                    setPromoInput(t);
                    if (promoError) setPromoError('');
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyPromoBtn}
                  onPress={handleApplyPromo}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyPromoBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {promoError ? <Text style={styles.promoErrorText}>{promoError}</Text> : null}
              <View style={styles.promoChipsRow}>
                <TouchableOpacity
                  style={styles.promoChip}
                  onPress={() => {
                    setPromoInput('STUDENT15');
                    applyPromoCode('STUDENT15');
                  }}
                >
                  <Text style={styles.promoChipText}>STUDENT15 · 15% off</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.promoChip}
                  onPress={() => {
                    setPromoInput('FREEDRINK');
                    applyPromoCode('FREEDRINK');
                  }}
                >
                  <Text style={styles.promoChipText}>FREEDRINK · Rs. 250 off</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Summary</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>Rs. {cartSubtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax (5%)</Text>
            <Text style={styles.billValue}>Rs. {cartTax.toFixed(2)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Packaging</Text>
            <Text style={styles.billValue}>Rs. {cartPackagingFee.toFixed(2)}</Text>
          </View>

          {promoDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: Colors.secondary }]}>Discount</Text>
              <Text style={[styles.billValue, { color: Colors.secondary }]}>
                -Rs. {promoDiscount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalSub}>Including tax and packaging</Text>
            </View>
            <Text style={styles.grandTotalText}>Rs. {cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomTotalCol}>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>Rs. {cartTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigateTo('Checkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCartBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  browseMenuBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.pill,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseMenuText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  cartItemRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
  },
  cartItemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  itemDetails: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  itemNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  trashBtn: {
    padding: 2,
  },
  customizationsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: 4,
  },
  customPill: {
    fontSize: 10,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNum: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 8,
  },
  appliedPromoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  appliedPromoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  appliedCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  appliedSavingsText: {
    fontSize: 11,
    color: Colors.secondaryDark,
  },
  removePromoBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removePromoText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '700',
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 42,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  applyPromoBtn: {
    backgroundColor: Colors.darkLight,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyPromoBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  promoErrorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
  },
  promoChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  promoChip: {
    backgroundColor: Colors.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promoChipText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
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
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  totalSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  grandTotalText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  bottomTotalCol: {
    justifyContent: 'center',
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.pill,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
