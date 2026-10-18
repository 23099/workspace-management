import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { IMAGES } from '../../assets/images';
import AppInput from '../../components/common/AppInput';
import Icon from '../../components/common/Icon';
import { isValidEmail, isValidPassword } from '../../utils/validation';

const ROLE_OPTIONS = [
  { id: 'ADMIN', label: 'Admin', desc: 'Full System Control', color: '#1E293B' },
  { id: 'HR', label: 'HR', desc: 'Payroll & Leaves', color: '#0F766E' },
  { id: 'MANAGER', label: 'Manager', desc: 'Team & Tasks', color: '#1D4ED8' },
  { id: 'EMPLOYEE', label: 'Employee', desc: 'Work & Punch', color: '#4338CA' },
  { id: 'CLIENT', label: 'Client', desc: 'Milestone Review', color: '#92400E' },
];

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [title, setTitle] = useState('Company Administrator');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    if (roleId === 'ADMIN') setTitle('Company Administrator');
    else if (roleId === 'HR') setTitle('HR & Payroll Specialist');
    else if (roleId === 'MANAGER') setTitle('Engineering Manager');
    else if (roleId === 'EMPLOYEE') setTitle('Software Engineer');
    else if (roleId === 'CLIENT') setTitle('Client Partner Representative');
  };

  const handleRegister = async () => {
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid work email address');
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMessage('! Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      role: selectedRole,
      title,
      phone: phone.trim() || '+92 300 0000000',
    });
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      Alert.alert(
        'Account Created',
        `Welcome ${name}! Your ${selectedRole} account has been created successfully.`,
        [{ text: 'Continue to Workspace' }]
      );
    }
  };

  const activeRoleColor =
    ROLE_OPTIONS.find((r) => r.id === selectedRole)?.color || '#1E293B';

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={[styles.logoBadge, { backgroundColor: activeRoleColor }]}>
            <Image source={IMAGES.appLogo} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={[styles.brandTitle, isDark && styles.textWhite]}>
            Create Account
          </Text>
          <Text style={[styles.brandSubtitle, isDark && styles.textMuted]}>
            Workforce Management System (WMS)
          </Text>
        </View>

        {/* Register Form Card */}
        <View style={[styles.formCard, isDark && styles.formCardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textWhite]}>
            Register General or Admin User
          </Text>
          <Text style={[styles.cardDesc, isDark && styles.textMuted]}>
            Fill in your details to register and access your enterprise workspace
          </Text>

          {Boolean(errorMessage) && (
            <View style={styles.globalErrorBanner}>
              <Icon name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.globalErrorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Role Selection Chips */}
          <Text style={[styles.inputSectionLabel, isDark && styles.textMuted]}>
            Select Account Role:
          </Text>
          <View style={styles.rolePickerRow}>
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = selectedRole === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.roleChip,
                    isSelected && { backgroundColor: opt.color, borderColor: opt.color },
                    !isSelected && isDark && styles.roleChipDark,
                  ]}
                  onPress={() => handleRoleSelect(opt.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      isSelected ? styles.roleChipTextActive : (isDark ? styles.textMuted : styles.roleChipTextInactive),
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppInput
            label="Full Name *"
            value={name}
            onChangeText={(txt) => {
              setName(txt);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="e.g. Usman Tariq"
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />

          <AppInput
            ref={emailInputRef}
            label="Work Email Address *"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="e.g. usman@acmetech.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />

          <AppInput
            ref={passwordInputRef}
            label="Account Password *"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="At least 6 characters"
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            error={
              password.length > 0 && !isValidPassword(password)
                ? '! Password must be at least 6 characters'
                : null
            }
          />

          <AppInput
            ref={confirmPasswordInputRef}
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={(txt) => {
              setConfirmPassword(txt);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Re-enter your password"
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => phoneInputRef.current?.focus()}
            error={
              confirmPassword.length > 0 && confirmPassword !== password
                ? '! Passwords do not match'
                : null
            }
          />

          <AppInput
            ref={phoneInputRef}
            label="Phone Contact (Optional)"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +92 300 1234567"
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: activeRoleColor },
              loading && styles.submitBtnDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.submitBtnText}>
                  Register as {selectedRole}
                </Text>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Back to Sign In Link */}
          <View style={styles.signInPromptRow}>
            <Text style={[styles.signInPromptText, isDark && styles.textMuted]}>
              Already have an enterprise account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={[styles.signInLinkText, { color: activeRoleColor }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0B0F17',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 36,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  logoImage: {
    width: 34,
    height: 34,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  formCardDark: {
    backgroundColor: '#151D2A',
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  globalErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  globalErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  roleChipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#475569',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  roleChipTextInactive: {
    color: '#475569',
  },
  submitBtn: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signInPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  signInPromptText: {
    fontSize: 12,
    color: '#64748B',
  },
  signInLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textWhite: {
    color: '#F8FAFC',
  },
  textMuted: {
    color: '#94A3B8',
  },
});

export default RegisterScreen;
