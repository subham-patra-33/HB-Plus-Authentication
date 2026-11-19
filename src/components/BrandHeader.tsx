import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '@/theme/theme';

type Props = {
  compact?: boolean;
  iconColor?: string;
  titleColor?: string;
  subtitleColor?: string;
};

export function BrandHeader({
  compact = false,
  iconColor = colors.primary,
  titleColor = colors.ink,
  subtitleColor = colors.muted,
}: Props) {
  return (
    <View style={[styles.root, compact && styles.compact]}>
      <View style={[styles.iconWrap, compact && styles.iconWrapCompact]}>
        <MaterialCommunityIcons name="shield-check" size={compact ? 22 : 30} color={iconColor} />
      </View>
      <View>
        <Text style={[styles.title, compact && styles.titleCompact, { color: titleColor }]}>
          HB Plus
        </Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>SECURE WORKSPACE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  compact: {
    gap: spacing.sm,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapCompact: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleCompact: {
    fontSize: 19,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginTop: 2,
  },
});
