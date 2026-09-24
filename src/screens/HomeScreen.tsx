import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CategoryPills } from '../components/CategoryPills';
import { MenuCard } from '../components/MenuCard';
import { MenuItem } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedMenuItem,
    navigateTo,
    user,
    cartItemCount,
  } = useApp();

  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg'>('all');

  // Filter menu items by category, search query, and dietary preference
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Dietary filter match
      const matchDietary =
        dietaryFilter === 'all' || item.dietary === 'veg' || item.dietary === 'vegan';

      // Search query match
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchDietary && matchSearch;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery]);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    navigateTo('ItemDetail', { itemId: item.id });
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome greeting bar */}
        <View style={styles.greetingBar}>
          <View>
            <Text style={styles.greetingTitle}>
              Hello, {user?.name ? user.name.split(' ')[0] : 'Student'} 👋
            </Text>
            <Text style={styles.greetingSub}>
              What are you craving for between lectures today?
            </Text>
          </View>

          <TouchableOpacity
            style={styles.walletPill}
            onPress={() => navigateTo('Profile')}
            activeOpacity={0.8}
          >
            <Ionicons name="wallet-outline" size={15} color={Colors.primaryDark} />
            <Text style={styles.walletText}>${user?.walletBalance.toFixed(2) || '0.00'}</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Announcement Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoTag}>
              <Ionicons name="sparkles" size={12} color="#FFFFFF" />
              <Text style={styles.promoTagText}>CAMPUS FLASH DEAL</Text>
            </View>
            <Text style={styles.promoTitle}>15% Off Your Next Meal!</Text>
            <Text style={styles.promoDesc}>
              Use code <Text style={styles.promoCodeHighlight}>STUDENT15</Text> at checkout.
            </Text>
          </View>
          <View style={styles.promoIconCircle}>
            <Ionicons name="fast-food" size={32} color={Colors.primary} />
          </View>
        </View>

        {/* Search Bar & Dietary Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search burgers, coffee, rice bowls..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {!!searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Veg-Only Toggle */}
          <TouchableOpacity
            style={[
              styles.vegToggleBtn,
              dietaryFilter === 'veg' && styles.vegToggleBtnActive,
            ]}
            onPress={() => setDietaryFilter(dietaryFilter === 'all' ? 'veg' : 'all')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.vegDot,
                dietaryFilter === 'veg' && { backgroundColor: '#FFFFFF' },
              ]}
            />
            <Text
              style={[
                styles.vegToggleText,
                dietaryFilter === 'veg' && styles.vegToggleTextActive,
              ]}
            >
              Veg Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Selector */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all'
              ? 'Daily Canteen Menu'
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Menu`}
          </Text>
          <Text style={styles.itemCountText}>{filteredItems.length} items available</Text>
        </View>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No menu items found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with a different keyword or resetting filters.
            </Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDietaryFilter('all');
              }}
            >
              <Text style={styles.resetFilterText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.menuGrid}>
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onPress={handleSelectItem}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating View Cart Pill if cart has items */}
      {cartItemCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={styles.floatingCartButton}
            onPress={() => navigateTo('Cart')}
            activeOpacity={0.9}
          >
            <View style={styles.cartCountCircle}>
              <Text style={styles.cartCountText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.floatingCartText}>View Order Cart</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 90,
  },
  greetingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  greetingSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.2)',
    gap: 4,
  },
  walletText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  promoBanner: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    backgroundColor: Colors.dark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  promoContent: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  promoTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  promoDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  promoCodeHighlight: {
    color: Colors.accent,
    fontWeight: '800',
  },
  promoIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    height: '100%',
  },
  clearSearchBtn: {
    padding: 4,
  },
  vegToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  vegToggleBtnActive: {
    backgroundColor: Colors.veg,
    borderColor: Colors.veg,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.veg,
  },
  vegToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  vegToggleTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  itemCountText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  menuGrid: {
    paddingHorizontal: Spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  resetFilterBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.pill,
  },
  resetFilterText: {
    color: Colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 20,
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
    zIndex: 90,
  },
  floatingCartButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 500,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cartCountCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  floatingCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
