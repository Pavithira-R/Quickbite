import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CustomizationOption } from '../types';
import { calculateUnitPrice } from '../utils/cartLogic';

export const ItemDetailScreen: React.FC = () => {
  const { selectedMenuItem, addToCart, navigateTo, goBack, favorites, toggleFavorite } = useApp();

  const item = selectedMenuItem;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<string>(
    item?.availableCustomizations?.spiceLevels
      ? item.availableCustomizations.spiceLevels[0]
      : 'Mild',
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    item?.availableCustomizations?.sizes ? item.availableCustomizations.sizes[0].name : 'Regular',
  );
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!item) {
    return (
      <View style={styles.notFoundContainer}>
        <Header showBack />
        <View style={styles.notFoundContent}>
          <Text style={styles.notFoundText}>Menu item not found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backBtnText}>Return to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isFav = favorites.includes(item.id);

  // Add-on toggle
  const toggleAddOn = (addon: CustomizationOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Quantity stepper
  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Dynamic unit price & total
  const unitPrice = calculateUnitPrice(item, {
    size: item.availableCustomizations?.sizes ? selectedSize : undefined,
    addOns: selectedAddOns,
  });
  const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

  const handleAddToCart = () => {
    addToCart(item, quantity, {
      size: item.availableCustomizations?.sizes ? selectedSize : undefined,
      spiceLevel: item.availableCustomizations?.spiceLevels ? selectedSpice : undefined,
      addOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      notes: specialNote.trim() || undefined,
    });
    goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.favCircle}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={isFav ? Colors.primary : Colors.textMuted}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay} />

          <View style={styles.floatingTagRow}>
            <View style={styles.dietaryPill}>
              <View
                style={[
                  styles.dietaryDot,
                  {
                    backgroundColor:
                      item.dietary === 'veg'
                        ? Colors.veg
                        : item.dietary === 'vegan'
                          ? Colors.vegan
                          : Colors.nonVeg,
                  },
                ]}
              />
              <Text style={styles.dietaryPillText}>{item.dietary.toUpperCase()}</Text>
            </View>

            <View style={styles.prepTimePill}>
              <Ionicons name="time-outline" size={13} color="#FFFFFF" />
              <Text style={styles.prepTimePillText}>{item.prepTime}</Text>
            </View>
          </View>
        </View>

        {/* Content Details */}
        <View style={styles.detailsContent}>
          <View style={styles.titleRow}>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>({item.reviewsCount} reviews)</Text>
            </View>

            <View style={styles.calorieBox}>
              <Ionicons name="flame-outline" size={15} color={Colors.primary} />
              <Text style={styles.calorieText}>{item.calories}</Text>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceText}>Rs. {item.price.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Size Customizer if available */}
          {item.availableCustomizations?.sizes && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Choose Portion Size</Text>
              <View style={styles.optionsRow}>
                {item.availableCustomizations.sizes.map((sz) => {
                  const isSelected = selectedSize === sz.name;
                  const sizeExtra = item.price * sz.priceMultiplier - item.price;
                  return (
                    <TouchableOpacity
                      key={sz.name}
                      style={[styles.optionPill, isSelected && styles.optionPillActive]}
                      onPress={() => setSelectedSize(sz.name)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.optionPillText, isSelected && styles.optionPillTextActive]}
                      >
                        {sz.name}
                        {sizeExtra > 0 ? `  +Rs. ${sizeExtra.toFixed(2)}` : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Spice Level Customizer if available */}
          {item.availableCustomizations?.spiceLevels && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Spice Level</Text>
              <View style={styles.optionsRow}>
                {item.availableCustomizations.spiceLevels.map((spice) => {
                  const isSelected = selectedSpice === spice;
                  return (
                    <TouchableOpacity
                      key={spice}
                      style={[styles.optionPill, isSelected && styles.optionPillActive]}
                      onPress={() => setSelectedSpice(spice)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="flame"
                        size={14}
                        color={isSelected ? '#FFFFFF' : Colors.primary}
                      />
                      <Text
                        style={[styles.optionPillText, isSelected && styles.optionPillTextActive]}
                      >
                        {spice}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Add-ons Checklist if available */}
          {item.availableCustomizations?.addOns &&
            item.availableCustomizations.addOns.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Add Extras & Dips</Text>
                <View style={styles.addOnsList}>
                  {item.availableCustomizations.addOns.map((addon) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <TouchableOpacity
                        key={addon.id}
                        style={[styles.addOnRow, isChecked && styles.addOnRowChecked]}
                        onPress={() => toggleAddOn(addon)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.addOnLeft}>
                          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                            {isChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                          </View>
                          <Text style={styles.addOnName}>{addon.name}</Text>
                        </View>
                        <Text style={styles.addOnPrice}>+Rs. {addon.price.toFixed(2)}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

          {/* Special Instructions */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Special Note to Canteen Chef (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Extra napkins, sauce on the side, no onions"
              placeholderTextColor={Colors.textMuted}
              value={specialNote}
              onChangeText={setSpecialNote}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar with Quantity and Add-to-Cart */}
      <View style={styles.bottomBar}>
        <View style={styles.stepperBox}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={decrementQty}
            activeOpacity={0.7}
            accessibilityLabel="Decrease quantity"
          >
            <Ionicons name="remove" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{quantity}</Text>

          <TouchableOpacity
            style={styles.stepBtn}
            onPress={incrementQty}
            activeOpacity={0.7}
            accessibilityLabel="Increase quantity"
          >
            <Ionicons name="add" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <View style={styles.btnContentRow}>
            <Text style={styles.addToCartBtnText}>Add to Cart</Text>
            <Text style={styles.btnPriceText}>• Rs. {totalPrice.toFixed(2)}</Text>
          </View>
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
  notFoundContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  favCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: Colors.dark,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  floatingTagRow: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dietaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  dietaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dietaryPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  prepTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  prepTimePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  detailsContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  titleRow: {
    marginBottom: Spacing.sm,
  },
  itemName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  calorieBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  calorieText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  priceBox: {
    marginLeft: 'auto',
  },
  priceText: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  sectionBlock: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  optionPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  optionPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addOnsList: {
    gap: Spacing.sm,
  },
  addOnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addOnRowChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  addOnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  addOnName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  addOnPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.md,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    minWidth: 32,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnPriceText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.95,
  },
});
