import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { resolveTicket, rejectTicket, addTicketMessage } from '../../store/slices/ticketsSlice';
import { overrideAttendance } from '../../store/slices/attendanceSlice';
import { useTheme } from '../../context/ThemeContext';
import HeaderBar from '../../components/common/HeaderBar';
import Icon from '../../components/common/Icon';
import { IMAGES } from '../../assets/images';

export const HRTicketDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { getRolePalette } = useTheme();
  const palette = getRolePalette('HR');

  const ticketId = route?.params?.ticketId || 'TKT-101';
  const { tickets } = useSelector((state) => state.tickets);
  const ticket = tickets.find((t) => t.id === ticketId) || tickets[0];

  const [replyText, setReplyText] = useState('');

  const isOverrideType = ticket?.category === 'Attendance Correction' || ticket?.id === 'TKT-101';

  const handleApproveOverride = () => {
    Alert.alert(
      'Confirm Attendance Override',
      `Approve physical sign-out adjustment for ${ticket.userName}? This will automatically recalculate salary and mark attendance as CORRECTED_PRESENT.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '✓ Approve & Override',
          onPress: () => {
            // 1. Resolve ticket
            dispatch(
              resolveTicket({
                ticketId: ticket.id,
                replyMessage: 'Attendance override approved by HR Operations based on attached security sign-out proof.',
              })
            );
            // 2. Dispatch attendanceSlice override
            dispatch(
              overrideAttendance({
                userId: ticket.userId || 'EMP-089',
                userName: ticket.userName,
                date: ticket.date || '2026-10-12',
                checkInTime: '09:02 AM',
                checkOutTime: '05:15 PM',
                note: `HR Corrected via #${ticket.id} (Physical sign-in override)`,
              })
            );

            Alert.alert(
              'Override Approved',
              `Attendance log for ${ticket.userName} updated to CORRECTED_PRESENT. Salary deductions recalculated to 0.`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const handleRejectOverride = () => {
    Alert.alert('Reject Ticket', `Reject override request #${ticket.id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject Request',
        style: 'destructive',
        onPress: () => {
          dispatch(
            rejectTicket({
              ticketId: ticket.id,
              replyMessage: 'Override request rejected by HR Operations due to insufficient documentation.',
            })
          );
          Alert.alert('Ticket Rejected', 'Ticket status updated to REJECTED.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    dispatch(
      addTicketMessage({
        ticketId: ticket.id,
        sender: 'Sana Khan (HR Specialist)',
        message: replyText.trim(),
      })
    );
    setReplyText('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <HeaderBar
        title={`Ticket #${ticket?.id}`}
        subtitle="Attendance Override"
        showBack
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket Header Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <View style={styles.topRow}>
            <View>
              <Text style={[styles.subject, { color: palette.textPrimary }]}>{ticket?.subject}</Text>
              <Text style={[styles.employeeSub, { color: palette.textSecondary }]}>
                Submitted by {ticket?.userName} ({ticket?.userId}) • {ticket?.date}
              </Text>
            </View>
            <View style={[styles.statusTag, ticket?.status === 'OPEN' ? styles.tagOpen : styles.tagResolved]}>
              <Text style={[styles.statusTagText, ticket?.status === 'OPEN' ? styles.textOpen : styles.textResolved]}>
                {ticket?.status}
              </Text>
            </View>
          </View>

          <View style={[styles.explanationBox, { backgroundColor: palette.inputBackground }]}>
            <Text style={[styles.explanationLabel, { color: palette.textSecondary }]}>Employee Explanation:</Text>
            <Text style={[styles.explanationText, { color: palette.textPrimary }]}>{ticket?.explanation}</Text>
          </View>
        </View>

        {/* Linked Attendance Override Comparison Card */}
        {isOverrideType && (
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <Icon name="time" size={16} color={palette.primary} />
              <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
                Linked Attendance Override Comparison
              </Text>
            </View>

            <View style={styles.comparisonGrid}>
              <View style={[styles.comparisonBox, styles.currentBox]}>
                <Text style={styles.comparisonLabel}>Current System Log</Text>
                <Text style={styles.comparisonValue}>Out Missing / 0.0h Deduct</Text>
                <Text style={styles.comparisonSub}>Flagged as unexcused absence</Text>
              </View>

              <View style={[styles.comparisonBox, styles.proposedBox]}>
                <Text style={[styles.comparisonLabel, { color: '#0F766E' }]}>Proposed Adjustment</Text>
                <Text style={[styles.comparisonValue, { color: '#0F766E' }]}>Out 05:15 PM / 8h 15m Full</Text>
                <Text style={[styles.comparisonSub, { color: '#115E59' }]}>Verified physical sign-out sheet</Text>
              </View>
            </View>

            {/* Attached Evidence Preview */}
            <Text style={[styles.evidenceLabel, { color: palette.textPrimary }]}>
              Attached Evidence (1 Document) — Security Desk Physical Sign-Out Sheet:
            </Text>
            <View style={styles.evidenceContainer}>
              <Image
                source={IMAGES.evidenceSignoutSheet}
                style={styles.evidenceImage}
                resizeMode="cover"
              />
              <View style={styles.evidenceOverlay}>
                <Icon name="document-text" size={14} color="#FFFFFF" />
                <Text style={styles.evidenceFilename}>IMG_7701.JPG • Security Physical Register</Text>
              </View>
            </View>

            {/* Override Action Buttons */}
            {ticket?.status === 'OPEN' && (
              <View style={styles.overrideActionsRow}>
                <TouchableOpacity
                  style={[styles.approveBtn, { backgroundColor: palette.primary }]}
                  onPress={handleApproveOverride}
                  activeOpacity={0.85}
                >
                  <Icon name="checkmark-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>✓ Approve & Override Attendance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={handleRejectOverride}
                  activeOpacity={0.85}
                >
                  <Icon name="close-circle" size={16} color="#DC2626" />
                  <Text style={styles.rejectBtnText}>Reject Override Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Audit & Discussion Timeline (Syllabus topic 3: flex column-reverse/timeline) */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: palette.textPrimary }]}>
            Audit & Discussion Timeline
          </Text>

          <View style={styles.timelineList}>
            {(ticket?.timeline || []).map((msg, idx) => (
              <View key={idx} style={[styles.timelineItem, { borderColor: palette.divider }]}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.timelineSender, { color: palette.textPrimary }]}>{msg.sender}</Text>
                  <Text style={styles.timelineTime}>{msg.time}</Text>
                </View>
                <Text style={[styles.timelineMessage, { color: palette.textSecondary }]}>{msg.message}</Text>
              </View>
            ))}
          </View>

          {/* Reply input */}
          <View style={styles.replyRow}>
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Post an official note or reply..."
              placeholderTextColor="#94A3B8"
              style={[styles.replyInput, { backgroundColor: palette.inputBackground, borderColor: palette.inputBorder, color: palette.textPrimary }]}
            />
            <TouchableOpacity
              style={[styles.sendReplyBtn, { backgroundColor: palette.primary }]}
              onPress={handleSendReply}
            >
              <Text style={styles.sendReplyText}>Reply</Text>
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
  },
  employeeSub: {
    fontSize: 11,
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagOpen: { backgroundColor: '#FEF3C7' },
  tagResolved: { backgroundColor: '#DCFCE7' },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  textOpen: { color: '#B45309' },
  textResolved: { color: '#16A34A' },
  explanationBox: {
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  comparisonGrid: {
    gap: 8,
    marginBottom: 14,
  },
  comparisonBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  currentBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  proposedBox: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  comparisonLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    textTransform: 'uppercase',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 2,
  },
  comparisonSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 2,
  },
  evidenceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  evidenceContainer: {
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    backgroundColor: '#E2E8F0',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  evidenceOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evidenceFilename: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  overrideActionsRow: {
    gap: 10,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  rejectBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  timelineList: {
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  timelineItem: {
    borderLeftWidth: 2,
    paddingLeft: 10,
    paddingVertical: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  timelineSender: {
    fontSize: 12,
    fontWeight: '700',
  },
  timelineTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  timelineMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  replyRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  sendReplyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  sendReplyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HRTicketDetailScreen;
