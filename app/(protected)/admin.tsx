import { StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RoleBadge } from '@/components/RoleBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ADMIN_EMAILS } from '@/config/app';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, softShadow, spacing } from '@/theme/theme';

export default function AdminScreen() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/login" />;
  // Second layer of protection: the dashboard link is hidden for non-admins,
  // but a typed URL still cannot open this screen.
  if (!isAdmin) return <Redirect href="/dashboard" />;

  return (
    <ScreenContainer variant="plain" maxWidth={880}>
      <StatusBar style="dark" />
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="shield-crown-outline" size={24} color={colors.warning} />
          </View>
          <View>
            <Text style={styles.kicker}>RESTRICTED AREA</Text>
            <Text style={styles.title}>Admin console</Text>
          </View>
        </View>
        <RoleBadge role="admin" />
      </View>

      <Text style={styles.lead}>
        This page is only reachable when the signed-in user has the <Text style={styles.bold}>admin</Text>{' '}
        role stored in Firestore.
      </Text>

      <View style={[styles.panel, softShadow]}>
        <Text style={styles.panelTitle}>Administrators</Text>
        <Text style={styles.panelCopy}>
          Emails listed here receive the admin role when their profile is first created.
        </Text>
        <View style={styles.emailList}>
          {(ADMIN_EMAILS.length ? ADMIN_EMAILS : ['admin@hbplus.fit']).map((email) => (
            <View key={email} style={styles.emailRow}>
              <MaterialCommunityIcons name="account-outline" size={17} color={colors.primary} />
              <Text style={styles.email}>{email}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoPanel}>
        <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
        <Text style={styles.infoText}>
          Role changes must be made in Firestore (or your admin tooling). The client cannot write
          its own role; Firestore rules reject the update.
        </Text>
      </View>

      <Text
        onPress={() => router.back()}
        style={styles.backLink}
        accessibilityRole="link"
      >
        ← Back to dashboard
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.warning,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.ink,
  },
  lead: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: spacing.xl,
  },
  bold: { fontWeight: '800', color: colors.inkSoft },
  panel: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  panelCopy: {
    marginTop: 6,
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  emailList: { gap: spacing.sm },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
  },
  email: { fontSize: 14, color: colors.inkSoft, fontWeight: '600' },
  infoPanel: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.primaryDark,
  },
  backLink: {
    marginTop: spacing.xl,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
