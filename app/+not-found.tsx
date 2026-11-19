import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors, radius, spacing } from '@/theme/theme';

export default function NotFoundScreen() {
  return (
    <ScreenContainer variant="plain">
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.copy}>The page you're looking for doesn't exist or has moved.</Text>
        <Link href="/" style={styles.link}>
          Go to home
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: '20%',
  },
  code: { fontSize: 48, fontWeight: '800', color: colors.primary },
  title: { marginTop: spacing.sm, fontSize: 22, fontWeight: '800', color: colors.ink },
  copy: { marginTop: spacing.sm, fontSize: 14, color: colors.muted, textAlign: 'center' },
  link: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    color: colors.white,
    fontWeight: '700',
  },
});
