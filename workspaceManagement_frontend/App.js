/**
 * Workforce Management System (WMS)
 * Course Syllabus Aligned React Native Application
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const ThemedStatusBar = () => {
  const { isDark } = useTheme();
  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={isDark ? '#0B0F17' : '#FFFFFF'}
    />
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <ThemedStatusBar />
            <AppNavigator />
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
