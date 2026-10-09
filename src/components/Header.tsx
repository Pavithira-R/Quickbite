import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const { currentScreen, goBack, navigateTo } = useNavigation();
  const { user } = useAuth();
  const { cartItemCount } = useCart();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.brandRow}
            onPress={() => navigateTo('Home')}
            activeOpacity={0.8}
          >
            <View style={styles.logoBadge}>
              <Ionicons name="fast-food" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandName}>
                Quick<Text style={styles.brandHighlight}>Bite</Text>
              </Text>
              <Text style={styles.campusTag}>Campus canteen</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <View style={styles.titleSection}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      )}

      <View style={styles.rightSection}>
        {rightAction ? (
          rightAction
        ) : (
          <View style={styles.defaultActions}>
            {currentScreen !== 'Cart' && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigateTo('Cart')}
                activeOpacity={0.7}
                accessibilityLabel="Shopping Cart"
              >
                <Ionicons name="cart-outline" size={22} color={Colors.textPrimary} />
                {cartItemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {currentScreen !== 'Profile' && (
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={() => navigateTo('Profile')}
                activeOpacity={0.7}
                accessibilityLabel="User Profile"
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: Colors.primary,
  },
  campusTag: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  titleSection: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitleText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  avatarButton: {
    marginLeft: 4,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
});
