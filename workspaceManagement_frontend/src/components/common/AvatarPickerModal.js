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
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { IMAGES, getAvatarSource } from '../../assets/images';
import Icon from './Icon';

// Role-neutral avatar portrait styles
const PORTRAIT_PRESETS = [
  { id: 'p1', name: 'Studio Casual', image: IMAGES.dpEmpAli, tag: 'Modern', color: '#4338CA' },
  { id: 'p2', name: 'Tech Engineer', image: IMAGES.dpEmpHamza, tag: 'Engineering', color: '#2563EB' },
  { id: 'p3', name: 'Executive Blue', image: IMAGES.dpMgrBilal, tag: 'Professional', color: '#1D4ED8' },
  { id: 'p4', name: 'Corporate Teal', image: IMAGES.dpHrSana, tag: 'Business', color: '#0F766E' },
  { id: 'p5', name: 'Executive Formal', image: IMAGES.dpAdminUsman, tag: 'Executive', color: '#1E293B' },
  { id: 'p6', name: 'Partner Profile', image: IMAGES.dpClientZafar, tag: 'Creative', color: '#92400E' },
];

// Simulated Device Photo Gallery items (simulating picking from phone camera roll / gallery)
const DEVICE_GALLERY_PHOTOS = [
  { id: 'gal_1', label: 'Camera Roll • Oct 18', image: IMAGES.dpEmpAli, desc: 'Original Portrait' },
  { id: 'gal_2', label: 'Camera Roll • Campus Photo', image: IMAGES.dpEmpHamza, desc: 'Campus Headshot' },
  { id: 'gal_3', label: 'Downloads • Corporate Photo', image: IMAGES.dpMgrBilal, desc: 'Studio Shot' },
  { id: 'gal_4', label: 'Photos • Profile 2026', image: IMAGES.dpHrSana, desc: 'Casual Light' },
];

