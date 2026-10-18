import React, { useReducer, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateCompanySalaryConfig, updateEmployeeSalaryOverride } from '../../store/slices/salarySlice';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import AppInput from '../../components/common/AppInput';
import Icon from '../../components/common/Icon';
import { isValidNumber } from '../../utils/validation';

// Syllabus Requirement: useReducer for complex salary configuration state
const salaryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD': {
      const nextState = { ...state, [action.field]: action.value };
      const base = Number(nextState.baseSalary) || 0;
      const days = Number(nextState.expectedWorkingDays) || 22;
      nextState.dailyProRata = days > 0 ? Math.round(base / days) : 0;
      return nextState;
    }
    case 'ADD_ALLOWANCE': {
      return {
        ...state,
        allowanceItems: [
          ...state.allowanceItems,
          { id: `alw_${Date.now()}`, name: action.payload.name || 'Custom Allowance', amount: action.payload.amount || 5000 },
        ],
      };
    }
    case 'REMOVE_ALLOWANCE': {
      return {
        ...state,
        allowanceItems: state.allowanceItems.filter((item) => item.id !== action.id),
      };
    }
    case 'LOAD_CONFIG': {
      const base = Number(action.payload.baseSalary || 150000);
      const days = Number(action.payload.expectedWorkingDays || action.payload.workingDaysPerPeriod || 22);
      return {
        baseSalary: String(base),
        expectedWorkingDays: String(days),
        dailyProRata: days > 0 ? Math.round(base / days) : 0,
        deductionPerAbsentDay: String(action.payload.deductionPerAbsentDay || 5000),
        deductionPerUnpaidLeaveDay: String(action.payload.deductionPerUnpaidLeaveDay || 3500),
        allowanceItems: action.payload.allowanceItems || [
          { id: 'alw_trans', name: 'Transport Allowance', amount: 15000 },
          { id: 'alw_net', name: 'Internet & Utility Allowance', amount: 5000 },
        ],
      };
    }
    default:
      return state;
  }
};

const initialSalaryState = {
  baseSalary: '150000',
  expectedWorkingDays: '22',
  dailyProRata: 6818,
  deductionPerAbsentDay: '5000',
  deductionPerUnpaidLeaveDay: '3500',
  allowanceItems: [
    { id: 'alw_trans', name: 'Transport Allowance', amount: 15000 },
    { id: 'alw_net', name: 'Internet & Utility Allowance', amount: 5000 },
  ],
};

