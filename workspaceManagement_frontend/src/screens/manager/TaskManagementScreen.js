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
import { createTask } from '../../store/slices/tasksSlice';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import AppInput from '../../components/common/AppInput';
import Icon from '../../components/common/Icon';

const STATUS_TABS = [
  { id: 'ALL', label: 'All' },
  { id: 'TO_DO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'COMPLETED', label: 'Completed' },
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const TaskManagementScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('MANAGER');

  const { tasks } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { requirements } = useSelector((state) => state.requirements);

  const [activeTab, setActiveTab] = useState('ALL');

  // Form State for creating task
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedToId, setAssignedToId] = useState('EMP-089'); // Ali Raza
  const [priority, setPriority] = useState('HIGH');
  const [requirementId, setRequirementId] = useState('REQ-101');
  const [internalDeadline, setInternalDeadline] = useState('2026-10-22');
  const [clientDeadline, setClientDeadline] = useState('2026-10-25');
  const [hasFormError, setHasFormError] = useState(false);

  const engineers = users.filter((u) => u.role === 'EMPLOYEE');

  // Live conflict warning calculation
  const intDate = new Date(internalDeadline);
  const cliDate = new Date(clientDeadline);
  const diffDays = Math.round((cliDate.getTime() - intDate.getTime()) / (1000 * 60 * 60 * 24));
  const isConflict = diffDays < 0;

  const filteredTasks = tasks.filter((t) => activeTab === 'ALL' || t.status === activeTab);

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      setHasFormError(true);
      return;
    }

    const assignedUser = engineers.find((e) => e.id === assignedToId);

    dispatch(
      createTask({
        title: taskTitle.trim(),
        assignedToId,
        assignedToName: assignedUser ? assignedUser.name : 'Ali Raza',
        requirementId,
        priority,
        internalDeadline,
        clientDeadline,
      })
    );

    setTaskTitle('');
    setHasFormError(false);
    Alert.alert(
      'Task Assigned',
      `Task "${taskTitle}" assigned to ${assignedUser ? assignedUser.name : 'Engineer'}.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Team Task Board & Dual Deadlines"
        subtitle="Engineering Management"
        showBack
        navigation={navigation}
      />

      {/* Status Tabs */}
      <View style={styles.tabsRow}>
        {STATUS_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                isSelected
                  ? { backgroundColor: palette.primary, borderColor: palette.primary }
                  : { backgroundColor: palette.card, borderColor: palette.cardBorder },
              ]}
              onPress={() => setActiveTab(tab.id)}
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
        {/* Task Cards List */}
        {filteredTasks.map((task) => {
          const hasConflict = task.hasConflict || task.bufferDays < 0;
          return (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                { backgroundColor: palette.card, borderColor: palette.cardBorder },
                hasConflict && styles.conflictBorder,
              ]}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              activeOpacity={0.8}
            >
              <View style={styles.taskCardHeader}>
                <View style={styles.codeRow}>
                  <Text style={[styles.taskCode, { color: palette.primary }]}>{task.code}</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      task.priority === 'CRITICAL'
                        ? styles.prioCrit
                        : task.priority === 'HIGH'
                        ? styles.prioHigh
                        : styles.prioMed,
                    ]}
                  >
                    <Text style={styles.prioText}>{task.priority}</Text>
                  </View>
                </View>

                {/* Conflict Banner vs Safety Buffer */}
                {hasConflict ? (
                  <View style={styles.conflictPill}>
                    <Icon name="alert-triangle" size={12} color="#DC2626" />
                    <Text style={styles.conflictPillText}>
                      ⚠️ DEADLINE CONFLICT (+{Math.abs(task.bufferDays)} Days Over Client Due)
                    </Text>
                  </View>
                ) : (
                  <View style={styles.safePill}>
                    <Icon name="checkmark-circle" size={12} color="#16A34A" />
                    <Text style={styles.safePillText}>
                      ✓ On Track ({task.bufferDays} Days Safety Buffer)
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.taskTitle, { color: palette.textPrimary }]}>{task.title}</Text>
              <Text style={[styles.taskDesc, { color: palette.textSecondary }]} numberOfLines={2}>
                {task.description}
              </Text>

              <View style={styles.deadlinesComparisonRow}>
                <View style={styles.deadlineBlock}>
                  <Text style={styles.dlLabel}>Internal Employee Due:</Text>
                  <Text style={[styles.dlVal, { color: hasConflict ? '#DC2626' : palette.textPrimary }]}>
                    {task.internalDeadline}
                  </Text>
                </View>

                <View style={styles.dlDivider} />

                <View style={styles.deadlineBlock}>
                  <Text style={styles.dlLabel}>External Client Due:</Text>
                  <Text style={[styles.dlVal, { color: palette.textPrimary }]}>
                    {task.clientDeadline}
                  </Text>
                </View>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: palette.divider }]}>
                <Text style={[styles.assigneeText, { color: palette.textSecondary }]}>
                  👤 Assigned: {task.assignedToName}
                </Text>
                <Text style={[styles.progressText, { color: palette.primary }]}>
                  {task.status.replace('_', ' ')} • {task.progressPercent}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Create & Assign New Task Form Card */}
        <View style={[styles.createCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.createTitle, { color: palette.textPrimary }]}>
            Create &amp; Assign New Task (Dual-Deadline Engine)
          </Text>
          <Text style={[styles.createSubtitle, { color: palette.textSecondary }]}>
            System compares Internal vs External Client due dates to detect schedule risks
          </Text>

          <AppInput
            label="Task Title *"
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholder="e.g. Implement WebSocket Reconnection Strategy"
            error={hasFormError && !taskTitle.trim() ? '! Task title is required' : null}
          />

          {/* Assign To Engineer */}
          <Text style={[styles.formLabel, { color: palette.textPrimary }]}>Assign To Engineer</Text>
          <View style={styles.chipsWrap}>
            {engineers.map((eng) => (
              <TouchableOpacity
                key={eng.id}
                style={[
                  styles.selectChip,
                  { borderColor: palette.cardBorder },
                  assignedToId === eng.id && { backgroundColor: palette.primary, borderColor: palette.primary },
                ]}
                onPress={() => setAssignedToId(eng.id)}
              >
                <Text
                  style={[
                    styles.selectChipText,
                    assignedToId === eng.id ? { color: '#FFFFFF' } : { color: palette.textPrimary },
                  ]}
                >
                  {eng.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority Selection */}
          <Text style={[styles.formLabel, { color: palette.textPrimary, marginTop: 10 }]}>Priority</Text>
          <View style={styles.chipsWrap}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.selectChip,
                  { borderColor: palette.cardBorder },
                  priority === p && { backgroundColor: palette.primary, borderColor: palette.primary },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.selectChipText,
                    priority === p ? { color: '#FFFFFF' } : { color: palette.textPrimary },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dates Row */}
          <View style={styles.datesRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <AppInput
                label="Internal Due"
                value={internalDeadline}
                onChangeText={setInternalDeadline}
                placeholder="2026-10-22"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Client Due"
                value={clientDeadline}
                onChangeText={setClientDeadline}
                placeholder="2026-10-25"
              />
            </View>
          </View>

          {/* Live Conflict Warning Box */}
          {isConflict ? (
            <View style={styles.liveWarningBox}>
              <Icon name="alert-triangle" size={16} color="#DC2626" />
              <Text style={styles.liveWarningText}>
                ⚠️ DEADLINE CONFLICT: Internal date exceeds Client deadline by {Math.abs(diffDays)} days!
              </Text>
            </View>
          ) : (
            <View style={styles.liveSafeBox}>
              <Icon name="checkmark-circle" size={16} color="#16A34A" />
              <Text style={styles.liveSafeText}>
                ✓ Schedule Safe: {diffDays} days buffer before client delivery.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.assignTaskBtn, { backgroundColor: palette.primary }]}
            onPress={handleCreateTask}
            activeOpacity={0.85}
          >
            <Text style={styles.assignTaskBtnText}>Assign Task to Engineer</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  taskCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  conflictBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  taskCardHeader: {
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
  taskCode: {
    fontSize: 12,
    fontWeight: '800',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prioCrit: { backgroundColor: '#FEE2E2' },
  prioHigh: { backgroundColor: '#FEF3C7' },
  prioMed: { backgroundColor: '#DBEAFE' },
  prioText: {
    fontSize: 9,
    fontWeight: '800',
  },
  conflictPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  conflictPillText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
  },
  safePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  safePillText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  deadlinesComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  deadlineBlock: {
    flex: 1,
  },
  dlLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  dlVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  dlDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  assigneeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
  },
  createCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
  },
  createTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  createSubtitle: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  datesRow: {
    flexDirection: 'row',
  },
  liveWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: 14,
  },
  liveWarningText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  liveSafeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: 14,
  },
  liveSafeText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  assignTaskBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  assignTaskBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default TaskManagementScreen;
