import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, updateUser } from '../../store/slices/usersSlice';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import AppInput from '../../components/common/AppInput';
import AvatarPickerModal from '../../components/common/AvatarPickerModal';
import Icon from '../../components/common/Icon';
import { AVATAR_DP_PRESETS, getAvatarSource, IMAGES } from '../../assets/images';
import { isValidEmail } from '../../utils/validation';

const SYSTEM_ROLES = [
  { id: 'EMPLOYEE', label: 'Employee', desc: 'Can submit leave, punch attendance, view salary & work tasks' },
  { id: 'MANAGER', label: 'Manager', desc: 'Approves team leave, manages dual-deadline tasks & client reqs' },
  { id: 'HR', label: 'HR Specialist', desc: 'Configures deduction rates, handles tickets & attendance overrides' },
  { id: 'ADMIN', label: 'Company Administrator', desc: 'Full account provisioning, policy setup & system drawer' },
  { id: 'CLIENT', label: 'Client Representative', desc: 'Tracks requirement milestones & sends broadcast clarifications' },
];

export const EmployeeFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('ADMIN');

  const userId = route?.params?.userId;
  const { users, departments } = useSelector((state) => state.users);

  const existingUser = userId ? users.find((u) => u.id === userId) : null;
  const isEditing = Boolean(existingUser);

  const [name, setName] = useState(existingUser?.name || '');
  const [email, setEmail] = useState(existingUser?.email || '');
  const [password, setPassword] = useState(existingUser?.password || 'password123');
  const [role, setRole] = useState(existingUser?.role || 'EMPLOYEE');
  const [selectedDeptId, setSelectedDeptId] = useState(
    existingUser?.departmentId || (departments[0]?.id || 'dept_eng')
  );
  const [selectedManagerId, setSelectedManagerId] = useState(
    existingUser?.managerId || 'MGR-022'
  );
  const [avatarKey, setAvatarKey] = useState(existingUser?.avatarKey || 'dpEmpAli');
  const [isActive, setIsActive] = useState(existingUser?.isActive !== false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Available managers list
  const managerOptions = users.filter((u) => u.role === 'MANAGER' || u.role === 'ADMIN');

  const handleSave = () => {
    setSubmitted(true);
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid work email address.');
      return;
    }

    const deptObj = departments.find((d) => d.id === selectedDeptId);
    const mgrObj = users.find((u) => u.id === selectedManagerId);

    const userPayload = {
      id: existingUser?.id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      departmentId: selectedDeptId,
      department: deptObj ? deptObj.name : 'Engineering',
      managerId: role === 'EMPLOYEE' ? selectedManagerId : null,
      reportsTo: role === 'EMPLOYEE' && mgrObj ? mgrObj.name : null,
      avatarKey,
      isActive,
      title: existingUser?.title || `${role} Specialist`,
    };

    if (isEditing) {
      dispatch(updateUser(userPayload));
      Alert.alert('Success', `User record for "${name}" updated successfully.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      dispatch(addUser(userPayload));
      Alert.alert('User Provisioned', `New user "${name}" created and provisioned.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const hasMissingManager = role === 'EMPLOYEE' && !selectedManagerId;

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title={isEditing ? 'Edit User & Role Assignment' : 'Provision New User'}
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Set Employee DP Section */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Set Employee DP (Profile Picture)
          </Text>
          <Text style={[styles.cardSubtitle, { color: palette.textSecondary }]}>
            Admin assigns the initial display picture
          </Text>

          <View style={styles.dpPreviewRow}>
            <Image
              source={getAvatarSource(avatarKey)}
              style={styles.dpLargePreview}
            />
            <View style={styles.dpActionsCol}>
              <TouchableOpacity
                style={[styles.changeDpBtn, { backgroundColor: palette.primary }]}
                onPress={() => setShowAvatarModal(true)}
              >
                <Icon name="camera" size={15} color="#FFFFFF" />
                <Text style={styles.changeDpBtnText}>Change Employee DP</Text>
              </TouchableOpacity>
              <Text style={[styles.dpHintText, { color: palette.textSecondary }]}>
                Select a preset or provide custom photo
              </Text>
            </View>
          </View>

          {/* Preset DP quick buttons */}
          <Text style={[styles.presetRowLabel, { color: palette.textPrimary }]}>
            Quick Role Presets:
          </Text>
          <View style={styles.presetsRow}>
            {AVATAR_DP_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetSmallChip,
                  { borderColor: palette.cardBorder },
                  avatarKey === preset.image && { borderColor: preset.accent, borderWidth: 2 },
                ]}
                onPress={() => setAvatarKey(preset.image)}
              >
                <Image source={preset.image} style={styles.presetSmallImage} />
                <Text style={[styles.presetSmallText, { color: palette.textPrimary }]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Credentials Form */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Account Credentials
          </Text>

          <AppInput
            label="Full Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ali Raza"
            error={submitted && !name.trim() ? '! Full name is required' : null}
          />

          <AppInput
            label="Work Email Address *"
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. ali.raza@acmetech.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={submitted && !isValidEmail(email) ? '! Valid email is required' : null}
          />

          <AppInput
            label="Demo / Initial Password *"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
        </View>

        {/* Assign System Access Role */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Assign System Access Role
          </Text>
          <Text style={[styles.cardSubtitle, { color: palette.textSecondary }]}>
            Role dictates navigation layout, drawer vs tabs and permissions
          </Text>

          <View style={styles.roleRadioGroup}>
            {SYSTEM_ROLES.map((r) => {
              const isSelected = role === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.roleRadioCard,
                    { backgroundColor: palette.card, borderColor: palette.cardBorder },
                    isSelected && { borderColor: palette.primary, backgroundColor: palette.inputBackground },
                  ]}
                  onPress={() => setRole(r.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.radioTop}>
                    <View style={[styles.radioCircle, isSelected && { borderColor: palette.primary }]}>
                      {isSelected && <View style={[styles.radioDot, { backgroundColor: palette.primary }]} />}
                    </View>
                    <Text style={[styles.roleRadioLabel, { color: palette.textPrimary }]}>{r.label}</Text>
                  </View>
                  <Text style={[styles.roleRadioDesc, { color: palette.textSecondary }]}>{r.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Organizational Hierarchy */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Organizational Hierarchy
          </Text>

          <Text style={[styles.inputLabel, { color: palette.textPrimary }]}>Assigned Department</Text>
          <View style={styles.chipsWrap}>
            {departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              return (
                <TouchableOpacity
                  key={dept.id}
                  style={[
                    styles.deptSelectChip,
                    { borderColor: palette.cardBorder },
                    isSelected && { backgroundColor: palette.primary, borderColor: palette.primary },
                  ]}
                  onPress={() => setSelectedDeptId(dept.id)}
                >
                  <Text style={[styles.deptSelectText, isSelected ? { color: '#FFFFFF' } : { color: palette.textPrimary }]}>
                    {dept.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {role === 'EMPLOYEE' && (
            <View style={{ marginTop: 14 }}>
              <Text style={[styles.inputLabel, { color: palette.textPrimary }]}>
                Assigned Reporting Manager
              </Text>
              <View style={styles.chipsWrap}>
                {managerOptions.map((mgr) => {
                  const isSelected = selectedManagerId === mgr.id;
                  return (
                    <TouchableOpacity
                      key={mgr.id}
                      style={[
                        styles.deptSelectChip,
                        { borderColor: palette.cardBorder },
                        isSelected && { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
                      ]}
                      onPress={() => setSelectedManagerId(mgr.id)}
                    >
                      <Text style={[styles.deptSelectText, isSelected ? { color: '#FFFFFF' } : { color: palette.textPrimary }]}>
                        {mgr.name} ({mgr.role})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Syllabus Requirement: Inline warning banner */}
              {hasMissingManager && (
                <Text style={styles.hierarchyWarning}>
                  ! Employees must have an assigned Manager for leave approval
                </Text>
              )}
            </View>
          )}

          {/* Account Active Toggle */}
          <View style={[styles.activeToggleRow, { borderTopColor: palette.divider }]}>
            <View>
              <Text style={[styles.activeToggleTitle, { color: palette.textPrimary }]}>
                Account Active Status
              </Text>
              <Text style={[styles.activeToggleSub, { color: palette.textSecondary }]}>
                Deactivated accounts cannot authenticate
              </Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={isActive ? '#16A34A' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Save User Record Button */}
        <TouchableOpacity
          style={[styles.saveRecordBtn, { backgroundColor: palette.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveRecordBtnText}>Save User Record</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelectAvatar={(key) => setAvatarKey(key)}
        currentAvatar={avatarKey}
        title="Set Employee DP"
      />
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
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  dpPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  dpLargePreview: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  dpActionsCol: {
    flex: 1,
  },
  changeDpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    marginBottom: 4,
  },
  changeDpBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dpHintText: {
    fontSize: 11,
  },
  presetRowLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetSmallChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  presetSmallImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  presetSmallText: {
    fontSize: 11,
    fontWeight: '600',
  },
  roleRadioGroup: {
    gap: 8,
  },
  roleRadioCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  radioTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleRadioLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  roleRadioDesc: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 26,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deptSelectChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  deptSelectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hierarchyWarning: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  activeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 16,
  },
  activeToggleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeToggleSub: {
    fontSize: 11,
    marginTop: 2,
  },
  saveRecordBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveRecordBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default EmployeeFormScreen;
