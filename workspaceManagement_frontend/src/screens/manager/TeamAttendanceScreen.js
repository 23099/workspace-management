import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';

const FILTER_PILLS = [
  { id: 'ALL', label: 'All', count: 10 },
  { id: 'PRESENT', label: 'Present', count: 8 },
  { id: 'LEAVE', label: 'On Leave', count: 2 },
  { id: 'ABSENT', label: 'Absent', count: 0 },
];

export const TeamAttendanceScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('MANAGER');

  const { users } = useSelector((state) => state.users);
  const { logs } = useSelector((state) => state.attendance);

  const [currentDate, setCurrentDate] = useState('Oct 15, 2026');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Filter strictly to direct reports where managerId matches or reports to Bilal
  const myTeam = useMemo(() => {
    return users.filter(
      (u) =>
        u.managerId === currentUser?.id ||
        u.managerId === 'MGR-022' ||
        u.reportsTo === 'Bilal Ahmed' ||
        (currentUser?.role === 'ADMIN' && u.role === 'EMPLOYEE')
    );
  }, [users, currentUser]);

  const sections = useMemo(() => {
    const presentTeam = myTeam.slice(0, 8);
    const onLeaveTeam = myTeam.slice(8, 10);

    const res = [];
    if (presentTeam.length > 0) {
      res.push({
        title: `CHECKED-IN & ACTIVE (${presentTeam.length})`,
        data: presentTeam.map((u, i) => ({
          id: u.id,
          name: u.name,
          title: u.title,
          checkIn: `09:0${i + 2} AM`,
          status: 'PRESENT',
          distance: `${12 + i * 2}.4m`,
        })),
        accent: '#16A34A',
      });
    }
    if (onLeaveTeam.length > 0) {
      res.push({
        title: `ON APPROVED LEAVE (${onLeaveTeam.length})`,
        data: onLeaveTeam.map((u) => ({
          id: u.id,
          name: u.name,
          title: u.title,
          checkIn: 'Approved Leave',
          status: 'ON_LEAVE',
          distance: 'Excused',
        })),
        accent: '#2563EB',
      });
    }
    return res;
  }, [myTeam]);

  const handleExportReport = () => {
    Alert.alert(
      'Export Daily Team Attendance Report',
      'Attendance summary CSV/PDF has been compiled for Bilal Ahmed engineering squad.',
      [{ text: 'OK' }]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
      <View style={styles.cardTop}>
        <View>
          <Text style={[styles.name, { color: palette.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.title, { color: palette.textSecondary }]}>{item.title}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            item.status === 'PRESENT' ? styles.pillGreen : styles.pillBlue,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'PRESENT' ? styles.textGreen : styles.textBlue,
            ]}
          >
            {item.status === 'PRESENT' ? 'PRESENT' : 'ON LEAVE'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.metaRow}>
          <Icon name="time" size={13} color="#64748B" />
          <Text style={[styles.metaText, { color: palette.textSecondary }]}>{item.checkIn}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="location" size={13} color="#64748B" />
          <Text style={[styles.metaText, { color: palette.textSecondary }]}>{item.distance}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Assigned Team Attendance"
        subtitle="Engineering Management"
        showBack
        navigation={navigation}
      />

      {/* Date Stepper */}
      <View style={[styles.dateBar, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
        <TouchableOpacity onPress={() => setCurrentDate('Oct 14, 2026')}>
          <Text style={styles.stepperArrow}>&lt;</Text>
        </TouchableOpacity>
        <View style={styles.dateRow}>
          <Icon name="calendar" size={16} color={palette.primary} />
          <Text style={[styles.dateText, { color: palette.textPrimary }]}>{currentDate}</Text>
        </View>
        <TouchableOpacity onPress={() => setCurrentDate('Oct 15, 2026')}>
          <Text style={styles.stepperArrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.todayTag, { backgroundColor: palette.primary }]}
          onPress={() => setCurrentDate('Oct 15, 2026')}
        >
          <Text style={styles.todayTagText}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterBar}>
        {FILTER_PILLS.map((pill) => {
          const isSelected = activeFilter === pill.id;
          return (
            <TouchableOpacity
              key={pill.id}
              style={[
                styles.filterPill,
                isSelected
                  ? { backgroundColor: palette.primary, borderColor: palette.primary }
                  : { backgroundColor: palette.card, borderColor: palette.cardBorder },
              ]}
              onPress={() => setActiveFilter(pill.id)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isSelected ? { color: '#FFFFFF' } : { color: palette.textSecondary },
                ]}
              >
                {pill.label} ({pill.count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title, accent } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: palette.background }]}>
            <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
      />

      {/* Bottom Export Button */}
      <View style={[styles.bottomBar, { backgroundColor: palette.surface, borderTopColor: palette.cardBorder }]}>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: palette.primary }]}
          onPress={handleExportReport}
          activeOpacity={0.85}
        >
          <Icon name="document-text" size={16} color="#FFFFFF" />
          <Text style={styles.exportBtnText}>
            Export Daily Team Attendance Report (PDF/CSV)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  stepperArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
    paddingHorizontal: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  todayTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  todayTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  sectionHeader: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 11,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillGreen: { backgroundColor: '#DCFCE7' },
  pillBlue: { backgroundColor: '#DBEAFE' },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textGreen: { color: '#16A34A' },
  textBlue: { color: '#1D4ED8' },
  cardBottom: {
    flexDirection: 'row',
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopWidth: 1,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default TeamAttendanceScreen;
