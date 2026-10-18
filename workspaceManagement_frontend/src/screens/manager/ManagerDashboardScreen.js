import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';
import { IMAGES } from '../../assets/images';

export const ManagerDashboardScreen = ({ navigation }) => {
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('MANAGER');

  const { tasks } = useSelector((state) => state.tasks);
  const { leaves } = useSelector((state) => state.leaves);
  const { requirements } = useSelector((state) => state.requirements);

  // Compute dual-deadline conflicts using useMemo
  const conflictingTasks = useMemo(() => {
    return tasks.filter((t) => t.hasConflict || t.bufferDays < 0);
  }, [tasks]);

  const pendingLeaves = useMemo(() => {
    return leaves.filter((l) => l.status === 'PENDING').length;
  }, [leaves]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Manager Operational Dashboard"
        subtitle="Engineering Management"
        navigation={navigation}
        statusText="TEAM ONLINE"
        statusColor="#1D4ED8"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Conditional Dual-Deadline Conflict Alert Card */}
        {conflictingTasks.length > 0 && (
          <View style={styles.conflictAlertCard}>
            <View style={styles.alertHeaderRow}>
              <View style={styles.alertTitleRow}>
                <Icon name="alert-triangle" size={18} color="#DC2626" />
                <Text style={styles.alertTitle}>DUAL-DEADLINE SCHEDULE RISK DETECTED</Text>
              </View>
              <View style={styles.conflictBadge}>
                <Text style={styles.conflictBadgeText}>1 CRITICAL</Text>
              </View>
            </View>

            <Text style={styles.conflictDescription}>
              {conflictingTasks[0]?.conflictDetails ||
                'Payment Gateway Webhook Sync • -3d slack • Internal Employee Due: Oct 28, 2026 vs External Client Due: Oct 25, 2026'}
            </Text>

            <TouchableOpacity
              style={styles.reviewTaskBtn}
              onPress={() => navigation.navigate('Tasks')}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewTaskBtnText}>Review &amp; Reschedule Task →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2x2 KPI Grid */}
        <Text style={[styles.sectionHeading, { color: palette.textPrimary }]}>
          Engineering Operational KPI Pulse
        </Text>
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiValue, { color: '#16A34A' }]}>8/10</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Team Present</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiValue, { color: '#D97706' }]}>{pendingLeaves}</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Pending Leave</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiValue, { color: '#1D4ED8' }]}>
              {tasks.length} ({conflictingTasks.length} Conflict)
            </Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Active Tasks</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiValue, { color: '#4338CA' }]}>{requirements.length}</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Requirements</Text>
          </View>
        </View>

        {/* Workforce Hub Telemetry Image Card */}
        <View style={[styles.telemetryCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Workforce Hub Telemetry — Lahore Campus • Building B, Tier 2
          </Text>
          <Text style={[styles.cardSub, { color: palette.textSecondary }]}>
            Direct visual line-of-sight & live sprint engineering bay
          </Text>

          <View style={styles.telemetryImageWrapper}>
            <Image
              source={IMAGES.telemetryCampusHub}
              style={styles.telemetryImage}
              resizeMode="cover"
            />
            <View style={styles.telemetryOverlayPill}>
              <View style={styles.onlineDot} />
              <Text style={styles.telemetryOverlayText}>12 Direct Reports Connected</Text>
            </View>
          </View>
        </View>

        {/* Management Controls Navigation Rows */}
        <Text style={[styles.sectionHeading, { color: palette.textPrimary }]}>
          Management Controls
        </Text>
        <View style={styles.controlsList}>
          <TouchableOpacity
            style={[styles.controlRow, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
            onPress={() => navigation.navigate('Team & Leave')}
          >
            <View style={[styles.controlIconBox, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="people" size={18} color="#1D4ED8" />
            </View>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlTitle, { color: palette.textPrimary }]}>Assigned Team Attendance</Text>
              <Text style={[styles.controlSub, { color: palette.textSecondary }]}>Filter direct reports & daily presence audit</Text>
            </View>
            <Icon name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlRow, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
            onPress={() => navigation.navigate('Team & Leave')}
          >
            <View style={[styles.controlIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="calendar" size={18} color="#D97706" />
            </View>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlTitle, { color: palette.textPrimary }]}>Leave Review & Approvals</Text>
              <Text style={[styles.controlSub, { color: palette.textSecondary }]}>Overlap verification & comment enforcement</Text>
            </View>
            <Icon name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlRow, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
            onPress={() => navigation.navigate('Tasks')}
          >
            <View style={[styles.controlIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="time" size={18} color="#DC2626" />
            </View>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlTitle, { color: palette.textPrimary }]}>Team Task Board & Dual Deadlines</Text>
              <Text style={[styles.controlSub, { color: palette.textSecondary }]}>Create tasks, resolve slack & audit progress</Text>
            </View>
            <Icon name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlRow, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
            onPress={() => navigation.navigate('Requirements')}
          >
            <View style={[styles.controlIconBox, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="flag" size={18} color="#4338CA" />
            </View>
            <View style={styles.controlInfo}>
              <Text style={[styles.controlTitle, { color: palette.textPrimary }]}>Client Requirement Sync</Text>
              <Text style={[styles.controlSub, { color: palette.textSecondary }]}>Create requirements, manage milestones & broadcasts</Text>
            </View>
            <Icon name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Recent Team Milestones */}
        <Text style={[styles.sectionHeading, { color: palette.textPrimary }]}>
          Recent Team Milestones
        </Text>
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.milestoneItem}>
            <View style={[styles.mDot, { backgroundColor: '#10B981' }]} />
            <View style={styles.mInfo}>
              <Text style={[styles.mTitle, { color: palette.textPrimary }]}>
                Stripe Billing Webhook Integration Completed
              </Text>
              <Text style={styles.mSub}>REQ-101 • Ali Raza marked ready for deployment</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  conflictAlertCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  alertTitle: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  conflictBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conflictBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  conflictDescription: {
    color: '#7F1D1D',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  reviewTaskBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  reviewTaskBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 18,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  telemetryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  telemetryImageWrapper: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  telemetryImage: {
    width: '100%',
    height: '100%',
  },
  telemetryOverlayPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  telemetryOverlayText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  controlsList: {
    gap: 8,
    marginBottom: 18,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  controlIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  controlSub: {
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mInfo: {
    flex: 1,
  },
  mTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  mSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});

export default ManagerDashboardScreen;
