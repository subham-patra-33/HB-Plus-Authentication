import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ACCESS_RESTRICTED_MESSAGE, ALLOWED_EMAIL_DOMAIN, APP_NAME } from '@/constants';
import { cardShadow, colors, radius, softShadow, spacing } from '@/styles/theme';

interface AccessDeniedScreenProps {
  onReturnToLogin?: () => void;
}

export function AccessDeniedScreenView({ onReturnToLogin }: AccessDeniedScreenProps) {
  const handleReturn = () => {
    if (onReturnToLogin) {
      onReturnToLogin();
    } else {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.topAccentBar} />

      <View style={[styles.card, cardShadow]}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="shield-alert-outline" size={38} color={colors.danger} />
        </View>

        <View style={styles.badge}>
          <MaterialCommunityIcons name="lock" size={13} color={colors.danger} />
          <Text style={styles.badgeText}>UNAUTHORIZED DOMAIN</Text>
        </View>

        <Text style={styles.title}>Access Denied</Text>

        <View style={styles.messageBox}>
          <Text style={styles.requiredMessage}>
            "{ACCESS_RESTRICTED_MESSAGE}"
          </Text>
        </View>

        <Text style={styles.explanationText}>
          {APP_NAME} boundary protection rejected your Google account. Single Sign-On is strictly
          enforced and limited to authorized corporate credentials ending in{' '}
          <Text style={styles.domainHighlight}>@{ALLOWED_EMAIL_DOMAIN}</Text>.
        </Text>

        <View style={styles.divider} />

        <Pressable
          onPress={handleReturn}
          accessibilityRole="button"
          accessibilityLabel="Return to HB Plus login"
          style={({ pressed }) => [
            styles.returnButton,
            softShadow,
            pressed && styles.buttonPressed,
          ]}
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={styles.returnButtonText}>Return to Login</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          If you believe this is an error, please contact your IT workspace administrator.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.danger,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.dangerBg,
    borderWidth: 1.5,
    borderColor: colors.dangerLine,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerLine,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  messageBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginVertical: spacing.sm,
  },
  requiredMessage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    lineHeight: 20,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  domainHighlight: {
    fontWeight: '700',
    color: colors.ink,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing.lg,
  },
  returnButton: {
    width: '100%',
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  returnButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 11.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
