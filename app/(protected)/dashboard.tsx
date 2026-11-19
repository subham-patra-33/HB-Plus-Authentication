import type { ComponentProps } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BrandHeader } from '@/components/BrandHeader';
import { ErrorBanner } from '@/components/ErrorBanner';
import { RoleBadge } from '@/components/RoleBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ALLOWED_EMAIL_DOMAIN } from '@/config/app';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, softShadow, spacing } from '@/theme/theme';

function initials(name: string): string {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function DashboardScreen() {
  const { user, isAdmin, error, clearError, logout } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 860;

  if (!user) return null; // The protected layout handles the redirect.
  const { profile } = user;
  const firstName = profile.displayName.split(' ')[0] || 'there';

  return (
    <ScreenContainer variant="plain" maxWidth={1120}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BrandHeader compact />
        <Pressable
          onPress={() => void logout()}
          accessibilityRole="button"
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="logout" size={17} color={colors.inkSoft} />
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.intro}>
        <Text style={styles.greeting}>Welcome back, {firstName} 👋</Text>
        <Text style={styles.introCopy}>
          You're signed in with your verified {ALLOWED_EMAIL_DOMAIN} account. Here's an
          overview of your workspace access.
        </Text>
      </View>

      <ErrorBanner message={error} onDismiss={clearError} />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          {profile.photoURL ? (
            <Image source={{ uri: profile.photoURL }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials(profile.displayName)}</Text>
          )}
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.displayName}
            </Text>
            <RoleBadge role={profile.role} />
          </View>
          <Text style={styles.email} numberOfLines={1}>
            {profile.email}
          </Text>
          <View style={styles.verifiedRow}>
            <MaterialCommunityIcons name="check-decagram" size={15} color={colors.success} />
            <Text style={styles.verifiedText}>Domain verified · Google account</Text>
          </View>
        </View>
      </View>

      <View style={[styles.statGrid, wide ? styles.statGridWide : styles.statGridNarrow]}>
        <StatCard
          icon="shield-check-outline"
          tint={colors.success}
          bg={colors.successBg}
          label="Access status"
          value="Active"
          detail="Authorized member"
        />
        <StatCard
          icon="domain"
          tint={colors.primary}
          bg={colors.primaryLight}
          label="Organization domain"
          value={`@${ALLOWED_EMAIL_DOMAIN}`}
          detail="Exact domain match"
        />
        <StatCard
          icon="account-key-outline"
          tint={isAdmin ? colors.warning : colors.inkSoft}
          bg={isAdmin ? colors.warningBg : colors.surfaceSoft}
          label="Access level"
          value={isAdmin ? 'Administrator' : 'Standard user'}
          detail={isAdmin ? 'Full workspace access' : 'Dashboard access'}
        />
      </View>

      {isAdmin && (
        <Pressable
          onPress={() => router.push('/admin')}
          style={({ pressed }) => [styles.adminBanner, pressed && styles.pressed]}
        >
          <View style={styles.adminIcon}>
            <MaterialCommunityIcons name="shield-crown-outline" size={22} color={colors.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>Administrator console</Text>
            <Text style={styles.adminCopy}>
              You have elevated privileges. Open the admin-only area.
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
        </Pressable>
      )}

      <View style={styles.sessionCard}>
        <MaterialCommunityIcons name="lock-outline" size={18} color={colors.muted} />
        <Text style={styles.sessionText}>
          Session tokens are issued and refreshed by Firebase. Signing out clears them from this
          device.
        </Text>
      </View>
    </ScreenContainer>
  );
}

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function StatCard({
  icon,
  tint,
  bg,
  label,
  value,
  detail,
}: {
  icon: IconName;
  tint: string;
  bg: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={[styles.statCard, softShadow]}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statDetail}>{detail}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  pressed: { opacity: 0.75 },
  intro: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.6,
  },
  introCopy: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    maxWidth: 640,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 58, height: 58 },
  avatarText: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  profileInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  email: {
    marginTop: 3,
    fontSize: 13.5,
    color: colors.muted,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  statGrid: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statGridWide: { flexDirection: 'row' },
  statGridNarrow: { flexDirection: 'column' },
  statCard: {
    flex: 1,
    minWidth: 0,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statValue: {
    marginTop: 6,
    fontSize: 19,
    fontWeight: '800',
    color: colors.ink,
  },
  statDetail: {
    marginTop: 4,
    fontSize: 12.5,
    color: colors.muted,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: spacing.lg,
  },
  adminIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  adminCopy: {
    marginTop: 3,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  sessionCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    padding: spacing.md,
  },
  sessionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
});
