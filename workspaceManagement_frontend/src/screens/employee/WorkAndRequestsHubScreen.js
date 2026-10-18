import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import MyLeaveRequestsScreen from './MyLeaveRequestsScreen';
import MyHRTicketsScreen from './MyHRTicketsScreen';
import MyTasksScreen from './MyTasksScreen';

export const WorkAndRequestsHubScreen = ({ navigation }) => {
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('EMPLOYEE');
  const [activeSegment, setActiveSegment] = useState('LEAVES'); // 'LEAVES' | 'TICKETS' | 'TASKS'

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <HeaderBar
        title="Work & Requests"
        subtitle="Employee Self-Service"
        navigation={navigation}
      />

      {/* Segment Switcher Header */}
      <View style={[styles.segmentBar, { backgroundColor: palette.card, borderBottomColor: palette.cardBorder }]}>
        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeSegment === 'LEAVES' && { borderBottomColor: palette.primary, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveSegment('LEAVES')}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegment === 'LEAVES'
                ? { color: palette.primary, fontWeight: '800' }
                : { color: palette.textSecondary },
            ]}
          >
            Leave Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeSegment === 'TICKETS' && { borderBottomColor: palette.primary, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveSegment('TICKETS')}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegment === 'TICKETS'
                ? { color: palette.primary, fontWeight: '800' }
                : { color: palette.textSecondary },
            ]}
          >
            HR Tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeSegment === 'TASKS' && { borderBottomColor: palette.primary, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveSegment('TASKS')}
        >
          <Text
            style={[
              styles.segmentText,
              activeSegment === 'TASKS'
                ? { color: palette.primary, fontWeight: '800' }
                : { color: palette.textSecondary },
            ]}
          >
            Sprint Tasks
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrap}>
        {activeSegment === 'LEAVES' && <MyLeaveRequestsScreen navigation={navigation} />}
        {activeSegment === 'TICKETS' && <MyHRTicketsScreen navigation={navigation} />}
        {activeSegment === 'TASKS' && <MyTasksScreen navigation={navigation} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentWrap: {
    flex: 1,
  },
});

export default WorkAndRequestsHubScreen;
