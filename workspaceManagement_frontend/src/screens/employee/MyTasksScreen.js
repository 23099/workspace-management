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
import { updateTaskStatus } from '../../store/slices/tasksSlice';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';

const TASK_TABS = [
  { id: 'ALL', label: 'All' },
  { id: 'TO_DO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'COMPLETED', label: 'Completed' },
];

const TASK_STATES = ['TO_DO', 'IN_PROGRESS', 'COMPLETED'];

export const MyTasksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('EMPLOYEE');

  const { tasks } = useSelector((state) => state.tasks);
  const [selectedTab, setSelectedTab] = useState('ALL');

  // Filter tasks to this employee
  const myTasks = tasks.filter(
    (t) => t.assignedToId === currentUser?.id || t.assignedToId === 'EMP-089'
  );

  const activeTask = myTasks.find((t) => t.id === 'TSK-408') || myTasks[0];

  // State updates for active task
  const [taskState, setTaskState] = useState(activeTask?.status || 'IN_PROGRESS');
  const [progressNote, setProgressNote] = useState('');
  const [progressPercent, setProgressPercent] = useState(String(activeTask?.progressPercent || 65));

  const filteredTasks = myTasks.filter(
    (t) => selectedTab === 'ALL' || t.status === selectedTab
  );

  const handleSaveProgress = (task) => {
    if (!progressNote.trim()) {
      Alert.alert('Validation Error', 'Please enter a progress note describing what was accomplished.');
      return;
    }

    const pct = parseInt(progressPercent, 10) || task.progressPercent || 70;

    dispatch(
      updateTaskStatus({
        taskId: task.id,
        status: taskState,
        progressPercent: Math.min(100, Math.max(0, pct)),
        note: progressNote.trim(),
      })
    );

    setProgressNote('');
    Alert.alert(
      'Progress Saved',
      `Task ${task.code} updated to ${taskState} (${pct}%). Manager notified.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="My Sprint Tasks & Deliverables"
        subtitle="Software Engineering"
        showBack
        navigation={navigation}
      />

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {TASK_TABS.map((tab) => {
          const isSelected = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                isSelected
                  ? { backgroundColor: palette.primary, borderColor: palette.primary }
                  : { backgroundColor: palette.card, borderColor: palette.cardBorder },
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected ? { color: '#FFFFFF' } : { color: palette.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Featured Task Card (TSK-408) */}
        {activeTask && (
          <View style={[styles.featuredCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <View style={styles.featuredHeader}>
              <View style={styles.codeRow}>
                <Text style={[styles.codeText, { color: palette.primary }]}>{activeTask.code}</Text>
                <View style={[styles.prioTag, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={styles.prioTagText}>{activeTask.priority} PRIORITY</Text>
                </View>
              </View>

              <View style={[styles.stateTag, { backgroundColor: palette.badge }]}>
                <Text style={[styles.stateTagText, { color: palette.primary }]}>{activeTask.status}</Text>
              </View>
            </View>

            <Text style={[styles.taskTitle, { color: palette.textPrimary }]}>{activeTask.title}</Text>
            <Text style={[styles.taskDesc, { color: palette.textSecondary }]}>{activeTask.description}</Text>

            {/* Note: ONLY Internal Employee Deadline is displayed! External client deadline is strictly hidden */}
            <View style={styles.deadlineBadge}>
              <Icon name="calendar" size={14} color="#4338CA" />
              <Text style={styles.deadlineBadgeText}>
                Internal Employee Deadline: {activeTask.internalDeadline} (Verified by Bilal Ahmed)
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: palette.textSecondary }]}>
                Completion: {activeTask.progressPercent}%
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${activeTask.progressPercent}%`, backgroundColor: palette.primary }]} />
              </View>
            </View>

            {/* Update State & Note Form */}
            <View style={[styles.updateFormBox, { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder }]}>
              <Text style={[styles.updateFormTitle, { color: palette.textPrimary }]}>
                Update Sprint Progress
              </Text>

              {/* State Selector */}
              <View style={styles.stateSelectorRow}>
                {TASK_STATES.map((st) => {
                  const isSelected = taskState === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.stateBtn,
                        isSelected && { backgroundColor: palette.primary },
                      ]}
                      onPress={() => setTaskState(st)}
                    >
                      <Text
                        style={[
                          styles.stateBtnText,
                          isSelected ? { color: '#FFFFFF' } : { color: palette.textSecondary },
                        ]}
                      >
                        {st.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                value={progressNote}
                onChangeText={setProgressNote}
                placeholder="Log engineer progress notes for sprint review..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
                style={[styles.noteInput, { backgroundColor: palette.surface, borderColor: palette.inputBorder, color: palette.textPrimary }]}
              />

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: palette.primary }]}
                onPress={() => handleSaveProgress(activeTask)}
                activeOpacity={0.85}
              >
                <Icon name="checkmark" size={15} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>✓ Save Progress Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Other Tasks in Queue */}
        <Text style={[styles.sectionHeading, { color: palette.textPrimary }]}>
          Sprint Task Backlog ({filteredTasks.length})
        </Text>
        {filteredTasks.map((t) => (
          <View
            key={t.id}
            style={[styles.taskItemCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.itemCode, { color: palette.primary }]}>{t.code}</Text>
              <Text style={[styles.itemStatus, { color: palette.textSecondary }]}>{t.status}</Text>
            </View>
            <Text style={[styles.itemTitle, { color: palette.textPrimary }]}>{t.title}</Text>
            <Text style={[styles.itemDeadline, { color: palette.textSecondary }]}>
              Target: {t.internalDeadline} • {t.progressPercent}%
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  featuredCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  prioTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prioTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  stateTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stateTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    padding: 8,
    gap: 6,
    marginBottom: 10,
  },
  deadlineBadgeText: {
    fontSize: 11,
    color: '#4338CA',
    fontWeight: '700',
  },
  progressRow: {
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  updateFormBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  updateFormTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  stateSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  stateBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  stateBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 12,
    minHeight: 50,
    marginBottom: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  taskItemCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 11,
    fontWeight: '800',
  },
  itemStatus: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemDeadline: {
    fontSize: 11,
    marginTop: 2,
  },
});

export default MyTasksScreen;
