import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

// Clean unicode and symbol glyphs for 100% offline and cross-platform compatibility
// No dependency on native fonts or expo-font
const GLYPH_MAP = {
  // Navigation & Actions
  'menu': '☰',
  'menu-outline': '☰',
  'arrow-back': '←',
  'chevron-back': '‹',
  'chevron-forward': '›',
  'chevron-down': '▼',
  'chevron-up': '▲',
  'close': '✕',
  'close-circle': '⊗',
  'checkmark': '✓',
  'checkmark-circle': '✓',
  'checkmark-done': '✓✓',
  'add': '+',
  'add-circle': '⊕',
  'remove-circle': '⊖',
  'trash': '🗑',
  'search': '🔍',
  'refresh': '↻',

  // Work & Dashboard
  'grid': '⊞',
  'grid-outline': '⊞',
  'apps': '⊞',
  'briefcase': '💼',
  'briefcase-outline': '💼',
  'business': '🏢',
  'location': '📍',
  'location-outline': '📍',
  'pin': '📍',
  'map': '🗺',
  'calendar': '📅',
  'calendar-outline': '📅',
  'time': '🕒',
  'time-outline': '🕒',

  // Security & Users
  'shield-checkmark': '🛡',
  'lock-closed': '🔒',
  'lock-closed-outline': '🔒',
  'lock-open': '🔓',
  'eye': '👁',
  'eye-off': '👁‍🗨',
  'person': '👤',
  'person-outline': '👤',
  'people': '👥',
  'people-outline': '👥',

  // Money & Payroll
  'cash': '💵',
  'cash-outline': '💵',
  'wallet': '👛',
  'card': '💳',

  // Tickets, Tasks & Alerts
  'ticket': '🎫',
  'ticket-outline': '🎫',
  'chatbubble-ellipses': '💬',
  'alert-triangle': '⚠️',
  'alert-circle': '⚠️',
  'warning': '⚠️',
  'checkmark-circle-outline': '✓',
  'notifications': '🔔',
  'notifications-outline': '🔔',
  'flag': '🚩',
  'camera': '📷',
  'log-out': '⎋',
  'settings': '⚙',
  'document-text': '📄',
};

export const Icon = ({ name, size = 18, color = '#1E293B', style }) => {
  const glyph = GLYPH_MAP[name] || '•';

  return (
    <View style={[styles.container, { width: size + 4, height: size + 4 }, style]}>
      <Text
        style={[
          styles.glyph,
          {
            fontSize: size * 0.9,
            color,
            lineHeight: size + 2,
          },
        ]}
      >
        {glyph}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyph: {
    textAlign: 'center',
  },
});

export default Icon;
