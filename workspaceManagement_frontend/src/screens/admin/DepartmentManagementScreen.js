import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { addDepartment, updateDepartment, archiveDepartment } from '../../store/slices/usersSlice';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';

// Syllabus Requirement: ES6 Class Component with constructor, this.state, this.setState
export class DepartmentManagementScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newDeptName: '',
      newDeptHead: 'Bilal Ahmed',
      newDeptSubtitle: '',
      hasSubmitted: false,
      editingDeptId: null,
      editingName: '',
    };
  }

  handleCreateDepartment = () => {
    this.setState({ hasSubmitted: true });
    const { newDeptName, newDeptHead, newDeptSubtitle } = this.state;
    if (!newDeptName.trim()) {
      return;
    }

    const newDept = {
      id: `dept_${Date.now()}`,
      name: newDeptName.trim(),
      head: newDeptHead,
      memberCount: 1,
      subtitle: newDeptSubtitle.trim() || 'General Operations & Delivery',
      status: 'ACTIVE',
    };

    this.props.addDepartment(newDept);
    this.setState({
      newDeptName: '',
      newDeptSubtitle: '',
      hasSubmitted: false,
    });
    Alert.alert('Department Added', `Department "${newDept.name}" has been created.`);
  };

  handleStartRename = (dept) => {
    this.setState({
      editingDeptId: dept.id,
      editingName: dept.name,
    });
  };

  handleSaveRename = (deptId) => {
    if (!this.state.editingName.trim()) {
      Alert.alert('Error', 'Department name cannot be empty.');
      return;
    }
    this.props.updateDepartment({
      id: deptId,
      name: this.state.editingName.trim(),
    });
    this.setState({ editingDeptId: null, editingName: '' });
  };

  handleArchive = (dept) => {
    Alert.alert(
      'Archive Department',
      `Are you sure you want to archive "${dept.name}"? Active members will remain in directory.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => this.props.archiveDepartment(dept.id),
        },
      ]
    );
  };

  render() {
    const { navigation, departments = [] } = this.props;
    const { newDeptName, newDeptSubtitle, hasSubmitted, editingDeptId, editingName } = this.state;
    const activeDepts = departments.filter((d) => d.status !== 'ARCHIVED');
    const isError = hasSubmitted && !newDeptName.trim();

    return (
      <View style={styles.container}>
        <HeaderBar
          title="Department Management"
          subtitle="Class Component"
          showBack
          navigation={navigation}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Create Department Card */}
          <View style={styles.createCard}>
            <Text style={styles.createTitle}>Quick Create Department</Text>
            <Text style={styles.createSubtitle}>
              Class Component form with constructor and this.setState
            </Text>

            <Text style={styles.inputLabel}>Department Name</Text>
            <TextInput
              value={newDeptName}
              onChangeText={(text) => this.setState({ newDeptName: text })}
              placeholder="e.g., Quality Assurance"
              placeholderTextColor="#94A3B8"
              style={[styles.input, isError && styles.inputError]}
            />
            {/* Conditional inline error */}
            {isError && (
              <Text style={styles.errorText}>! Department name is required</Text>
            )}

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Department Scope / Subtitle</Text>
            <TextInput
              value={newDeptSubtitle}
              onChangeText={(text) => this.setState({ newDeptSubtitle: text })}
              placeholder="e.g., Automated Testing & SLA Verification"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.addBtn}
              onPress={this.handleCreateDepartment}
              activeOpacity={0.8}
            >
              <Icon name="add-circle" size={18} color="#FFFFFF" />
              <Text style={styles.addBtnText}>+ Add Department</Text>
            </TouchableOpacity>
          </View>

          {/* Department Cards List */}
          <Text style={styles.listHeading}>Active Departments ({activeDepts.length})</Text>

          {activeDepts.map((dept) => {
            const isEditing = editingDeptId === dept.id;
            return (
              <View key={dept.id} style={styles.deptCard}>
                <View style={styles.deptHeaderRow}>
                  {isEditing ? (
                    <View style={styles.renameRow}>
                      <TextInput
                        value={editingName}
                        onChangeText={(t) => this.setState({ editingName: t })}
                        style={styles.renameInput}
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.saveRenameBtn}
                        onPress={() => this.handleSaveRename(dept.id)}
                      >
                        <Text style={styles.saveRenameText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.deptTitleWrap}>
                      <Text style={styles.deptName}>{dept.name}</Text>
                      <Text style={styles.deptSubtitle}>{dept.subtitle}</Text>
                    </View>
                  )}

                  <View style={styles.memberPill}>
                    <Icon name="people" size={13} color="#1E293B" />
                    <Text style={styles.memberCountText}>{dept.memberCount || 1} Members</Text>
                  </View>
                </View>

                <View style={styles.headRow}>
                  <Text style={styles.headLabel}>Head of Department:</Text>
                  <Text style={styles.headValue}>{dept.head}</Text>
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.renameBtn}
                    onPress={() => this.handleStartRename(dept)}
                  >
                    <Icon name="settings" size={14} color="#2563EB" />
                    <Text style={styles.renameBtnText}>Rename</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.archiveBtn}
                    onPress={() => this.handleArchive(dept)}
                  >
                    <Icon name="trash" size={14} color="#DC2626" />
                    <Text style={styles.archiveBtnText}>Archive</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              Total: {activeDepts.length} Active Departments • Synced with AsyncStorage
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  createSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 8,
    paddingVertical: 11,
    marginTop: 14,
    gap: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  deptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  deptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  deptTitleWrap: {
    flex: 1,
    marginRight: 10,
  },
  deptName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  deptSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  memberCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  headLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  headValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  renameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  renameBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  archiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  archiveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  renameRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  renameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
  },
  saveRenameBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  saveRenameText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

const mapStateToProps = (state) => ({
  departments: state.users.departments,
});

const mapDispatchToProps = {
  addDepartment,
  updateDepartment,
  archiveDepartment,
};

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentManagementScreen);
