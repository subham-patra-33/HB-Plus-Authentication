import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radius, spacing } from '@/theme/theme';

type Props = {
  message: string | null;
  onDismiss?: () => void;
};

export function ErrorBanner({ message, onDismiss }: Props) {
  if (!message) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={8} accessibilityRole="button" accessibilityLabel="Dismiss error">
          <MaterialCommunityIcons name="close" size={18} color={colors.danger} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerLine,
  },
  text: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.danger,
    fontWeight: '600',
  },
});
