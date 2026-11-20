import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ErrorBanner } from '@/components/ErrorBanner';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { HBPlusLogo } from '@/components/HBPlusLogo';
import { SecurityIllustration } from '@/components/SecurityIllustration';
import {
  ALLOWED_EMAIL_DOMAIN,
  LOGIN_SUBTITLE,
  WELCOME_HEADING,
} from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { cardShadow, colors, radius, spacing } from '@/styles/theme';

export function LoginScreenView() {
  const { loading, error, clearError, signIn } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isCompact = width < 520;
  const [hasStarted, setHasStarted] = useState(false);

  const handleSignIn = () => {
    setHasStarted(true);
    void signIn();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop ? styles.scrollDesktop : styles.scrollMobile,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Blue hero panel */}
          <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
            <LinearGradient
              colors={[colors.primaryDeep, '#173A8E', colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />

            <View style={styles.heroContent}>
              <HBPlusLogo size="lg" theme="dark" showSubtitle />

              <View style={styles.heroCopy}>
                <View style={styles.eyebrow}>
                  <MaterialCommunityIcons name="office-building-outline" size={14} color="#BFDBFE" />
                  <Text style={styles.eyebrowText}>HB PLUS SECURE WORKSPACE</Text>
                </View>
                <Text style={[styles.heroHeading, isCompact && styles.heroHeadingCompact]}>
                  {WELCOME_HEADING}
                </Text>
                <Text style={[styles.heroSubtitle, isCompact && styles.heroSubtitleCompact]}>
                  {LOGIN_SUBTITLE}
                </Text>
                <Text style={styles.heroDescription}>
                  A single trusted entry point for your organization. Continue with an official
                  Google account and Firebase will establish your verified session.
                </Text>
              </View>

              <SecurityIllustration />

              <View style={styles.domainPill}>
                <MaterialCommunityIcons name="check-decagram" size={15} color="#BFDBFE" />
                <Text style={styles.domainPillText}>
                  Access restricted to @{ALLOWED_EMAIL_DOMAIN}
                </Text>
              </View>
            </View>
          </View>

          {/* White sign-in panel */}
          <View style={[styles.authPanel, isDesktop && styles.authPanelDesktop]}>
            <View style={[styles.authCard, cardShadow]} testID="auth-card">
              <View style={styles.cardTop}>
                <View style={styles.cardIcon}>
                  <MaterialCommunityIcons name="login" size={24} color={colors.primary} />
                </View>
                <Text style={styles.cardTitle}>Sign in to continue</Text>
                <Text style={styles.cardSubtitle}>
                  Use the Google account connected to HB Plus.
                </Text>
              </View>

              <ErrorBanner message={error} onDismiss={clearError} />

              <GoogleSignInButton onPress={handleSignIn} loading={loading} />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>PROTECTED SIGN-IN</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.securityList}>
                <SecurityRow
                  icon="google"
                  title="Google OAuth 2.0"
                  description="Your identity is verified by Google, never by this app."
                />
                <SecurityRow
                  icon="shield-check-outline"
                  title="Domain verification"
                  description={`Only exact @${ALLOWED_EMAIL_DOMAIN} accounts are accepted.`}
                />
                <SecurityRow
                  icon="lock-outline"
                  title="Managed session"
                  description="Firebase handles tokens; signing out clears your session."
                />
              </View>

              {hasStarted && !error && !loading && (
                <View style={styles.hintRow}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={15}
                    color={colors.muted}
                  />
                  <Text style={styles.hintText}>
                    If the sign-in window did not open, allow pop-ups and try again.
                  </Text>
                </View>
              )}

              <View style={styles.footer}>
                <MaterialCommunityIcons name="lock-check" size={13} color={colors.success} />
                <Text style={styles.footerText}>Secured by Firebase Authentication</Text>
              </View>
            </View>

            <Text style={styles.copyright}>
              © {new Date().getFullYear()} HB Plus. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SecurityRow({
  icon,
  title,
  description,
}: {
  icon: 'google' | 'shield-check-outline' | 'lock-outline';
  title: string;
  description: string;
}) {
  return (
    <View style={styles.securityRow}>
      <View style={styles.securityIcon}>
        <MaterialCommunityIcons name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.securityCopy}>
        <Text style={styles.securityTitle}>{title}</Text>
        <Text style={styles.securityDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  scrollMobile: {
    flexDirection: 'column',
  },
  scrollDesktop: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  hero: {
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    justifyContent: 'center',
  },
  heroDesktop: {
    flex: 1.05,
    minHeight: 720,
    paddingHorizontal: 62,
  },
  heroGlowOne: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(59,130,246,0.18)',
    top: -130,
    right: -90,
  },
  heroGlowTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -110,
    left: -70,
  },
  heroContent: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: spacing.xl,
  },
  heroCopy: {
    gap: spacing.md,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  eyebrowText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.05,
    color: '#DBEAFE',
  },
  heroHeading: {
    fontSize: 40,
    lineHeight: 47,
    fontWeight: '900',
    letterSpacing: -1.1,
    color: '#FFFFFF',
  },
  heroHeadingCompact: {
    fontSize: 32,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#DBEAFE',
  },
  heroSubtitleCompact: {
    fontSize: 16,
    lineHeight: 23,
  },
  heroDescription: {
    fontSize: 14.5,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.76)',
    maxWidth: 490,
  },
  domainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  domainPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EFF6FF',
  },
  authPanel: {
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authPanelDesktop: {
    flex: 0.95,
    paddingHorizontal: 70,
  },
  authCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
  },
  cardTop: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: colors.muted,
  },
  securityList: {
    gap: spacing.md,
  },
  securityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityCopy: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.inkSoft,
  },
  securityDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 2,
  },
  hintRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start',
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSoft,
  },
  hintText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lineLight,
  },
  footerText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.muted,
  },
  copyright: {
    marginTop: spacing.md,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },
});
