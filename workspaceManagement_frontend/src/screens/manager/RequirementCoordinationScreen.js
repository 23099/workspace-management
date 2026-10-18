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
import {
  addRequirement,
  toggleMilestone,
  addMilestone,
  publishBroadcast,
  updateLifecycleState,
} from '../../store/slices/requirementsSlice';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import AppInput from '../../components/common/AppInput';
import Icon from '../../components/common/Icon';
import DatePickerModal from '../../components/common/DatePickerModal';

const LIFECYCLE_STATES = ['IN_PROGRESS', 'AWAITING_CLIENT', 'COMPLETED'];

export const RequirementCoordinationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('MANAGER');

  const { requirements } = useSelector((state) => state.requirements);
  const [selectedReqId, setSelectedReqId] = useState(null);
  const activeReq = requirements.find((r) => r.id === selectedReqId) || requirements[0] || null;

  // Collapsible Form for creating requirement
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [newOrg, setNewOrg] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Milestone input
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Broadcast text and target
  const [broadcastTargetReqId, setBroadcastTargetReqId] = useState(null);
  const [broadcastText, setBroadcastText] = useState('');

  const targetReq = requirements.find((r) => r.id === broadcastTargetReqId) || activeReq;

  const handleCreateRequirement = () => {
    if (!newTitle.trim()) {
      Alert.alert('Validation Error', 'Requirement title is required.');
      return;
    }
    if (!newOrg.trim()) {
      Alert.alert('Validation Error', 'Client organization is required.');
      return;
    }
    dispatch(
      addRequirement({
        title: newTitle.trim(),
        organization: newOrg.trim(),
        contractDeadline: newDeadline,
      })
    );
    setNewTitle('');
    setShowCreateForm(false);
    Alert.alert('Requirement Created', `New client requirement initialized for ${newOrg.trim()}.`);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim() || !activeReq?.id) return;
    dispatch(addMilestone({ reqId: activeReq.id, title: newMilestoneText.trim() }));
    setNewMilestoneText('');
  };

  const handlePublishBroadcast = () => {
    if (!broadcastText.trim() || !targetReq?.id) return;
    dispatch(
      publishBroadcast({
        reqId: targetReq.id,
        author: currentUser?.name
          ? `${currentUser.name} (Engineering Manager)`
          : 'Engineering Management',
        content: broadcastText.trim(),
      })
    );
    setBroadcastText('');
    Alert.alert(
      'Broadcast Published',
      `Update is now published for ${targetReq.organization} (${targetReq.code}) on their executive dashboard.`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Client Requirement Coordination"
        subtitle="Engineering Management"
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {requirements.length > 0 && (
          <View style={styles.selectorCard}>
            <Text style={[styles.selectorLabel, { color: palette.textSecondary }]}>
              Active Requirement & Client Scope:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reqPillsRow}>
              {requirements.map((req) => {
                const isSelected = req.id === activeReq?.id;
                return (
                  <TouchableOpacity
                    key={req.id}
                    style={[
                      styles.reqPill,
                      { borderColor: palette.cardBorder, backgroundColor: palette.card },
                      isSelected && { borderColor: palette.primary, backgroundColor: palette.badge },
                    ]}
                    onPress={() => setSelectedReqId(req.id)}
                  >
                    <Text style={[styles.reqPillCode, { color: isSelected ? palette.primary : palette.textPrimary }]}>
                      {req.code}
                    </Text>
                    <Text style={[styles.reqPillOrg, { color: palette.textSecondary }]}>
                      {req.organization}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Collapsible "+ Create New Client Requirement" Form */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <TouchableOpacity
            style={styles.collapseHeader}
            onPress={() => setShowCreateForm(!showCreateForm)}
          >
            <View style={styles.collapseTitleRow}>
              <Icon name="add-circle" size={18} color={palette.primary} />
              <Text style={[styles.collapseTitle, { color: palette.primary }]}>
                + Create New Client Requirement
              </Text>
            </View>
            <Icon
              name={showCreateForm ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>

          {showCreateForm && (
            <View style={styles.createFormBody}>
              <Text style={[styles.createHelp, { color: palette.textSecondary }]}>
                Only Engineering Managers &amp; Admins can author contract requirements. Clients have review-only access.
              </Text>

              <AppInput
                label="Requirement Title *"
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Acme Multi-Tenant Auth & Billing"
              />

              {/* Client Organization (free text — real client name) */}
              <AppInput
                label="Client Organization *"
                value={newOrg}
                onChangeText={setNewOrg}
                placeholder="e.g. Acme Corporation"
              />

              {/* Contract Deadline with Calendar Picker */}
              <Text style={[styles.fieldLabel, { color: palette.textPrimary, marginTop: 10 }]}>
                Contractual Client Deadline
              </Text>
              <TouchableOpacity
                style={[styles.datePickerBtn, { backgroundColor: palette.background, borderColor: palette.inputBorder }]}
                onPress={() => setCalendarVisible(true)}
              >
                <Icon name="calendar" size={16} color={palette.primary} />
                <Text style={[styles.datePickerBtnText, { color: palette.textPrimary }]}>{newDeadline}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitCreateBtn, { backgroundColor: palette.primary }]}
                onPress={handleCreateRequirement}
              >
                <Text style={styles.submitCreateText}>Save &amp; Scope Requirement</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* DatePickerModal for contract deadline */}
        <DatePickerModal
          visible={calendarVisible}
          onClose={() => setCalendarVisible(false)}
          initialDate={newDeadline}
          title="Select Contractual Client Deadline"
          onSelectDate={(newDate) => setNewDeadline(newDate)}
        />
        
        {activeReq ? (
          <>
            {/* Active Requirement Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.reqTopRow}>
            <View>
              <Text style={[styles.reqCode, { color: palette.primary }]}>{activeReq.code}</Text>
              <Text style={[styles.reqTitle, { color: palette.textPrimary }]}>{activeReq.title}</Text>
              <Text style={[styles.orgText, { color: palette.textSecondary }]}>
                Client: {activeReq.organization} ({activeReq.clientRepresentative})
              </Text>
            </View>
          </View>

          {/* Lifecycle State Picker */}
          <Text style={[styles.fieldLabel, { color: palette.textPrimary, marginTop: 12 }]}>
            Lifecycle State
          </Text>
          <View style={styles.stateRow}>
            {LIFECYCLE_STATES.map((st) => {
              const isSelected = activeReq.lifecycleState === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.stateChip,
                    { borderColor: palette.cardBorder },
                    isSelected && { backgroundColor: palette.primary, borderColor: palette.primary },
                  ]}
                  onPress={() =>
                    dispatch(
                      updateLifecycleState({ reqId: activeReq.id, lifecycleState: st })
                    )
                  }
                >
                  <Text
                    style={[
                      styles.stateChipText,
                      isSelected ? { color: '#FFFFFF' } : { color: palette.textSecondary },
                    ]}
                  >
                    {st.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Client Deliverable Milestones Checklist */}
          <View style={styles.milestoneHeaderRow}>
            <Text style={[styles.cardSubTitle, { color: palette.textPrimary }]}>
              Client Deliverable Milestones ({activeReq.completedMilestones}/{activeReq.totalMilestones} Completed • {activeReq.progressPercent}%)
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${activeReq.progressPercent}%`, backgroundColor: palette.primary }]} />
          </View>

          <View style={styles.milestoneList}>
            {(activeReq.milestones || []).map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.milestoneCheckRow, { borderColor: palette.divider }]}
                onPress={() => dispatch(toggleMilestone({ reqId: activeReq.id, milestoneId: m.id }))}
              >
                <View style={[styles.checkCircle, m.isCompleted && { backgroundColor: '#16A34A', borderColor: '#16A34A' }]}>
                  {m.isCompleted && <Icon name="checkmark" size={12} color="#FFFFFF" />}
                </View>
                <Text
                  style={[
                    styles.milestoneTitle,
                    { color: palette.textPrimary },
                    m.isCompleted && styles.completedStrike,
                  ]}
                >
                  {m.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* + Add New Milestone Input */}
          <View style={styles.addMilestoneRow}>
            <TextInput
              value={newMilestoneText}
              onChangeText={setNewMilestoneText}
              placeholder="+ Add new milestone deliverable..."
              placeholderTextColor="#94A3B8"
              style={[styles.milestoneInput, { backgroundColor: palette.inputBackground, borderColor: palette.inputBorder, color: palette.textPrimary }]}
            />
            <TouchableOpacity
              style={[styles.addMBtn, { backgroundColor: palette.primary }]}
              onPress={handleAddMilestone}
            >
              <Text style={styles.addMBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy Enforced Scope (Private Tasks Card) */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Privacy Enforced Scope (Internal Tasks Hidden from Client)
          </Text>
          <Text style={[styles.privacyDesc, { color: palette.textSecondary }]}>
            Clients only see overall milestones and official broadcasts. Internal task assignments, slack buffers and logs remain strictly confidential.
          </Text>
          <View style={styles.privateTaskChipsRow}>
            {(activeReq?.privateLinkedTasks || []).map((tid) => (
              <View key={tid} style={styles.privateTaskChip}>
                <Icon name="lock-closed" size={12} color="#DC2626" />
                <Text style={styles.privateTaskText}>🔒 {tid}</Text>
              </View>
            ))}
            {(!activeReq?.privateLinkedTasks || activeReq.privateLinkedTasks.length === 0) && (
              <Text style={[styles.privacyDesc, { color: palette.textSecondary }]}>
                No internal tasks linked to this requirement yet.
              </Text>
            )}
          </View>
        </View>

        {/* Publish Client-Visible Progress Update Broadcast */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Publish Client-Visible Progress Update
          </Text>
          <Text style={[styles.privacyDesc, { color: palette.textSecondary }]}>
            Select recipient client organization and broadcast official milestone commentary directly to their executive dashboard.
          </Text>

          {/* Client Recipient Selector */}
          <Text style={[styles.fieldLabel, { color: palette.textPrimary, marginTop: 8 }]}>
            Select Target Client Organization:
          </Text>
          <View style={styles.broadcastTargetChips}>
            {requirements.map((req) => {
              const isTarget = req.id === targetReq.id;
              return (
                <TouchableOpacity
                  key={req.id}
                  style={[
                    styles.targetChip,
                    { borderColor: palette.cardBorder, backgroundColor: palette.background },
                    isTarget && { borderColor: palette.primary, backgroundColor: palette.badge },
                  ]}
                  onPress={() => setBroadcastTargetReqId(req.id)}
                >
                  <Text style={[styles.targetChipTitle, { color: isTarget ? palette.primary : palette.textPrimary }]}>
                    {req.organization}
                  </Text>
                  <Text style={[styles.targetChipSub, { color: palette.textSecondary }]}>
                    {req.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            value={broadcastText}
            onChangeText={setBroadcastText}
            placeholder={`Draft progress broadcast for ${targetReq.organization}...`}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            style={[styles.broadcastInput, { backgroundColor: palette.inputBackground, borderColor: palette.inputBorder, color: palette.textPrimary }]}
          />

          <TouchableOpacity
            style={[styles.publishBtn, { backgroundColor: palette.primary }]}
            onPress={handlePublishBroadcast}
          >
            <Icon name="chatbubble-ellipses" size={15} color="#FFFFFF" />
            <Text style={styles.publishBtnText}>Publish Broadcast to {targetReq.organization}</Text>
          </TouchableOpacity>
        </View>
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>No client requirements yet</Text>
            <Text style={[styles.privacyDesc, { color: palette.textSecondary }]}>
              Create a client requirement to start linking tasks, tracking milestones and broadcasting updates.
            </Text>
          </View>
        )}
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
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapseTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  createFormBody: {
    marginTop: 14,
  },
  createHelp: {
    fontSize: 11,
    marginBottom: 12,
  },
  submitCreateBtn: {
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  submitCreateText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  reqTopRow: {
    marginBottom: 8,
  },
  reqCode: {
    fontSize: 12,
    fontWeight: '800',
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  orgText: {
    fontSize: 12,
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  stateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  stateChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  stateChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  milestoneHeaderRow: {
    marginBottom: 6,
  },
  cardSubTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  milestoneList: {
    gap: 8,
    marginBottom: 12,
  },
  milestoneCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneTitle: {
    fontSize: 13,
    flex: 1,
  },
  completedStrike: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  addMilestoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  milestoneInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
  },
  addMBtn: {
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addMBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  privacyDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  privateTaskChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  privateTaskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  privateTaskText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  broadcastInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    minHeight: 65,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 11,
    gap: 6,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  selectorCard: {
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  reqPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reqPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  reqPillCode: {
    fontSize: 12,
    fontWeight: '800',
  },
  reqPillOrg: {
    fontSize: 10,
    marginTop: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  orgChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  orgChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  orgChipText: {
    fontSize: 11,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginBottom: 14,
  },
  datePickerBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  broadcastTargetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  targetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  targetChipTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  targetChipSub: {
    fontSize: 10,
  },
});

export default RequirementCoordinationScreen;
