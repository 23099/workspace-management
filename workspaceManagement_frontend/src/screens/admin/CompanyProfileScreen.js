import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateCompanyProfile } from '../../store/slices/companySlice';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import AppInput from '../../components/common/AppInput';
import Icon from '../../components/common/Icon';
import { IMAGES } from '../../assets/images';

const ALL_DAYS = [
  { key: 'M', label: 'Mon' },
  { key: 'T1', label: 'Tue' },
  { key: 'W', label: 'Wed' },
  { key: 'T2', label: 'Thu' },
  { key: 'F', label: 'Fri' },
  { key: 'S1', label: 'Sat' },
  { key: 'S2', label: 'Sun' },
];

export const CompanyProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const company = useSelector((state) => state.company);
  const { getRolePalette, isDark } = useTheme();
  const palette = getRolePalette('ADMIN');

  const [name, setName] = useState(company.name);
  const [timezone, setTimezone] = useState(company.timezone);
  const [workingDays, setWorkingDays] = useState(['M', 'T1', 'W', 'T2', 'F']);
  const [latitude, setLatitude] = useState(String(company.latitude));
  const [longitude, setLongitude] = useState(String(company.longitude));
  const [radius, setRadius] = useState(String(company.geofenceRadiusMeters));

  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(
    String(company.standardWorkingDaysPerMonth || 22)
  );
  const [absenceDeduction, setAbsenceDeduction] = useState(
    String(company.defaultAbsenceDeduction || 5000)
  );
  const [unpaidLeaveDeduction, setUnpaidLeaveDeduction] = useState(
    String(company.defaultUnpaidLeaveDeduction || 3500)
  );

  const toggleDay = (dayKey) => {
    if (workingDays.includes(dayKey)) {
      setWorkingDays(workingDays.filter((d) => d !== dayKey));
    } else {
      setWorkingDays([...workingDays, dayKey]);
    }
  };

  const handleSave = () => {
    dispatch(
      updateCompanyProfile({
        name,
        timezone,
        latitude: parseFloat(latitude) || 31.5204,
        longitude: parseFloat(longitude) || 74.3587,
        geofenceRadiusMeters: parseInt(radius, 10) || 200,
        standardWorkingDaysPerMonth: parseInt(workingDaysPerMonth, 10) || 22,
        defaultAbsenceDeduction: parseInt(absenceDeduction, 10) || 5000,
        defaultUnpaidLeaveDeduction: parseInt(unpaidLeaveDeduction, 10) || 3500,
      })
    );
    Alert.alert('Configuration Saved', 'Company profile and geofence policies updated.');
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Company Profile & Geofence Policy"
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Company Profile Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Company Profile & Operational Schedule
          </Text>
          <Text style={[styles.cardSubtitle, { color: palette.textSecondary }]}>
            Base identity and business operating cycle
          </Text>

          <AppInput
            label="Company Name"
            value={name}
            onChangeText={setName}
            placeholder="Acme Tech Solutions"
          />

          <AppInput
            label="System Operating Timezone"
            value={timezone}
            onChangeText={setTimezone}
            placeholder="Asia/Karachi (GMT+05:00)"
          />

          {/* Active Working Days row with flexWrap: 'wrap' */}
          <Text style={[styles.inputLabel, { color: palette.textPrimary }]}>
            Active Working Days (Shift Schedule)
          </Text>
          <View style={styles.daysRow}>
            {ALL_DAYS.map((d) => {
              const active = workingDays.includes(d.key);
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.dayPill,
                    active
                      ? { backgroundColor: palette.primary, borderColor: palette.primary }
                      : { backgroundColor: palette.inputBackground, borderColor: palette.cardBorder },
                  ]}
                  onPress={() => toggleDay(d.key)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      active ? { color: '#FFFFFF' } : { color: palette.textSecondary },
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Office Location & Geofence Perimeter */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Office Location & Geofence Perimeter
          </Text>
          <Text style={[styles.cardSubtitle, { color: palette.textSecondary }]}>
            Visual coordinate validation & 200m radius circle
          </Text>

          {/* Map Preview Container with dashed radius circle and pin */}
          <View style={styles.mapContainer}>
            <Image
              source={IMAGES.mapLahoreCampus}
              style={styles.mapImage}
              resizeMode="cover"
            />
            {/* Dashed 200m circle overlay */}
            <View style={styles.dashedGeofenceCircle} />
            {/* Centered Acme Tech HQ Pin */}
            <View style={styles.mapPinContainer}>
              <View style={styles.pinBubble}>
                <Text style={styles.pinBubbleText}>Acme Tech HQ</Text>
              </View>
              <Icon name="location" size={26} color="#DC2626" />
            </View>
          </View>

          <View style={styles.coordsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <AppInput
                label="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
                placeholder="31.5204"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
                placeholder="74.3587"
              />
            </View>
          </View>

          <AppInput
            label="Geofence Radius (Meters)"
            value={radius}
            onChangeText={setRadius}
            keyboardType="numeric"
            placeholder="200"
            helperText="Employees must be within this radius to register attendance check-ins."
          />
        </View>

        {/* Default Salary & Deduction Policy */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Default Salary & Deduction Policy
          </Text>
          <Text style={[styles.cardSubtitle, { color: palette.textSecondary }]}>
            Standard payroll values used across HR calculators
          </Text>

          <AppInput
            label="Standard Working Days / Month"
            value={workingDaysPerMonth}
            onChangeText={setWorkingDaysPerMonth}
            keyboardType="numeric"
            placeholder="22"
          />

          <AppInput
            label="Default Absence Deduction (PKR / Day)"
            value={absenceDeduction}
            onChangeText={setAbsenceDeduction}
            keyboardType="numeric"
            placeholder="5000"
          />

          <AppInput
            label="Default Unpaid Leave Deduction (PKR / Day)"
            value={unpaidLeaveDeduction}
            onChangeText={setUnpaidLeaveDeduction}
            keyboardType="numeric"
            placeholder="3500"
          />
        </View>

        {/* Save Configuration Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: palette.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save Configuration</Text>
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
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  dayPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  dashedGeofenceCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinBubble: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  pinBubbleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  coordsRow: {
    flexDirection: 'row',
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CompanyProfileScreen;