export const AvatarPickerModal = ({
  visible,
  onClose,
  onSelectAvatar,
  currentAvatar,
  title = 'Change Profile Picture',
}) => {
  const { isDark } = useTheme();
  const [customUri, setCustomUri] = useState('');
  const [selectedKey, setSelectedKey] = useState(currentAvatar || IMAGES.dpEmpAli);
  const [activeTab, setActiveTab] = useState('GALLERY'); // 'GALLERY' | 'PRESETS' | 'URL'

  const handleSelectImage = (img) => {
    setSelectedKey(img);
    if (onSelectAvatar) {
      onSelectAvatar(img);
    }
    Alert.alert('Profile Picture Updated', 'Your profile picture has been successfully updated.');
    onClose();
  };

  const handleApplyCustomUri = () => {
    if (customUri.trim()) {
      handleSelectImage(customUri.trim());
      setCustomUri('');
    } else {
      Alert.alert('Invalid URL', 'Please enter a valid image URL.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalCard, isDark && styles.modalCardDark]}>
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <Icon name="camera" size={20} color={isDark ? '#F8FAFC' : '#0F172A'} />
                  <Text style={[styles.modalTitle, isDark && styles.textDark]}>{title}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Icon name="close" size={20} color={isDark ? '#E2E8F0' : '#475569'} />
                </TouchableOpacity>
              </View>

              {/* Mode Tabs */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === 'GALLERY' && styles.tabBtnActive,
                    isDark && styles.tabBtnDark,
                    activeTab === 'GALLERY' && isDark && styles.tabBtnActiveDark,
                  ]}
                  onPress={() => setActiveTab('GALLERY')}
                >
                  <Icon
                    name="images"
                    size={14}
                    color={activeTab === 'GALLERY' ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.tabBtnText,
                      activeTab === 'GALLERY' && styles.tabBtnTextActive,
                      isDark && !activeTab === 'GALLERY' && styles.textMuted,
                    ]}
                  >
                    Device Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === 'PRESETS' && styles.tabBtnActive,
                    isDark && styles.tabBtnDark,
                    activeTab === 'PRESETS' && isDark && styles.tabBtnActiveDark,
                  ]}
                  onPress={() => setActiveTab('PRESETS')}
                >
                  <Icon
                    name="person-circle"
                    size={14}
                    color={activeTab === 'PRESETS' ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.tabBtnText,
                      activeTab === 'PRESETS' && styles.tabBtnTextActive,
                    ]}
                  >
                    Avatar Styles
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    activeTab === 'URL' && styles.tabBtnActive,
                    isDark && styles.tabBtnDark,
                    activeTab === 'URL' && isDark && styles.tabBtnActiveDark,
                  ]}
                  onPress={() => setActiveTab('URL')}
                >
                  <Icon
                    name="link"
                    size={14}
                    color={activeTab === 'URL' ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.tabBtnText,
                      activeTab === 'URL' && styles.tabBtnTextActive,
                    ]}
                  >
                    Image URL
                  </Text>
                </TouchableOpacity>
              </View>

              {/* TAB 1: Device Gallery Simulator */}
              {activeTab === 'GALLERY' && (
                <View style={styles.tabContent}>
                  <Text style={[styles.sectionSubtitle, isDark && styles.textMuted]}>
                    Select photo from device photo album:
                  </Text>
                  <View style={styles.galleryGrid}>
                    {DEVICE_GALLERY_PHOTOS.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.galleryItemCard, isDark && styles.galleryItemCardDark]}
                        onPress={() => handleSelectImage(item.image)}
                        activeOpacity={0.8}
                      >
                        <Image source={item.image} style={styles.galleryThumb} />
                        <View style={styles.galleryMeta}>
                          <Text style={[styles.galleryItemLabel, isDark && styles.textDark]} numberOfLines={1}>
                            {item.desc}
                          </Text>
                          <Text style={styles.galleryItemSub}>{item.label}</Text>
                        </View>
                        <View style={styles.gallerySelectBtn}>
                          <Icon name="checkmark" size={13} color="#FFFFFF" />
                          <Text style={styles.gallerySelectText}>Choose</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 2: Avatar Styles */}
              {activeTab === 'PRESETS' && (
                <View style={styles.tabContent}>
                  <Text style={[styles.sectionSubtitle, isDark && styles.textMuted]}>
                    Choose from professionally tailored avatar styles:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetsContainer}
                  >
                    {PORTRAIT_PRESETS.map((preset) => (
                      <TouchableOpacity
                        key={preset.id}
                        style={[
                          styles.presetCard,
                          isDark && styles.presetCardDark,
                          selectedKey === preset.image && { borderColor: preset.color, borderWidth: 2 },
                        ]}
                        onPress={() => handleSelectImage(preset.image)}
                        activeOpacity={0.8}
                      >
                        <Image source={preset.image} style={styles.presetImage} />
                        <View style={[styles.styleBadge, { backgroundColor: preset.color }]}>
                          <Text style={styles.styleBadgeText}>{preset.tag}</Text>
                        </View>
                        <Text style={[styles.presetLabel, isDark && styles.textDark]} numberOfLines={1}>
                          {preset.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* TAB 3: Custom URL */}
              {activeTab === 'URL' && (
                <View style={styles.tabContent}>
                  <Text style={[styles.sectionSubtitle, isDark && styles.textMuted]}>
                    Provide direct web URL or image endpoint:
                  </Text>
                  <View style={styles.customInputRow}>
                    <TextInput
                      value={customUri}
                      onChangeText={setCustomUri}
                      placeholder="https://example.com/my-photo.jpg"
                      placeholderTextColor="#94A3B8"
                      style={[styles.customInput, isDark && styles.customInputDark]}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity style={styles.applyBtn} onPress={handleApplyCustomUri}>
                      <Text style={styles.applyBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Cancel Button */}
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
    padding: 16,
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
    marginBottom: 14,
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 7,
    gap: 5,
  },
  tabBtnDark: {
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: '#1E293B',
  },
  tabBtnActiveDark: {
    backgroundColor: '#0F172A',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 10,
  },
  galleryGrid: {
    gap: 8,
  },
  galleryItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  galleryItemCardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  galleryThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  galleryMeta: {
    flex: 1,
  },
  galleryItemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  galleryItemSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  gallerySelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  gallerySelectText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  presetsContainer: {
    paddingVertical: 6,
    gap: 10,
  },
  presetCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    width: 96,
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
  styleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  styleBadgeText: {
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
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
