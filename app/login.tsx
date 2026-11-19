import type { ComponentProps } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Redirect } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BrandHeader } from '@/components/BrandHeader';
import { ErrorBanner } from '@/components/ErrorBanner';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ALLOWED_EMAIL_DOMAIN } from '@/config/app';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, softShadow, spacing } from '@/theme/theme';

export default function LoginScreen() {
  const { user, loading, error, clearError, signIn } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 720;

  if (!loading && user) return <Redirect href="/dashboard" />;

  return (
    <ScreenContainer maxWidth={wide ? 1120 : undefined}>
      <View style={[styles.layout, wide && styles.layoutWide]}>
        <View style={styles.hero}>
          <BrandHeader
            iconColor="#FFFFFF"
            titleColor="#FFFFFF"
            subtitleColor="rgba(255,255,255,0.7)"
          />
          <Text style={styles.heroTitle}>Your team, in one secure place.</Text>
          <Text style={styles.heroCopy}>
            Access your HB Plus workspace with your organization Google account.
            Personal email addresses are not accepted.
          </Text>
          <View style={styles.heroPoints}>
            <HeroPoint icon="lock-outline" text="Google OAuth 2.0 secured sign-in" />
            <HeroPoint icon="domain" text={`Only @${ALLOWED_EMAIL_DOMAIN} accounts`} />
            <HeroPoint icon="shield-check-outline" text="Role-aware, protected dashboard" />
          </View>
        </View>

        <View style={[styles.card, softShadow]}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name="shield-lock-outline" size={26} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Sign in to continue</Text>
          <Text style={styles.cardSubtitle}>
            Use your official @{ALLOWED_EMAIL_DOMAIN} email address.
          </Text>

          <View style={styles.errorSlot}>
            <ErrorBanner message={error} onDismiss={clearError} />
          </View>

          <GoogleSignInButton
            onPress={() => void signIn()}
            loading={loading && !user}
          />

          <View style={styles.secureRow}>
            <MaterialCommunityIcons name="security" size={14} color={colors.muted} />
            <Text style={styles.secureText}>Protected by Firebase Authentication</Text>
          </View>

          <View style={styles.notice}>
            <MaterialCommunityIcons name="information-outline" size={17} color={colors.primary} />
            <Text style={styles.noticeText}>
              Access is restricted to verified {ALLOWED_EMAIL_DOMAIN} accounts. Other domains
              will be signed out immediately.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>© {new Date().getFullYear()} HB Plus · Secure Access</Text>
    </ScreenContainer>
  );
}

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function HeroPoint({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.pointRow}>
      <View style={styles.pointIcon}>
        <MaterialCommunityIcons name={icon} size={16} color="#FFFFFF" />
      </View>
      <Text style={styles.pointText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: spacing.xl,
  },
  layoutWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxl,
  },
  hero: {
    flex: 1,
  },
  heroTitle: {
    marginTop: spacing.xl,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroCopy: {
    marginTop: spacing.md,
    fontSize: 16,
    lineHeight: 25,
    color: 'rgba(255,255,255,0.8)',
    maxWidth: 460,
  },
  heroPoints: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  pointIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  pointText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
  },
  errorSlot: {
    marginTop: spacing.sm,
    minHeight: 1,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  secureText: {
    fontSize: 12,
    color: colors.muted,
  },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.inkSoft,
  },
  footer: {
    marginTop: spacing.xl,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
  },
});
