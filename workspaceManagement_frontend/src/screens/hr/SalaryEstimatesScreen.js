import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import storageService, { STORAGE_KEYS } from '../../services/storageService';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';
import { calculateSalaryEstimate, formatCurrency } from '../../utils/salaryCalculator';

const PAYROLL_MONTHS = [
  { id: '2026-10', label: 'October 2026', tag: 'Ongoing', isCurrent: true, totalPayroll: 436500 },
  { id: '2026-09', label: 'September 2026', tag: 'Disbursed', isCurrent: false, totalPayroll: 450000 },
  { id: '2026-08', label: 'August 2026', tag: 'Disbursed', isCurrent: false, totalPayroll: 445000 },
  { id: '2026-07', label: 'July 2026', tag: 'Disbursed', isCurrent: false, totalPayroll: 442000 },
];

export const SalaryEstimatesScreen = ({ navigation }) => {
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('HR');

  // Users are loaded from AsyncStorage (Redux no longer stores the user list)
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const storedUsers = await storageService.getItem(STORAGE_KEYS.USERS, []);
      setUsers(storedUsers);
    })();
  }, []);

  const salaryConfig = useSelector((state) => state.salary);

  const [selectedUserId, setSelectedUserId] = useState('EMP-089'); // Ali Raza
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedMonthId, setSelectedMonthId] = useState('2026-10');

  const activeMonth =
    PAYROLL_MONTHS.find((m) => m.id === selectedMonthId) || PAYROLL_MONTHS[0];
  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  // Specific attendance values for Ali Raza as specified in blueprint
  // 19 Present, 1 Paid Leave, 1 Unpaid Leave, 1 Absent
  const aliBreakdown = useMemo(() => {
    return calculateSalaryEstimate({
      baseSalary: 150000,
      workingDaysPerPeriod: 22,
      presentDays: 19,
      paidLeaveDays: 1,
      unpaidLeaveDays: 1,
      absentDays: 1,
      deductionPerAbsentDay: 5000,
      deductionPerUnpaidLeaveDay: 3500,
      allowanceItems: [
        { id: 'trans', name: 'Transport Allowance', amount: 15000 },
        { id: 'util', name: 'Internet & Utility Allowance', amount: 5000 },
      ],
    });
  }, []);

  // Compute breakdown for currently selected user and active month
  const currentBreakdown = useMemo(() => {
    const base = selectedUser?.baseSalary || 150000;
    if (selectedMonthId === '2026-10') {
      if (selectedUser?.id === 'EMP-089') {
        return aliBreakdown;
      }
      return calculateSalaryEstimate({
        baseSalary: base,
        workingDaysPerPeriod: 22,
        presentDays: 21,
        paidLeaveDays: 1,
        unpaidLeaveDays: 0,
        absentDays: 0,
        deductionPerAbsentDay: 5000,
        deductionPerUnpaidLeaveDay: 3500,
        allowances: 20000,
      });
    }

    // Historical months (Disbursed records)
    let present = 22;
    let paidLeave = 0;
    if (selectedMonthId === '2026-08') {
      present = 21;
      paidLeave = 1;
    } else if (selectedMonthId === '2026-07') {
      present = 20;
      paidLeave = 2;
    }

    return calculateSalaryEstimate({
      baseSalary: base,
      workingDaysPerPeriod: 22,
      presentDays: present,
      paidLeaveDays: paidLeave,
      unpaidLeaveDays: 0,
      absentDays: 0,
      deductionPerAbsentDay: 5000,
      deductionPerUnpaidLeaveDay: 3500,
      allowances: 20000,
    });
  }, [selectedUser, selectedMonthId, aliBreakdown]);

  // Compute total company estimated payroll for selected month
  const totalCompanyPayroll = activeMonth.totalPayroll;

  const handleRecalculateAll = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      Alert.alert(
        'Payroll Synchronized',
        `All 24 workforce salary records recalculated for ${activeMonth.label}.`
      );
    }, 500);
  };

  const getEmployeeMonthPayout = (emp) => {
    const base = emp.baseSalary || 150000;
    if (selectedMonthId === '2026-10') {
      if (emp.id === 'EMP-089') return 161500;
      return base + 20000;
    }
    return base + 20000;
  };

  // Syllabus Requirement: Featured Audit as ListHeaderComponent
  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Historical Month Selector Strip */}
      <View style={styles.monthSelectorWrap}>
        <Text style={[styles.monthSelectorLabel, { color: palette.textSecondary }]}>
          Payroll Billing Cycle:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthChipsScroll}>
          {PAYROLL_MONTHS.map((m) => {
            const isSelected = m.id === selectedMonthId;
            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.monthChip,
                  { borderColor: isSelected ? palette.primary : palette.cardBorder },
                  isSelected ? { backgroundColor: palette.primary } : { backgroundColor: palette.card },
                ]}
                onPress={() => setSelectedMonthId(m.id)}
              >
                <Text
                  style={[
                    styles.monthChipText,
                    isSelected ? { color: '#FFFFFF' } : { color: palette.textPrimary },
                  ]}
                >
                  {m.label}
                </Text>
                <View
                  style={[
                    styles.monthTagPill,
                    m.isCurrent
                      ? { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#FEF3C7' }
                      : { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#DCFCE7' },
                  ]}
                >
                  <Text
                    style={[
                      styles.monthTagText,
                      isSelected
                        ? { color: '#FFFFFF' }
                        : { color: m.isCurrent ? '#B45309' : '#16A34A' },
                    ]}
                  >
                    {m.tag}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Control Bar */}
      <View style={[styles.controlRow, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
        <View style={styles.monthBadge}>
          <Icon name="calendar" size={16} color={palette.primary} />
          <Text style={[styles.monthText, { color: palette.textPrimary }]}>{activeMonth.label} Cycle</Text>
        </View>

        <TouchableOpacity
          style={[styles.recalcBtn, { backgroundColor: palette.primary }]}
          onPress={handleRecalculateAll}
          disabled={isCalculating}
        >
          {isCalculating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.recalcBtnContent}>
              <Icon name="refresh" size={14} color="#FFFFFF" />
              <Text style={styles.recalcText}>
                {activeMonth.isCurrent ? 'Recalculate All' : 'Re-verify Audit'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Featured Audit Card for selected user */}
      <View style={[styles.featuredAuditCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
        <View style={styles.featuredBadgeRow}>
          <View
            style={[
              styles.auditTag,
              { backgroundColor: activeMonth.isCurrent ? palette.badge : '#DCFCE7' },
            ]}
          >
            <Text
              style={[
                styles.auditTagText,
                { color: activeMonth.isCurrent ? palette.text : '#16A34A' },
              ]}
            >
              {activeMonth.isCurrent
                ? 'FEATURED AUDIT • OCTOBER 2026'
                : `HISTORICAL AUDIT • ${activeMonth.label.toUpperCase()} (${activeMonth.tag.toUpperCase()})`}
            </Text>
          </View>
          <Text style={[styles.empIdTag, { color: palette.textSecondary }]}>
            {selectedUser?.id}
          </Text>
        </View>

        <Text style={[styles.featuredEmpName, { color: palette.textPrimary }]}>
          {selectedUser?.name}
        </Text>
        <Text style={[styles.featuredEmpTitle, { color: palette.textSecondary }]}>
          {selectedUser?.title}{selectedUser?.department ? ` • ${selectedUser.department}` : ''}
        </Text>

        {/* Days Telemetry Strip */}
        <View style={styles.telemetryStrip}>
          <View style={styles.telemetryBlock}>
            <Text style={[styles.telemetryVal, { color: '#16A34A' }]}>
              {currentBreakdown.presentDays}d
            </Text>
            <Text style={styles.telemetrySub}>Present</Text>
          </View>
          <View style={styles.telemetryBlock}>
            <Text style={[styles.telemetryVal, { color: '#2563EB' }]}>
              {currentBreakdown.paidLeaveDays}d
            </Text>
            <Text style={styles.telemetrySub}>Paid Leave</Text>
          </View>
          <View style={styles.telemetryBlock}>
            <Text style={[styles.telemetryVal, { color: '#D97706' }]}>
              {currentBreakdown.unpaidLeaveDays}d
            </Text>
            <Text style={styles.telemetrySub}>Unpaid Lv</Text>
          </View>
          <View style={styles.telemetryBlock}>
            <Text style={[styles.telemetryVal, { color: '#DC2626' }]}>
              {currentBreakdown.unexcusedAbsentDays}d
            </Text>
            <Text style={styles.telemetrySub}>Absent</Text>
          </View>
        </View>

        {/* Itemized Calculations */}
        <View style={styles.calcRowsWrap}>
          <View style={styles.calcRow}>
            <Text style={[styles.calcLabel, { color: palette.textSecondary }]}>Base Monthly Salary:</Text>
            <Text style={[styles.calcValue, { color: palette.textPrimary }]}>
              {formatCurrency(currentBreakdown.baseSalary)}
            </Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={[styles.calcLabel, { color: '#DC2626' }]}>
              Itemized Deductions ({currentBreakdown.unexcusedAbsentDays}d absent + {currentBreakdown.unpaidLeaveDays}d unpaid):
            </Text>
            <Text style={[styles.calcValue, { color: '#DC2626' }]}>
              -{formatCurrency(currentBreakdown.totalDeductions)}
            </Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={[styles.calcLabel, { color: '#16A34A' }]}>
              Itemized Allowances (Transport + Internet):
            </Text>
            <Text style={[styles.calcValue, { color: '#16A34A' }]}>
              +{formatCurrency(currentBreakdown.totalAllowances)}
            </Text>
          </View>

          <View style={[styles.netTotalBox, { backgroundColor: palette.badge }]}>
            <Text style={[styles.netTotalLabel, { color: palette.text }]}>ESTIMATED NET PAYOUT:</Text>
            <Text style={[styles.netTotalValue, { color: palette.text }]}>
              {formatCurrency(currentBreakdown.netSalary)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActionsRow}>
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: palette.primary }]}
            onPress={() =>
              Alert.alert(
                'Export PDF',
                `Official Payslip PDF exported for ${selectedUser?.name} (${activeMonth.label}).`
              )
            }
          >
            <Icon name="document-text" size={14} color={palette.primary} />
            <Text style={[styles.outlineBtnText, { color: palette.primary }]}>Export PDF</Text>
          </TouchableOpacity>

          {activeMonth.isCurrent ? (
            <TouchableOpacity
              style={[styles.lockBtn, { backgroundColor: palette.primary }]}
              onPress={() => Alert.alert('Locked', `Salary estimate locked for approval.`)}
            >
              <Icon name="lock-closed" size={14} color="#FFFFFF" />
              <Text style={styles.lockBtnText}>Lock Approval</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.lockBtn, { backgroundColor: '#16A34A' }]}
              onPress={() =>
                Alert.alert(
                  'Disbursed Record',
                  `Payment of ${formatCurrency(
                    currentBreakdown.netSalary
                  )} was disbursed to ${selectedUser?.name} on ${activeMonth.label}.`
                )
              }
            >
              <Icon name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.lockBtnText}>Disbursed Record</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={[styles.queueHeading, { color: palette.textPrimary }]}>
        Team Queue (Tap to Audit Employee)
      </Text>
    </View>
  );

  // Syllabus Requirement: Total Payroll as ListFooterComponent
  const renderListFooter = () => (
    <View style={[styles.totalPayrollFooter, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.footerTitle, { color: palette.textPrimary }]}>
            Total Company {activeMonth.isCurrent ? 'Estimated' : 'Disbursed'} Payroll
          </Text>
          <Text style={[styles.footerSubtitle, { color: palette.textSecondary }]}>
            Cycle: {activeMonth.label} • 24 Headcount • {activeMonth.isCurrent ? 'Projected' : 'Disbursed'}
          </Text>
        </View>
        <Text style={[styles.footerAmount, { color: palette.primary }]}>
          {formatCurrency(totalCompanyPayroll)}
        </Text>
      </View>
    </View>
  );

  const teamMembers = users.filter((u) => u.role === 'EMPLOYEE' || u.role === 'MANAGER' || u.role === 'HR');

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedUserId;
    const payout = getEmployeeMonthPayout(item);
    return (
      <TouchableOpacity
        style={[
          styles.empQueueCard,
          { backgroundColor: palette.card, borderColor: palette.cardBorder },
          isSelected && { borderColor: palette.primary, borderWidth: 2 },
        ]}
        onPress={() => setSelectedUserId(item.id)}
      >
        <View style={styles.queueInfo}>
          <Text style={[styles.queueName, { color: palette.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.queueTitle, { color: palette.textSecondary }]}>
            {item.title}{item.department ? ` • ${item.department}` : ''}
          </Text>
        </View>
        <View style={styles.queueRight}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.queuePayout, { color: palette.primary }]}>
              {formatCurrency(payout)}
            </Text>
            <Text style={[styles.itemMonthStatus, { color: activeMonth.isCurrent ? '#B45309' : '#16A34A' }]}>
              {activeMonth.isCurrent ? 'Estimate' : 'Disbursed'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={16} color="#94A3B8" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Employee Salary Estimates & Audit"
        subtitle="Human Resources"
        showBack
        navigation={navigation}
      />

      {/* Syllabus Requirement: FlatList with ListHeaderComponent and ListFooterComponent */}
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 36,
  },
  headerContainer: {
    marginBottom: 8,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '700',
  },
  recalcBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  recalcBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recalcText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredAuditCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  auditTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  auditTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  empIdTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  featuredEmpName: {
    fontSize: 18,
    fontWeight: '800',
  },
  featuredEmpTitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  telemetryStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 14,
  },
  telemetryBlock: {
    alignItems: 'center',
  },
  telemetryVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  telemetrySub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  calcRowsWrap: {
    gap: 6,
    marginBottom: 14,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: 12,
    flex: 1,
  },
  calcValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  netTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  netTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  netTotalValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 9,
    gap: 6,
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  lockBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 9,
    gap: 6,
  },
  lockBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  queueHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
  },
  empQueueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  queueInfo: {
    flex: 1,
  },
  queueName: {
    fontSize: 13,
    fontWeight: '700',
  },
  queueTitle: {
    fontSize: 11,
    marginTop: 2,
  },
  queueRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  queuePayout: {
    fontSize: 12,
    fontWeight: '700',
  },
  totalPayrollFooter: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  footerAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  monthSelectorWrap: {
    marginBottom: 12,
  },
  monthSelectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  monthChipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  monthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 8,
  },
  monthChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  monthTagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  monthTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  itemMonthStatus: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
});

export default SalaryEstimatesScreen;
