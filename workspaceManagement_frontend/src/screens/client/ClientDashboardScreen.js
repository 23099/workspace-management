import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';

export const ClientDashboardScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('CLIENT');

  const { requirements } = useSelector((state) => state.requirements);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Client Executive Dashboard"
        subtitle="Zafar Corp"
        navigation={navigation}
        statusText="PARTNER TIER"
        statusColor="#92400E"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={styles.welcomeCard}>
          <Text style={[styles.welcomeTitle, { color: palette.textPrimary }]}>
            Welcome, Zafar Corp Team
          </Text>
          <Text style={[styles.welcomeSub, { color: palette.textSecondary }]}>
            Enterprise Partner Deliverable Tracker &amp; Progress Hub
          </Text>
        </View>

        {/* 2x2 Deliverable Counter Grid */}
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Contract Deliverables Status
        </Text>
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiVal, { color: '#92400E' }]}>1</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Submitted</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiVal, { color: '#1D4ED8' }]}>2</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>In Progress</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiVal, { color: '#D97706' }]}>1</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Attention Required</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.kpiVal, { color: '#16A34A' }]}>4</Text>
            <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>Completed</Text>
          </View>
        </View>

        {/* IMPORTANT SYLLABUS / FIGMA NOTE:
            Do NOT render the "+ Submit New Project Requirement" button or bottom tab.
            Clients only review progress; Engineering Management creates requirements. */}
        <View style={[styles.readOnlyNotice, { backgroundColor: palette.badge }]}>
          <Icon name="shield-checkmark" size={15} color={palette.text} />
          <Text style={[styles.readOnlyNoticeText, { color: palette.text }]}>
            Review-Only Mode: All project requirements are officially scoped and provisioned by Engineering Management.
          </Text>
        </View>

        {/* Recent Milestone Broadcasts */}
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>
          Recent Milestone Broadcasts
        </Text>
        <View style={styles.broadcastsList}>
          {requirements.map((req) => {
            const latestBroadcast = req.broadcasts?.[0];
            return (
              <TouchableOpacity
                key={req.id}
                style={[styles.broadcastCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
                onPress={() => navigation.navigate('Milestones')}
                activeOpacity={0.8}
              >
                <View style={styles.bcTopRow}>
                  <Text style={[styles.bcCode, { color: palette.primary }]}>{req.code}</Text>
                  <View style={[styles.bcProgressTag, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={styles.bcProgressTagText}>
                      {req.progressPercent}% Completed
                    </Text>
                  </View>
                </View>

                <Text style={[styles.bcTitle, { color: palette.textPrimary }]}>{req.title}</Text>
                <Text style={[styles.bcContent, { color: palette.textSecondary }]} numberOfLines={2}>
                  {latestBroadcast?.content || 'Milestones progress monitored by engineering managers.'}
                </Text>

                <View style={[styles.bcFooter, { borderTopColor: palette.divider }]}>
                  <Text style={[styles.bcAuthor, { color: palette.textSecondary }]}>
                    {latestBroadcast?.author || 'Bilal Ahmed (Engineering Manager)'}
                  </Text>
                  <Text style={[styles.viewDetailsText, { color: palette.primary }]}>
                    View Milestones →
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
    paddingBottom: 40,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  welcomeSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    width: '48%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '800',
  },
  kpiLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  readOnlyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },
  readOnlyNoticeText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  broadcastsList: {
    gap: 12,
  },
  broadcastCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    elevation: 1,
  },
  bcTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bcCode: {
    fontSize: 12,
    fontWeight: '800',
  },
  bcProgressTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bcProgressTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  bcTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bcContent: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  bcFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  bcAuthor: {
    fontSize: 11,
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ClientDashboardScreen;
