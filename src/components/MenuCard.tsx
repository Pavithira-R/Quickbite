import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../types';
import { Colors, BorderRadius, Spacing } from '../theme/colors';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';

interface MenuCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onPress }) => {
  const { favorites, toggleFavorite } = useMenu();
  const { addToCart } = useCart();
  const isFav = favorites.includes(item.id);

  const getDietaryBadge = () => {
    switch (item.dietary) {
      case 'veg':
        return { color: Colors.veg, bg: Colors.vegBg, label: 'Veg' };
      case 'vegan':
        return { color: Colors.vegan, bg: Colors.veganBg, label: 'Vegan' };
      default:
        return { color: Colors.nonVeg, bg: Colors.nonVegBg, label: 'Non-Veg' };
    }
  };

  const badge = getDietaryBadge();

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.topBadgeRow}>
          <View style={[styles.dietaryTag, { backgroundColor: badge.bg }]}>
            <View style={[styles.dietaryDot, { backgroundColor: badge.color }]} />
            <Text style={[styles.dietaryText, { color: badge.color }]}>{badge.label}</Text>
          </View>

          <TouchableOpacity
            style={styles.favButton}
            onPress={(e) => {
              // Don't open the item detail when tapping the favourite button
              e?.stopPropagation?.();
              toggleFavorite(item.id);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? Colors.primary : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {item.isPopular && (
          <View style={styles.popularBadge}>
            <Ionicons name="flame" size={12} color="#FFFFFF" />
            <Text style={styles.popularBadgeText}>Popular</Text>
          </View>
        )}
        {item.isSpecial && !item.isPopular && (
          <View style={[styles.popularBadge, { backgroundColor: Colors.secondaryDark }]}>
            <Ionicons name="sparkles" size={12} color="#FFFFFF" />
            <Text style={styles.popularBadgeText}>Special</Text>
          </View>
        )}

        <View style={styles.prepTimeTag}>
          <Ionicons name="time-outline" size={12} color="#FFFFFF" />
          <Text style={styles.prepTimeText}>{item.prepTime}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsCount}>({item.reviewsCount})</Text>
          </View>
          <Text style={styles.caloriesText}>{item.calories}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e?.stopPropagation?.();
              addToCart(item, 1);
            }}
            activeOpacity={0.8}
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 165,
    backgroundColor: Colors.borderLight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgeRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  dietaryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dietaryDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 4,
  },
  dietaryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  favButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  popularBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
    gap: 3,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  prepTimeTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  prepTimeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewsCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  caloriesText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
    gap: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
