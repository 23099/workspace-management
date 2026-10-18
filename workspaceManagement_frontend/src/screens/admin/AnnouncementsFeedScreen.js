import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';
import networkService from '../../services/networkService';

export const AnnouncementsFeedScreen = ({ navigation }) => {
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('ADMIN');

  const { announcements } = useSelector((state) => state.announcements);

  const [telemetry, setTelemetry] = useState(null);
  const [complianceTip, setComplianceTip] = useState(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveNetworkData = useCallback(async () => {
    try {
      const [telemetryRes, tipRes] = await Promise.all([
        networkService.fetchLiveTelemetry(),
        networkService.fetchComplianceTip(),
      ]);
      setTelemetry(telemetryRes);
      setComplianceTip(tipRes);
    } catch (e) {
      console.warn('Network sync error:', e);
    } finally {
      setLoadingTelemetry(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveNetworkData();
  }, [fetchLiveNetworkData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveNetworkData();
  };

  // Group announcements by Priority for SectionList
  const sections = useMemo(() => {
    const high = announcements.filter((a) => a.isHighPriority);
    const regular = announcements.filter((a) => !a.isHighPriority);

    const result = [];
    if (high.length > 0) {
      result.push({
        title: `🚨 HIGH PRIORITY NOTICES (${high.length})`,
        data: high,
      });
    }
    if (regular.length > 0) {
      result.push({
        title: `COMPANY ANNOUNCEMENTS (${regular.length})`,
        data: regular,
      });
    }
    return result;
  }, [announcements]);

  const renderItem = ({ item }) => (
    <View style={[styles.announcementCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category || 'General'}</Text>
        </View>
        <Text style={[styles.dateText, { color: palette.textSecondary }]}>{item.date}</Text>
      </View>

      <Text style={[styles.itemTitle, { color: palette.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.itemContent, { color: palette.textSecondary }]}>{item.content}</Text>

      <View style={[styles.authorRow, { borderTopColor: palette.divider }]}>
        <Icon name="person" size={13} color="#64748B" />
        <Text style={[styles.authorText, { color: palette.textSecondary }]}>Posted by: {item.author}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Company Announcements"
        showBack
        navigation={navigation}
      />

      {/* Syllabus Requirement: REST API integration using fetch() with async/await */}
      <View style={[styles.liveSyncCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
        <View style={styles.liveSyncHeader}>
          <View style={styles.liveDotRow}>
            <View style={[styles.livePulseDot, { backgroundColor: telemetry?.isOnline ? '#10B981' : '#F59E0B' }]} />
            <Text style={[styles.liveSyncTitle, { color: palette.textPrimary }]}>
              {telemetry?.isOnline ? 'Cloud Telemetry Synced' : 'Local Offline Mode Active'}
            </Text>
          </View>
          {loadingTelemetry ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <Text style={styles.latencyText}>
              {telemetry?.latencyMs ? `${telemetry.latencyMs}ms latency` : 'Local GPS Safe'}
            </Text>
          )}
        </View>

        {complianceTip && (
          <View style={styles.tipBox}>
            <Icon name="shield-checkmark" size={14} color="#0F766E" />
            <Text style={styles.tipText}>
              &quot;{complianceTip.tip}&quot; — {complianceTip.author}
            </Text>
          </View>
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeaderWrap, { backgroundColor: palette.background }]}>
            <Text style={[styles.sectionHeaderText, { color: palette.primary }]}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={palette.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  liveSyncCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  liveSyncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveSyncTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  latencyText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  tipText: {
    fontSize: 11,
    color: '#134E4A',
    flex: 1,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeaderWrap: {
    paddingVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  announcementCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#4338CA',
    fontSize: 10,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  itemContent: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  authorText: {
    fontSize: 11,
  },
});

export default AnnouncementsFeedScreen;