export const SalaryConfigScreen = ({ navigation }) => {
  const reduxDispatch = useDispatch();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('HR');

  const { companyWide, overrides } = useSelector((state) => state.salary);
  const [activeScope, setActiveScope] = useState('COMPANY'); // 'COMPANY' | 'OVERRIDE'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP-089'); // Ali Raza

  // Syllabus requirement: useReducer
  const [state, dispatch] = useReducer(salaryReducer, initialSalaryState);

  // Validate numeric fields
  const isValid =
    isValidNumber(state.baseSalary) &&
    isValidNumber(state.expectedWorkingDays) &&
    isValidNumber(state.deductionPerAbsentDay) &&
    isValidNumber(state.deductionPerUnpaidLeaveDay);

  const handleScopeChange = (scope) => {
    setActiveScope(scope);
    if (scope === 'COMPANY') {
      dispatch({ type: 'LOAD_CONFIG', payload: companyWide });
    } else {
      const empConfig = overrides[selectedEmployeeId] || companyWide;
      dispatch({ type: 'LOAD_CONFIG', payload: empConfig });
    }
  };

  const handleAddAllowancePrompt = () => {
    dispatch({
      type: 'ADD_ALLOWANCE',
      payload: { name: 'Shift Hardship Allowance', amount: 5000 },
    });
  };

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for all salary parameters.');
      return;
    }

    const payload = {
      baseSalary: parseInt(state.baseSalary, 10),
      workingDaysPerPeriod: parseInt(state.expectedWorkingDays, 10),
      deductionPerAbsentDay: parseInt(state.deductionPerAbsentDay, 10),
      deductionPerUnpaidLeaveDay: parseInt(state.deductionPerUnpaidLeaveDay, 10),
      allowanceItems: state.allowanceItems,
    };

    if (activeScope === 'COMPANY') {
      reduxDispatch(updateCompanySalaryConfig(payload));
      Alert.alert('Saved', 'Company-wide default salary policies updated.');
    } else {
      reduxDispatch(updateEmployeeSalaryOverride({ userId: selectedEmployeeId, config: payload }));
      Alert.alert('Saved', 'Employee custom salary override updated for Ali Raza.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="HR Salary & Custom Deduction"
        subtitle="useReducer State"
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Segmented Switcher */}
        <View style={[styles.segmentedWrap, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeScope === 'COMPANY' && { backgroundColor: palette.primary },
            ]}
            onPress={() => handleScopeChange('COMPANY')}
          >
            <Text
              style={[
                styles.segmentText,
                activeScope === 'COMPANY' ? { color: '#FFFFFF' } : { color: palette.textSecondary },
              ]}
            >
              Company-Wide Default
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeScope === 'OVERRIDE' && { backgroundColor: palette.primary },
            ]}
            onPress={() => handleScopeChange('OVERRIDE')}
          >
            <Text
              style={[
                styles.segmentText,
                activeScope === 'OVERRIDE' ? { color: '#FFFFFF' } : { color: palette.textSecondary },
              ]}
            >
              Employee Override (Ali Raza)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Configuration Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Base Earning & Pro-Rata Parameters
          </Text>

          <AppInput
            label="Base Monthly Salary (PKR)"
            value={state.baseSalary}
            onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'baseSalary', value: v })}
            keyboardType="numeric"
            placeholder="150000"
          />

          <AppInput
            label="Expected Working Days / Month"
            value={state.expectedWorkingDays}
            onChangeText={(v) => dispatch({ type: 'SET_FIELD', field: 'expectedWorkingDays', value: v })}
            keyboardType="numeric"
            placeholder="22"
          />

          {/* Auto calculated Pro Rata Pill */}
          <View style={styles.proRataPill}>
            <Icon name="cash" size={15} color="#0F766E" />
            <Text style={styles.proRataText}>
              Standard Daily Pro-Rata Rate: {Number(state.dailyProRata).toLocaleString()} PKR / day
            </Text>
          </View>
        </View>

        {/* Deductions Policy Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Deductions & Absence Penalty Rates
          </Text>

          <AppInput
            label="Deduction per Absent Day (PKR / Day)"
            value={state.deductionPerAbsentDay}
            onChangeText={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'deductionPerAbsentDay', value: v })
            }
            keyboardType="numeric"
            placeholder="5000"
          />

          <AppInput
            label="Deduction per Unpaid Leave Day (PKR / Day)"
            value={state.deductionPerUnpaidLeaveDay}
            onChangeText={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'deductionPerUnpaidLeaveDay', value: v })
            }
            keyboardType="numeric"
            placeholder="3500"
          />
        </View>

        {/* Dynamic Fixed Allowances Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.allowanceHeaderRow}>
            <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
              Fixed Monthly Allowances
            </Text>
            <TouchableOpacity
              style={[styles.addAllowanceBtn, { backgroundColor: palette.badge }]}
              onPress={handleAddAllowancePrompt}
            >
              <Text style={[styles.addAllowanceBtnText, { color: palette.primary }]}>+ Add Allowance</Text>
            </TouchableOpacity>
          </View>

          {state.allowanceItems.map((item) => (
            <View key={item.id} style={[styles.allowanceRow, { borderColor: palette.cardBorder }]}>
              <View style={styles.allowanceInfo}>
                <Text style={[styles.allowanceName, { color: palette.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.allowanceAmount, { color: palette.textSecondary }]}>
                  +{Number(item.amount).toLocaleString()} PKR
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => dispatch({ type: 'REMOVE_ALLOWANCE', id: item.id })}
                style={styles.removeBtn}
              >
                <Icon name="trash" size={16} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Inline Confirmation or Error banner */}
        {isValid ? (
          <View style={styles.validBanner}>
            <Icon name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={styles.validBannerText}>✓ Valid numeric deduction rates configured</Text>
          </View>
        ) : (
          <View style={styles.errorBanner}>
            <Icon name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.errorBannerText}>! Please enter valid numeric values for all fields</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: palette.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save Salary Configuration</Text>
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
  segmentedWrap: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  proRataPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginTop: 4,
  },
  proRataText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  allowanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addAllowanceBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addAllowanceBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  allowanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  allowanceInfo: {
    flex: 1,
  },
  allowanceName: {
    fontSize: 13,
    fontWeight: '600',
  },
  allowanceAmount: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  removeBtn: {
    padding: 6,
  },
  validBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: 16,
  },
  validBannerText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SalaryConfigScreen;
