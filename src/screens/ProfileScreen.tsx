import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    orders,
    logoutUser,
    topUpWallet,
    reorderPastOrder,
    navigateTo,
  } = useApp();

  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [selectedTopUpAmount, setSelectedTopUpAmount] = useState(1000);

  const handleTopUpConfirm = () => {
    topUpWallet(selectedTopUpAmount);
    setTopUpModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Student Profile & History" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarLetter}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.roleTag}>
                <Ionicons name="school" size={12} color={Colors.primaryDark} />
                <Text style={styles.roleTagText}>{user?.campusRole || 'Student'}</Text>
              </View>
              <Text style={styles.userName}>{user?.name || 'Campus Student'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'student@campus.edu'}</Text>
              <Text style={styles.studentIdBadge}>ID: {user?.studentId || 'CS-2024-8841'}</Text>
            </View>
          </View>

          {/* Campus Smartcard Wallet Box */}
          <View style={styles.walletBox}>
            <View style={styles.walletLeft}>
              <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
              <View>
                <Text style={styles.walletLabel}>Campus Smartcard Balance</Text>
                <Text style={styles.walletBalance}>Rs. {user?.walletBalance.toFixed(2) || '0.00'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.topUpBtn}
              onPress={() => setTopUpModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.topUpBtnText}>Top-up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order History Section */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <Text style={styles.historySectionTitle}>Campus Order History</Text>
            <Text style={styles.orderCountBadge}>{orders.length} orders</Text>
          </View>

          {orders.map((ord) => {
            return (
              <View key={ord.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderCardNum}>{ord.orderNumber}</Text>
                    <Text style={styles.orderCardDate}>{ord.createdAt}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      ord.status === 'Completed' && styles.statusCompleted,
                      ord.status === 'Ready for Pickup' && styles.statusReady,
                      ord.status === 'Preparing' && styles.statusPreparing,
                      ord.status === 'Placed' && styles.statusPlaced,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        ord.status === 'Completed' && styles.statusCompletedText,
                        ord.status === 'Ready for Pickup' && styles.statusReadyText,
                        ord.status === 'Preparing' && styles.statusPreparingText,
                        ord.status === 'Placed' && styles.statusPlacedText,
                      ]}
                    >
                      {ord.status}
                    </Text>
                  </View>
                </View>

                {/* Items in this order */}
                <View style={styles.orderItemsList}>
                  {ord.items.map((it, i) => (
                    <Text key={i} style={styles.orderItemText}>
                      • {it.quantity}x {it.menuItem.name}
                    </Text>
                  ))}
                </View>

                {/* Footer with total & Reorder */}
                <View style={styles.orderCardFooter}>
                  <Text style={styles.orderTotal}>Total: Rs. {ord.total.toFixed(2)}</Text>

                  <View style={styles.orderActions}>
                    <TouchableOpacity
                      style={styles.viewOrderBtn}
                      onPress={() => navigateTo('OrderTracking', { orderId: ord.id })}
                    >
                      <Text style={styles.viewOrderText}>View Status</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.reorderSmallBtn}
                      onPress={() => reorderPastOrder(ord)}
                    >
                      <Ionicons name="refresh" size={13} color="#FFFFFF" />
                      <Text style={styles.reorderSmallText}>Reorder</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* App Info & Logout */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logoutUser}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Sign Out from Canteen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Top-up Balance Modal */}
      <Modal visible={topUpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Top-up Campus Wallet</Text>
              <TouchableOpacity onPress={() => setTopUpModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>Select reload amount for instant contactless payment:</Text>

            <View style={styles.topUpOptionsRow}>
              {[500, 1000, 2500, 5000].map((amt) => {
                const isSelected = selectedTopUpAmount === amt;
                return (
                  <TouchableOpacity
                    key={amt}
                    style={[styles.topUpAmtCard, isSelected && styles.topUpAmtCardActive]}
                    onPress={() => setSelectedTopUpAmount(amt)}
                  >
                    <Text style={[styles.topUpAmtText, isSelected && styles.topUpAmtTextActive]}>
                      Rs. {amt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.confirmTopUpBtn}
              onPress={handleTopUpConfirm}
            >
              <Text style={styles.confirmTopUpText}>
                Add Rs. {selectedTopUpAmount}.00 to Smartcard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarLetter: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  profileDetails: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  studentIdBadge: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  walletBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  walletLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  walletBalance: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  topUpBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  topUpBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  historySection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  historySectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  orderCountBadge: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  orderCardNum: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  orderCardDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusCompleted: { backgroundColor: '#F1F5F9' },
  statusCompletedText: { color: '#64748B' },
  statusReady: { backgroundColor: '#ECFDF5' },
  statusReadyText: { color: '#059669' },
  statusPreparing: { backgroundColor: '#FEF3C7' },
  statusPreparingText: { color: '#D97706' },
  statusPlaced: { backgroundColor: '#EFF6FF' },
  statusPlacedText: { color: '#2563EB' },
  orderItemsList: {
    marginVertical: 4,
  },
  orderItemText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  orderActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  viewOrderBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewOrderText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  reorderSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  reorderSmallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  settingsSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FEE2E2',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  topUpOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  topUpAmtCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  topUpAmtCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  topUpAmtText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  topUpAmtTextActive: {
    color: Colors.primaryDark,
  },
  confirmTopUpBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
  },
  confirmTopUpText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
