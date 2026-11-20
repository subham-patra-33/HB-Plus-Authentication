import type { ComponentProps } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ErrorBanner } from '@/components/ErrorBanner';
import { HBPlusLogo } from '@/components/HBPlusLogo';
import { RoleBadge } from '@/components/RoleBadge';
import { ALLOWED_EMAIL_DOMAIN, APP_NAME } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { cardShadow, colors, radius, softShadow, spacing } from '@/styles/theme';

function getInitials(name: string): string {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatMemberSince(createdAt: { toDate: () => Date } | null): string {
  if (!createdAt) return 'Just now';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(createdAt.toDate());
  } catch {
    return 'Recently';
  }
}

export function DashboardScreenView() {
  const { user, isAdmin, error, clearError, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  if (!user) return null;
  const { profile } = user;
  const firstName = profile.displayName.split(' ')[0] || 'User';

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Top Application Bar */}
      <View style={styles.topBar}>
        <HBPlusLogo size="sm" showSubtitle={isDesktop} />

        <View style={styles.topBarRight}>
          <View style={styles.domainIndicator}>
            <View style={styles.domainDot} />
            <Text style={styles.domainText}>@{ALLOWED_EMAIL_DOMAIN}</Text>
          </View>

          {/* Stable Sign out Button with rock-solid icon (no flicker/twinkle) */}
          <Pressable
            onPress={() => void logout()}
            accessibilityRole="button"
            accessibilityLabel="Sign out of HB Plus"
            style={({ pressed }) => [styles.signoutButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="logout-variant" size={18} color={colors.danger} />
            <Text style={styles.signoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Workspace: Sidebar + Content on Desktop */}
      <View style={[styles.workspaceLayout, isDesktop ? styles.desktopWorkspace : styles.mobileWorkspace]}>
        {/* Sidebar Navigation on Desktop */}
        {isDesktop && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>NAVIGATION</Text>
              <View style={[styles.navItem, styles.navItemActive]}>
                <MaterialCommunityIcons name="view-dashboard" size={19} color={colors.primary} />
                <Text style={styles.navTextActive}>Overview</Text>
              </View>
              {isAdmin && (
                <Pressable
                  onPress={() => router.push('/admin')}
                  style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
                >
                  <MaterialCommunityIcons name="shield-account" size={19} color={colors.warning} />
                  <Text style={styles.navText}>Admin Console</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.sidebarFooter}>
              <View style={styles.sidebarSecurityCard}>
                <MaterialCommunityIcons name="lock" size={16} color={colors.success} />
                <Text style={styles.sidebarSecurityText}>Session Encrypted</Text>
              </View>
            </View>
          </View>
        )}

        {/* Content Pane */}
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <Text style={styles.greetingTitle}>Welcome, {firstName}!</Text>
            <Text style={styles.greetingSub}>
              Your HB Plus organization account is verified and active under{' '}
              <Text style={styles.boldText}>@{ALLOWED_EMAIL_DOMAIN}</Text>.
            </Text>
          </View>

          <ErrorBanner message={error} onDismiss={clearError} />

          {/* User Profile Card */}
          <View style={[styles.profileCard, softShadow]}>
            <View style={styles.avatarContainer}>
              {profile.photoURL ? (
                <Image source={{ uri: profile.photoURL }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(profile.displayName)}</Text>
              )}
            </View>
            <View style={styles.profileDetails}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile.displayName}
                </Text>
                <RoleBadge role={profile.role} />
              </View>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {profile.email}
              </Text>
              <View style={styles.accountMetaRow}>
                <MaterialCommunityIcons name="calendar-outline" size={13} color={colors.muted} />
                <Text style={styles.accountMetaText}>
                  Member since {formatMemberSince(profile.createdAt)}
                </Text>
              </View>
              <View style={styles.authVerifiedRow}>
                <MaterialCommunityIcons name="check-decagram" size={16} color={colors.success} />
                <Text style={styles.authVerifiedText}>Google OAuth Verified Identity</Text>
              </View>
            </View>
          </View>

          {/* Structured Statistics Metric Cards */}
          <View style={[styles.metricsGrid, isDesktop ? styles.metricsRow : styles.metricsColumn]}>
            <MetricCard
              icon="shield-check"
              iconColor={colors.success}
              iconBg={colors.successBg}
              label="Authentication Status"
              value="Authorized"
              detail="Domain policy compliant"
            />
            <MetricCard
              icon="domain"
              iconColor={colors.primary}
              iconBg={colors.primaryLight}
              label="Organization Account"
              value={`@${ALLOWED_EMAIL_DOMAIN}`}
              detail="Enterprise directory member"
            />
            <MetricCard
              icon="account-badge"
              iconColor={isAdmin ? colors.warning : colors.inkSoft}
              iconBg={isAdmin ? colors.warningBg : colors.surfaceSoft}
              label="Assigned Role"
              value={isAdmin ? 'Administrator' : 'Standard User'}
              detail={isAdmin ? 'Full governance access' : 'Workspace member access'}
            />
          </View>

          {/* Admin Banner (Visible if admin) */}
          {isAdmin && (
            <Pressable
              onPress={() => router.push('/admin')}
              style={({ pressed }) => [styles.adminActionBanner, softShadow, pressed && styles.pressed]}
            >
              <View style={styles.adminIconWrap}>
                <MaterialCommunityIcons name="shield-crown" size={24} color={colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminBannerTitle}>Administrator Console</Text>
                <Text style={styles.adminBannerDesc}>
                  You hold elevated administrative privileges. Click to inspect users and manage role policies.
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>
          )}

          {/* Token Security Explanation */}
          <View style={styles.securityAuditBox}>
            <MaterialCommunityIcons name="shield-key-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.auditTitle}>Security & Session Token Lifecycle</Text>
              <Text style={styles.auditText}>
                Your session is authenticated via Firebase Auth tokens, refreshed dynamically in the background.
                Signing out revokes cached credentials on this device.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function MetricCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  detail,
}: {
  icon: IconName;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={[styles.metricCard, softShadow]}>
      <View style={[styles.metricIconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  topBar: {
    height: 64,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  domainIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  domainDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  domainText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  signoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  signoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
  pressed: {
    opacity: 0.8,
  },
  workspaceLayout: {
    flex: 1,
  },
  desktopWorkspace: {
    flexDirection: 'row',
  },
  mobileWorkspace: {
    flexDirection: 'column',
  },
  sidebar: {
    width: 240,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  sidebarSection: {
    gap: spacing.xs,
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  navItemActive: {
    backgroundColor: colors.primaryLight,
  },
  navTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  sidebarFooter: {
    paddingTop: spacing.md,
  },
  sidebarSecurityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: spacing.sm,
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sidebarSecurityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  contentContainer: {
    padding: spacing.xl,
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.lg,
  },
  welcomeBanner: {
    marginBottom: spacing.xs,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  greetingSub: {
    fontSize: 14.5,
    color: colors.muted,
    marginTop: 4,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  profileDetails: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  profileName: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.ink,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 3,
  },
  accountMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  accountMetaText: {
    fontSize: 12,
    color: colors.muted,
  },
  authVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  authVerifiedText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.success,
  },
  metricsGrid: {
    gap: spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metricsColumn: {
    flexDirection: 'column',
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  metricIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 6,
  },
  metricDetail: {
    fontSize: 12.5,
    color: colors.muted,
    marginTop: 4,
  },
  adminActionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  adminIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  adminBannerDesc: {
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 3,
  },
  securityAuditBox: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  auditTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  auditText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: 2,
  },
});
