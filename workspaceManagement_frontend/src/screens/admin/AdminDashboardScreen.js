import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';

const { width } = Dimensions.get('window');

export const AdminDashboardScreen = ({ navigation }) => {
  const { getRolePalette, isDark } = useTheme();
  const palette = getRolePalette('ADMIN');

  const company = useSelector((state) => state.company);
  const { users, departments } = useSelector((state) => state.users);

  // Compute live workforce snapshot counts with useMemo
  const snapshot = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive !== false).length;
    const deactivated = total - active;
    const deptsCount = departments.filter((d) => d.status !== 'ARCHIVED').length;
    return { total, active, deactivated, deptsCount };
  }, [users, departments]);

  const shortcuts = [
    {
      id: 'co_prof',
      title: 'Company Profile & Geofence Policy',
      subtitle: 'Perimeter coordinates, 200m radius & shift rules',
      icon: 'business',
      color: '#1E293B',
      target: 'CompanyProfile',
    },
    {
      id: 'dept_mgr',
      title: 'Department Management',
      subtitle: 'Class Component • Create, rename & archive teams',
      icon: 'grid',
      color: '#0F766E',
      target: 'DepartmentManagement',
    },
    {
      id: 'emp_dir',
      title: 'Employee Directory & Role Filter',
      subtitle: 'SectionList • Role filters, active toggles & edit user',
      icon: 'people',
      color: '#1D4ED8',
      target: 'EmployeeDirectory',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Admin Executive Dashboard"
        navigation={navigation}
        statusText="SYSTEM OK"
        statusColor="#10B981"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Organization Card */}
        <View style={[styles.orgCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.orgHeaderRow}>
            <View>
              <Text style={[styles.orgName, { color: palette.textPrimary }]}>{company.name}</Text>
              <Text style={[styles.orgId, { color: palette.textSecondary }]}>
                Enterprise ID: {company.enterpriseId}
              </Text>
            </View>
            <View style={styles.activeOrgPill}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.activeOrgText}>Active Org</Text>
            </View>
          </View>

          <View style={styles.orgDetailsRow}>
            <View style={styles.orgDetailItem}>
              <Icon name="location" size={15} color="#1E293B" />
              <Text style={[styles.orgDetailText, { color: palette.textPrimary }]}>
                {company.mainCampus}
              </Text>
            </View>
            <View style={styles.orgDetailItem}>
              <Icon name="shield-checkmark" size={15} color="#10B981" />
              <Text style={[styles.orgDetailText, { color: palette.textPrimary }]}>
                {company.geofenceRadiusMeters}m Geofence Active
              </Text>
            </View>
            <View style={styles.orgDetailItem}>
              <Icon name="calendar" size={15} color="#6366F1" />
              <Text style={[styles.orgDetailText, { color: palette.textPrimary }]}>Mon-Fri Shift</Text>
            </View>
          </View>

          <View style={[styles.telemetryFooter, { borderTopColor: palette.divider }]}>
            <Icon name="refresh" size={13} color="#64748B" />
            <Text style={styles.telemetryFooterText}>
              Real-time telemetry synced 2m ago • Lat {company.latitude}, Lon {company.longitude}
            </Text>
          </View>
        </View>

        {/* Workforce Snapshot 2x2 Grid (Dimensions API) */}
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Workforce Snapshot
        </Text>
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <View style={styles.kpiIconWrap}>
              <Icon name="people" size={18} color="#1E293B" />
            </View>
            <Text style={[styles.kpiValue, { color: palette.textPrimary }]}>{snapshot.total}</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Total Headcount</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="checkmark-circle" size={18} color="#16A34A" />
            </View>
            <Text style={[styles.kpiValue, { color: '#16A34A' }]}>{snapshot.active}</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Active Users</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="close-circle" size={18} color="#DC2626" />
            </View>
            <Text style={[styles.kpiValue, { color: '#DC2626' }]}>{snapshot.deactivated}</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Deactivated</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="grid" size={18} color="#4338CA" />
            </View>
            <Text style={[styles.kpiValue, { color: '#4338CA' }]}>{snapshot.deptsCount}</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Departments</Text>
          </View>
        </View>

        {/* Administrative Modules & Shortcuts */}
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Administrative Modules & Shortcuts
        </Text>
        <View style={styles.shortcutsList}>
          {shortcuts.map((sc) => (
            <TouchableOpacity
              key={sc.id}
              style={[styles.shortcutCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
              onPress={() => navigation.navigate(sc.target)}
              activeOpacity={0.75}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: sc.color }]}>
                <Icon name={sc.icon} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.shortcutContent}>
                <Text style={[styles.shortcutTitle, { color: palette.textPrimary }]}>
                  {sc.title}
                </Text>
                <Text style={[styles.shortcutSubtitle, { color: palette.textSecondary }]}>
                  {sc.subtitle}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Administrative Activity */}
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Recent Administrative Activity
        </Text>
        <View style={[styles.activityCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityInfo}>
              <Text style={[styles.activityAction, { color: palette.textPrimary }]}>
                Geofence Radius Verified (200m)
              </Text>
              <Text style={styles.activityTime}>Today • 08:30 AM • Usman Tariq</Text>
            </View>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
            <View style={styles.activityInfo}>
              <Text style={[styles.activityAction, { color: palette.textPrimary }]}>
                Salary Deduction Policy Confirmed (5k / 3.5k PKR)
              </Text>
              <Text style={styles.activityTime}>Oct 14 • 04:00 PM • Usman Tariq</Text>
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
    paddingBottom: 32,
  },
  orgCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  orgHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '800',
  },
  orgId: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  activeOrgPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 5,
  },
  activeOrgText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  orgDetailsRow: {
    gap: 8,
    marginBottom: 12,
  },
  orgDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orgDetailText: {
    fontSize: 13,
    fontWeight: '500',
  },
  telemetryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 6,
  },
  telemetryFooterText: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 22,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    elevation: 1,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  shortcutsList: {
    gap: 10,
    marginBottom: 22,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
  },
  shortcutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shortcutContent: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  shortcutSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  activityCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 13,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
    marginLeft: 18,
  },
});

export default AdminDashboardScreen;
