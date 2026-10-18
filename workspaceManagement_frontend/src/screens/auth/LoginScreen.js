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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { IMAGES } from '../../assets/images';
import AppInput from '../../components/common/AppInput';
import Icon from '../../components/common/Icon';
import { isValidEmail, isValidPassword } from '../../utils/validation';

export const LoginScreen = () => {
  const { login, quickDemoLogin } = useAuth();
  const { isDark } = useTheme();

  const [email, setEmail] = useState('usman@acmetech.com');
  const [password, setPassword] = useState('password123');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Syllabus requirement: useRef focus chaining
  const passwordInputRef = useRef(null);

  // Pure validation check for inline error banner
  const passwordHasError = password.length > 0 && !isValidPassword(password);

  const handleSignIn = async () => {
    setErrorMessage('');
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid work email address');
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMessage('! Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Password Recovery',
      'For demo & security compliance, please contact your Company Administrator (Usman Tariq) or use the Quick Demo Role Switcher below.',
      [{ text: 'OK' }]
    );
  };

  const demoRoles = [
    {
      id: 'ADM-001',
      name: 'Usman Tariq',
      roleSubtitle: 'Company Admin (Full Access)',
      image: IMAGES.dpAdminUsman,
      badgeColor: '#1E293B',
      role: 'ADMIN',
    },
    {
      id: 'HR-104',
      name: 'Sana Khan',
      roleSubtitle: 'HR & Payroll Specialist',
      image: IMAGES.dpHrSana,
      badgeColor: '#0F766E',
      role: 'HR',
    },
    {
      id: 'MGR-022',
      name: 'Bilal Ahmed',
      roleSubtitle: 'Engineering Manager',
      image: IMAGES.dpMgrBilal,
      badgeColor: '#1D4ED8',
      role: 'MANAGER',
    },
    {
      id: 'EMP-089',
      name: 'Ali Raza',
      roleSubtitle: 'Software Engineer II',
      image: IMAGES.dpEmpAli,
      badgeColor: '#4338CA',
      role: 'EMPLOYEE',
    },
    {
      id: 'CLT-501',
      name: 'Zafar Corp (Zafar Ahmed)',
      roleSubtitle: 'Client Representative',
      image: IMAGES.dpClientZafar,
      badgeColor: '#92400E',
      role: 'CLIENT',
    },
  ];

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
          <View style={styles.logoBadge}>
            <Image source={IMAGES.appLogo} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={[styles.brandTitle, isDark && styles.textWhite]}>
            Acme Tech Solutions
          </Text>
          <Text style={[styles.brandSubtitle, isDark && styles.textMuted]}>
            Workforce Management System (WMS)
          </Text>
          <View style={styles.telemetryPill}>
            <View style={styles.telemetryDot} />
            <Text style={styles.telemetryText}>Enterprise ID: WMS-PK-982 • Active Session</Text>
          </View>
        </View>

        {/* Login Form Card */}
        <View style={[styles.formCard, isDark && styles.formCardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textWhite]}>Sign In to Workspace</Text>
          <Text style={[styles.cardDesc, isDark && styles.textMuted]}>
            Enter your enterprise credentials or use quick demo access
          </Text>

          {Boolean(errorMessage) && (
            <View style={styles.globalErrorBanner}>
              <Icon name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.globalErrorText}>{errorMessage}</Text>
            </View>
          )}

          <AppInput
            label="Work Email Address"
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
            label="Account Password"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Enter your password"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            error={passwordHasError ? '! Password must be at least 6 characters' : null}
          />

          {/* Options Row */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRememberDevice(!rememberDevice)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberDevice && styles.checkboxActive]}>
                {rememberDevice && <Icon name="checkmark" size={12} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkboxLabel, isDark && styles.textMuted]}>
                Remember this device
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnContent}>
                <Text style={styles.signInBtnText}>Sign In</Text>
                <Icon name="chevron-forward" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* OR Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
          <Text style={[styles.dividerText, isDark && styles.textMuted]}>
            OR QUICK DEMO ACCESS
          </Text>
          <View style={[styles.dividerLine, isDark && styles.dividerLineDark]} />
        </View>

        {/* Quick Demo Switcher Card List */}
        <View style={styles.demoListContainer}>
          {demoRoles.map((demo) => (
            <TouchableOpacity
              key={demo.id}
              style={[styles.demoCard, isDark && styles.demoCardDark]}
              onPress={() => quickDemoLogin(demo.id)}
              activeOpacity={0.8}
            >
              <Image source={demo.image} style={styles.demoAvatar} />
              <View style={styles.demoInfo}>
                <View style={styles.demoNameRow}>
                  <Text style={[styles.demoName, isDark && styles.textWhite]}>{demo.name}</Text>
                  <View style={[styles.roleTag, { backgroundColor: demo.badgeColor }]}>
                    <Text style={styles.roleTagText}>{demo.role}</Text>
                  </View>
                </View>
                <Text style={[styles.demoSub, isDark && styles.textMuted]}>
                  {demo.roleSubtitle}
                </Text>
              </View>
              <View style={styles.arrowIcon}>
                <Icon name="chevron-forward" size={18} color={demo.badgeColor} />
              </View>
            </TouchableOpacity>
          ))}
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
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  logoImage: {
    width: 36,
    height: 36,
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
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  telemetryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  telemetryText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formCardDark: {
    backgroundColor: '#151D2A',
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 18,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  signInBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtnDisabled: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerLineDark: {
    backgroundColor: '#334155',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  demoListContainer: {
    gap: 10,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  demoCardDark: {
    backgroundColor: '#151D2A',
    borderColor: '#334155',
  },
  demoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  demoInfo: {
    flex: 1,
  },
  demoNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  demoSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  arrowIcon: {
    padding: 4,
  },
  textWhite: {
    color: '#F8FAFC',
  },
  textMuted: {
    color: '#94A3B8',
  },
});

export default LoginScreen;
