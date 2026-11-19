import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { UserRole } from '@/services/profile.service';
import { colors, radius } from '@/theme/theme';

export function RoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role === 'admin';
  return (
    <View style={[styles.badge, { backgroundColor: isAdmin ? colors.warningBg : colors.successBg }]}>
      <MaterialCommunityIcons
        name={isAdmin ? 'shield-crown-outline' : 'account-outline'}
        size={14}
        color={isAdmin ? colors.warning : colors.success}
      />
      <Text style={[styles.label, { color: isAdmin ? colors.warning : colors.success }]}>
        {isAdmin ? 'Admin' : 'User'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
