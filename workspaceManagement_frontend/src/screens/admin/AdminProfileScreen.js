import React, { useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import AppInput from '../../components/common/AppInput';
import AvatarPickerModal from '../../components/common/AvatarPickerModal';
import Icon from '../../components/common/Icon';
import { getAvatarSource } from '../../assets/images';

export const AdminProfileScreen = ({ navigation }) => {
  const { currentUser, updateAdminProfile, updateCurrentUserDP, logout } = useAuth();
  const { getRolePalette, isDark, toggleTheme } = useTheme();
  const palette = getRolePalette('ADMIN');

  const [name, setName] = useState(currentUser?.name || 'Usman Tariq');
  const [title, setTitle] = useState(currentUser?.title || 'Lead Platform Architect & Admin');
  const [phone, setPhone] = useState(currentUser?.phone || '+92 300 9876543');
  const [location, setLocation] = useState(currentUser?.location || 'HQ - Islamabad, 4th Floor');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleSaveProfile = async () => {
    const res = await updateAdminProfile({
      name,
      title,
      phone,
      location,
    });
    if (res.success) {
      Alert.alert('Profile Saved', 'Administrator profile details updated.');
    } else {
      Alert.alert('Error', res.error || 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of Admin session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Admin Profile & Account Settings"
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Avatar Card */}
        <View style={[styles.avatarCard, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.avatarWrap}>
            <Image
              source={getAvatarSource(currentUser?.avatarKey || currentUser?.avatarCustomUri)}
              style={styles.avatarImg}
            />
            <TouchableOpacity
              style={[styles.cameraBadge, { backgroundColor: palette.primary }]}
              onPress={() => setShowAvatarModal(true)}
            >
              <Icon name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: palette.textPrimary }]}>{currentUser?.name}</Text>
          <View style={[styles.roleTag, { backgroundColor: palette.primary }]}>
            <Text style={styles.roleTagText}>Company Administrator (Full Access)</Text>
          </View>
          <Text style={[styles.userEmail, { color: palette.textSecondary }]}>{currentUser?.email}</Text>

          <TouchableOpacity
            style={[styles.changePhotoBtn, { borderColor: palette.cardBorder }]}
            onPress={() => setShowAvatarModal(true)}
          >
            <Icon name="camera" size={14} color={palette.textPrimary} />
            <Text style={[styles.changePhotoText, { color: palette.textPrimary }]}>
              Change Profile Photo (DP)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Editable Profile Information Form */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Editable Profile Fields (Admin Only)
          </Text>
          <Text style={[styles.cardSubtitle, { color: palette.textSecondary }]}>
            As Company Administrator, you hold full permission to edit personal details
          </Text>

          <AppInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            editable={true}
          />

          <AppInput
            label="Job Title & Role Designation"
            value={title}
            onChangeText={setTitle}
            editable={true}
          />

          <AppInput
            label="Direct Mobile / Phone"
            value={phone}
            onChangeText={setPhone}
            editable={true}
            keyboardType="phone-pad"
          />

          <AppInput
            label="Assigned Location / Floor"
            value={location}
            onChangeText={setLocation}
            editable={true}
          />

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: palette.primary }]}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveBtnText}>Save Profile Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Security & System Preferences */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Security & System Preferences
          </Text>

          <View style={styles.prefRow}>
            <View>
              <Text style={[styles.prefTitle, { color: palette.textPrimary }]}>Dark Mode (ThemeContext)</Text>
              <Text style={[styles.prefSub, { color: palette.textSecondary }]}>
                Toggle high-contrast dark theme
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#64748B' }}
              thumbColor={isDark ? '#1E293B' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={16} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Sign Out of Admin Session</Text>
        </TouchableOpacity>
      </ScrollView>

      <AvatarPickerModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelectAvatar={(key) => updateCurrentUserDP(key)}
        currentAvatar={currentUser?.avatarKey}
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
  avatarCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    marginBottom: 4,
  },
  roleTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 14,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  prefSub: {
    fontSize: 11,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 13,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default AdminProfileScreen;
