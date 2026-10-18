import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTaskLog, updateTaskStatus } from '../../store/slices/tasksSlice';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';

export const TaskDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('MANAGER');

  const taskId = route?.params?.taskId || 'TSK-408';
  const { tasks } = useSelector((state) => state.tasks);
  const task = tasks.find((t) => t.id === taskId) || tasks[0];

  const [managerNote, setManagerNote] = useState('');

  const intDate = new Date(task?.internalDeadline || '2026-10-22');
  const cliDate = new Date(task?.clientDeadline || '2026-10-25');
  const diffDays = Math.round((cliDate.getTime() - intDate.getTime()) / (1000 * 60 * 60 * 24));
  const hasConflict = diffDays < 0;

  const handlePostNote = () => {
    if (!managerNote.trim()) return;
    dispatch(
      addTaskLog({
        taskId: task.id,
        note: `Manager Note: ${managerNote.trim()}`,
      })
    );
    setManagerNote('');
    Alert.alert('Note Posted', 'Manager progress note attached to task timeline.');
  };

  const handleSyncMilestone = () => {
    dispatch(
      updateTaskStatus({
        taskId: task.id,
        status: 'COMPLETED',
        progressPercent: 100,
        note: 'Task marked ready for Client Milestone Sync by Engineering Manager.',
      })
    );
    Alert.alert(
      'Milestone Synced',
      `Task ${task.code} marked 100% complete and synchronized with Client Deliverables.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title={task?.code || '#TSK-408'}
        subtitle="Task Detail & Audit"
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Task Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.codeRow}>
            <Text style={[styles.taskCode, { color: palette.primary }]}>{task?.code}</Text>
            <View style={[styles.statusBadge, { backgroundColor: palette.badge }]}>
              <Text style={[styles.statusBadgeText, { color: palette.primary }]}>{task?.status}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: palette.textPrimary }]}>{task?.title}</Text>
          <Text style={[styles.desc, { color: palette.textSecondary }]}>{task?.description}</Text>

          <View style={styles.assigneeRow}>
            <Icon name="person" size={14} color="#64748B" />
            <Text style={[styles.assigneeText, { color: palette.textPrimary }]}>
              Assigned Engineer: {task?.assignedToName} ({task?.assignedToId})
            </Text>
          </View>
        </View>

        {/* 50% / 50% Schedule Risk Analysis */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            50% / 50% Dual-Deadline Schedule Risk Analysis
          </Text>

          <View style={styles.riskGrid}>
            <View style={[styles.riskBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={styles.riskBoxLabel}>INTERNAL EMPLOYEE DUE</Text>
              <Text style={[styles.riskBoxDate, { color: '#1D4ED8' }]}>{task?.internalDeadline}</Text>
              <Text style={styles.riskBoxSub}>Engineering Target</Text>
            </View>

            <View style={[styles.riskBox, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <Text style={[styles.riskBoxLabel, { color: '#92400E' }]}>EXTERNAL CLIENT DUE</Text>
              <Text style={[styles.riskBoxDate, { color: '#B45309' }]}>{task?.clientDeadline}</Text>
              <Text style={styles.riskBoxSub}>Client Contract SLA</Text>
            </View>
          </View>

          <View style={[styles.bufferResultBox, hasConflict ? styles.bufferConflict : styles.bufferSafe]}>
            <Icon
              name={hasConflict ? 'alert-triangle' : 'checkmark-circle'}
              size={18}
              color={hasConflict ? '#DC2626' : '#16A34A'}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bufferTitle, { color: hasConflict ? '#DC2626' : '#16A34A' }]}>
                {hasConflict ? 'CRITICAL SLACK DEFICIT' : 'SAFETY BUFFER VERIFIED'}
              </Text>
              <Text style={styles.bufferSub}>
                {hasConflict
                  ? `Task will finish ${Math.abs(diffDays)} days AFTER client contractual deadline!`
                  : `Engineering delivery has a ${diffDays}-day safety margin before external client delivery.`}
              </Text>
            </View>
          </View>
        </View>

        {/* Chronological Progress Log */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Chronological Progress Log
          </Text>

          <View style={styles.logList}>
            {(task?.logs || []).map((log, idx) => (
              <View key={idx} style={[styles.logItem, { borderColor: palette.divider }]}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logTime, { color: palette.textSecondary }]}>{log.time}</Text>
                </View>
                <Text style={[styles.logNote, { color: palette.textPrimary }]}>{log.note}</Text>
              </View>
            ))}
          </View>

          {/* Post Manager Note Input */}
          <Text style={[styles.noteInputLabel, { color: palette.textPrimary }]}>Post Manager Note</Text>
          <View style={styles.noteInputRow}>
            <TextInput
              value={managerNote}
              onChangeText={setManagerNote}
              placeholder="Add review feedback or instruction..."
              placeholderTextColor="#94A3B8"
              style={[
                styles.noteInput,
                { backgroundColor: palette.inputBackground, borderColor: palette.inputBorder, color: palette.textPrimary },
              ]}
            />
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: palette.primary }]}
              onPress={handlePostNote}
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Milestone Sync Action Button */}
        <TouchableOpacity
          style={[styles.syncBtn, { backgroundColor: palette.primary }]}
          onPress={handleSyncMilestone}
          activeOpacity={0.85}
        >
          <Icon name="checkmark-done" size={18} color="#FFFFFF" />
          <Text style={styles.syncBtnText}>Mark Ready for Client Milestone Sync</Text>
        </TouchableOpacity>
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
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskCode: {
    fontSize: 13,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assigneeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  riskGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  riskBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  riskBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  riskBoxDate: {
    fontSize: 14,
    fontWeight: '800',
  },
  riskBoxSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  bufferResultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  bufferConflict: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  bufferSafe: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  bufferTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  bufferSub: {
    fontSize: 11,
    color: '#334155',
    marginTop: 1,
  },
  logList: {
    gap: 10,
    marginBottom: 14,
  },
  logItem: {
    borderLeftWidth: 2,
    paddingLeft: 10,
    paddingVertical: 4,
  },
  logHeader: {
    marginBottom: 2,
  },
  logTime: {
    fontSize: 10,
    fontWeight: '600',
  },
  logNote: {
    fontSize: 12,
    lineHeight: 16,
  },
  noteInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  noteInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
  },
  postBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 6,
    marginBottom: 10,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default TaskDetailScreen;
