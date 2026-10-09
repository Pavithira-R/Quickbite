import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { TestCaseResult } from '../types';

const STATUS_STYLES: Record<TestCaseResult['status'], { icon: 'checkmark-circle' | 'close-circle' | 'time-outline'; color: string; background: string; prefix: string }> = {
  PASS: { icon: 'checkmark-circle', color: '#059669', background: '#ECFDF5', prefix: '✅ ' },
  FAIL: { icon: 'close-circle', color: '#DC2626', background: '#FEF2F2', prefix: '❌ ' },
  PENDING: { icon: 'time-outline', color: Colors.textMuted, background: Colors.background, prefix: '' },
};

export const TestSuiteScreen: React.FC = () => {
  const { testCases, runTestSuite, navigateTo } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>('TC-01');

  const passedCount = testCases.filter((tc) => tc.status === 'PASS').length;

  return (
    <View style={styles.container}>
      <Header title="Part D: QA Test Suite" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner summary */}
        <View style={styles.summaryBanner}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerTag}>CROSS-PLATFORM TESTING SUITE</Text>
              <Text style={styles.bannerTitle}>QuickBite MVP Verification</Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNum}>{passedCount}/{testCases.length}</Text>
              <Text style={styles.scoreLabel}>Passed</Text>
            </View>
          </View>

          <Text style={styles.bannerDesc}>
            Comprehensive test cases covering screen navigation, dynamic cart arithmetic, form validation, state persistence, layout responsiveness, and order state transitions.
          </Text>

          <TouchableOpacity
            style={styles.runAllBtn}
            onPress={runTestSuite}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.runAllBtnText}>Run Automated Tests</Text>
          </TouchableOpacity>
        </View>

        {/* Test Cases List */}
        <View style={styles.testsList}>
          {testCases.map((tc) => {
            const isExpanded = expandedId === tc.id;
            const statusStyle = STATUS_STYLES[tc.status];
            return (
              <View key={tc.id} style={styles.testCard}>
                <TouchableOpacity
                  style={styles.testCardHeader}
                  onPress={() => setExpandedId(isExpanded ? null : tc.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.testIdBadge}>
                    <Text style={styles.testIdText}>{tc.id}</Text>
                  </View>

                  <View style={styles.testHeaderInfo}>
                    <View style={styles.categoryRow}>
                      <Text style={styles.categoryTag}>{tc.category}</Text>
                      <View style={[styles.statusPill, { backgroundColor: statusStyle.background }]}>
                        <Ionicons name={statusStyle.icon} size={12} color={statusStyle.color} />
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{tc.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.testTitle}>{tc.title}</Text>
                  </View>

                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.testBody}>
                    <Text style={styles.sectionLabel}>Objective & Description:</Text>
                    <Text style={styles.bodyText}>{tc.description}</Text>

                    <Text style={styles.sectionLabel}>Execution Steps:</Text>
                    {tc.steps.map((step, idx) => (
                      <View key={idx} style={styles.stepRow}>
                        <Text style={styles.stepNum}>{idx + 1}.</Text>
                        <Text style={styles.stepText}>{step}</Text>
                      </View>
                    ))}

                    <View style={styles.resultBox}>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Expected Result:</Text>
                        <Text style={styles.resultVal}>{tc.expectedResult}</Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Actual Outcome:</Text>
                        <Text style={[styles.resultValStatus, { color: statusStyle.color }]}>
                          {statusStyle.prefix}{tc.actualResult}
                        </Text>
                      </View>
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Executed:</Text>
                        <Text style={styles.resultVal}>{tc.executedAt || 'Not yet'}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Quick jump to testing screens */}
        <View style={styles.quickNavSection}>
          <Text style={styles.quickNavTitle}>Quick Screen Verification Jump:</Text>
          <View style={styles.quickNavGrid}>
            {[
              { label: 'Splash Screen', screen: 'Splash' },
              { label: 'Login Screen', screen: 'Login' },
              { label: 'Menu Catalog', screen: 'Home' },
              { label: 'Shopping Cart', screen: 'Cart' },
              { label: 'Live Tracker', screen: 'OrderTracking' },
              { label: 'User Profile', screen: 'Profile' },
            ].map((s) => (
              <TouchableOpacity
                key={s.screen}
                style={styles.quickJumpBtn}
                onPress={() => navigateTo(s.screen as any)}
              >
                <Text style={styles.quickJumpText}>{s.label}</Text>
                <Ionicons name="arrow-forward" size={12} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
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
  summaryBanner: {
    backgroundColor: Colors.dark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bannerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 2,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNum: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  scoreLabel: {
    color: Colors.secondary,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  runAllBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
    gap: 8,
  },
  runAllBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  testsList: {
    gap: Spacing.sm,
  },
  testCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  testCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  testIdBadge: {
    width: 44,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  testIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  testHeaderInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.pill,
    gap: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  testBody: {
    padding: Spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    width: 18,
  },
  stepText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  resultBox: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    width: 100,
  },
  resultVal: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  resultValStatus: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  quickNavSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  quickJumpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  quickJumpText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
