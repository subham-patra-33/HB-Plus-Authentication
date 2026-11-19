import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, softShadow, spacing } from '@/theme/theme';

type Props = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GoogleSignInButton({ onPress, loading = false, disabled = false }: Props) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      android_ripple={{ color: colors.line }}
      style={({ pressed }) => [
        styles.button,
        softShadow,
        pressed && !inactive && styles.pressed,
        inactive && styles.inactive,
      ]}
    >
      <View style={styles.mark}>
        <Text style={styles.g}>G</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <Text style={styles.label}>Continue with Google</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
  inactive: {
    opacity: 0.7,
  },
  mark: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  g: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4285F4',
    lineHeight: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
});
