import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AVATAR_DP_PRESETS, getAvatarSource } from '../../assets/images';
import Icon from './Icon';

export const AvatarPickerModal = ({
  visible,
  onClose,
  onSelectAvatar,
  currentAvatar,
  title = 'Change Display Picture (DP)',
}) => {
  const { isDark } = useTheme();
  const [customUri, setCustomUri] = useState('');
  const [selectedKey, setSelectedKey] = useState(currentAvatar || 'dpEmpAli');

  const handleSelectPreset = (preset) => {
    setSelectedKey(preset.image);
    if (onSelectAvatar) {
      onSelectAvatar(preset.image);
    }
    onClose();
  };

  const handleApplyCustomUri = () => {
    if (customUri.trim()) {
      setSelectedKey(customUri.trim());
      if (onSelectAvatar) {
        onSelectAvatar(customUri.trim());
      }
      setCustomUri('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <Icon name="camera" size={20} color="#1E293B" />
                  <Text style={[styles.modalTitle, isDark && styles.textDark]}>{title}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Icon name="close" size={20} color={isDark ? '#E2E8F0' : '#475569'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionSubtitle, isDark && styles.textMuted]}>
                Select from verified Role DP Presets:
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.presetsContainer}
              >
                {AVATAR_DP_PRESETS.map((preset) => {
                  const isSelected = selectedKey === preset.image;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetCard,
                        isDark && styles.presetCardDark,
                        isSelected && { borderColor: preset.accent, borderWidth: 2.5 },
                      ]}
                      onPress={() => handleSelectPreset(preset)}
                      activeOpacity={0.8}
                    >
                      <Image source={preset.image} style={styles.presetImage} />
                      <View style={[styles.roleBadge, { backgroundColor: preset.accent }]}>
                        <Text style={styles.roleBadgeText}>{preset.name}</Text>
                      </View>
                      <Text style={[styles.presetLabel, isDark && styles.textDark]} numberOfLines={1}>
                        {preset.label.split('(')[1]?.replace(')', '') || preset.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.divider} />

              <Text style={[styles.sectionSubtitle, isDark && styles.textMuted]}>
                Or enter image URL / local filepath:
              </Text>

              <View style={styles.customInputRow}>
                <TextInput
                  value={customUri}
                  onChangeText={setCustomUri}
                  placeholder="https://... or file:///..."
                  placeholderTextColor="#94A3B8"
                  style={[styles.customInput, isDark && styles.customInputDark]}
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyCustomUri}
                >
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.cancelBtn, isDark && styles.cancelBtnDark]}
                onPress={onClose}
              >
                <Text style={[styles.cancelBtnText, isDark && styles.textDark]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalCardDark: {
    backgroundColor: '#1E293B',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 10,
  },
  presetsContainer: {
    paddingVertical: 6,
    gap: 12,
  },
  presetCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    width: 90,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetCardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  presetImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  presetLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  customInputDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    color: '#F8FAFC',
  },
  applyBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnDark: {
    backgroundColor: '#334155',
  },
  cancelBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  textDark: {
    color: '#F8FAFC',
  },
  textMuted: {
    color: '#94A3B8',
  },
});

export default AvatarPickerModal;
