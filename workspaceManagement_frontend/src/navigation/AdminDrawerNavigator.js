import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import storageService from '../services/storageService';
import { getAvatarSource, IMAGES } from '../assets/images';
import Icon from '../components/common/Icon';

// Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CompanyProfileScreen from '../screens/admin/CompanyProfileScreen';
import DepartmentManagementScreen from '../screens/admin/DepartmentManagementScreen';
import EmployeeDirectoryScreen from '../screens/admin/EmployeeDirectoryScreen';
import EmployeeFormScreen from '../screens/admin/EmployeeFormScreen';
import AnnouncementsFeedScreen from '../screens/admin/AnnouncementsFeedScreen';
import NotificationsScreen from '../screens/admin/NotificationsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AdminStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Stack.Screen name="DepartmentManagement" component={DepartmentManagementScreen} />
      <Stack.Screen name="EmployeeDirectory" component={EmployeeDirectoryScreen} />
      <Stack.Screen name="EmployeeForm" component={EmployeeFormScreen} />
      <Stack.Screen name="AnnouncementsFeed" component={AnnouncementsFeedScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
    </Stack.Navigator>
  );
};

const CustomAdminDrawerContent = (props) => {
  const { currentUser, logout, quickDemoLogin } = useAuth();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('ADMIN');

  const handleResetData = () => {
    Alert.alert(
      'Reset AsyncStorage Seed Data',
      'This will reset company, employees, attendance and payroll data back to initial seed state.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Seed',
          style: 'destructive',
          onPress: async () => {
            await storageService.resetToSeedData();
            Alert.alert('Storage Reset', 'AsyncStorage reset to initial course syllabus seed data.');
          },
        },
      ]
    );
  };

  const handleQuickSwitch = () => {
    Alert.alert('Quick Switch Demo Role', 'Select profile to simulate:', [
      { text: 'Sana Khan (HR Specialist)', onPress: () => quickDemoLogin('HR-104') },
      { text: 'Bilal Ahmed (Engineering Manager)', onPress: () => quickDemoLogin('MGR-022') },
      { text: 'Ali Raza (Software Engineer II)', onPress: () => quickDemoLogin('EMP-089') },
      { text: 'Zafar Corp (Client Representative)', onPress: () => quickDemoLogin('CLT-501') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Admin portal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: palette.card }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Drawer Header matching Drawer Menu.png */}
        <View style={[styles.drawerHeader, { borderBottomColor: palette.divider }]}>
          <Image
            source={getAvatarSource(currentUser?.avatarKey || IMAGES.dpAdminUsman)}
            style={styles.adminAvatar}
          />
          <Text style={[styles.adminName, { color: palette.textPrimary }]}>
            Usman Tariq (ADMIN)
          </Text>
          <Text style={[styles.adminEmail, { color: palette.textSecondary }]}>
            {currentUser?.email || 'usman@acmetech.com'}
          </Text>

          {/* React Navigation Drawer v6 badge */}
          <View style={styles.drawerBadge}>
            <Text style={styles.drawerBadgeText}>React Navigation Drawer v6</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItemsList}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('AdminDashboard')}
          >
            <Icon name="grid" size={18} color="#1E293B" />
            <Text style={[styles.menuItemText, { color: palette.textPrimary }]}>Executive Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('AnnouncementsFeed')}
          >
            <Icon name="notifications" size={18} color="#1E293B" />
            <Text style={[styles.menuItemText, { color: palette.textPrimary }]}>Company Announcements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Notifications')}
          >
            <Icon name="chatbubble-ellipses" size={18} color="#1E293B" />
            <View style={styles.menuItemRow}>
              <Text style={[styles.menuItemText, { color: palette.textPrimary }]}>In-App Notifications</Text>
              <View style={styles.unreadCountBadge}>
                <Text style={styles.unreadCountText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('AdminProfile')}
          >
            <Icon name="settings" size={18} color="#1E293B" />
            <Text style={[styles.menuItemText, { color: palette.textPrimary }]}>
              Editable Profile &amp; Theme Settings
            </Text>
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: palette.divider }]} />

          <TouchableOpacity style={styles.menuItem} onPress={handleQuickSwitch}>
            <Icon name="people" size={18} color="#2563EB" />
            <Text style={[styles.menuItemText, { color: '#2563EB', fontWeight: '700' }]}>
              Quick Switch Demo Role
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleResetData}>
            <Icon name="refresh" size={18} color="#D97706" />
            <Text style={[styles.menuItemText, { color: '#D97706', fontWeight: '700' }]}>
              Reset AsyncStorage Seed Data
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Bottom Red Logout Button */}
      <View style={[styles.drawerFooter, { borderTopColor: palette.divider }]}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out" size={18} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomAdminDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { width: 300 },
      }}
    >
      <Drawer.Screen name="AdminStack" component={AdminStackNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  adminAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '800',
  },
  adminEmail: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  drawerBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  drawerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  menuItemsList: {
    paddingTop: 12,
    paddingHorizontal: 12,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  menuItemRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadCountBadge: {
    backgroundColor: '#DC2626',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  menuDivider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  drawerFooter: {
    borderTopWidth: 1,
    padding: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default AdminDrawerNavigator;
