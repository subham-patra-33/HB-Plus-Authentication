import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RoleBadge } from '@/components/RoleBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAuth } from '@/context/AuthContext';
import { fetchAllUsers, type UserProfile } from '@/services/profile.service';
import { colors, radius, softShadow, spacing } from '@/theme/theme';

export default function AdminScreen() {
  const { user, isAdmin, loading } = useAuth();
  const { width } = useWindowDimensions();
  const wide = width >= 768;

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    let active = true;
    if (isAdmin) {
      setLoadingUsers(true);
      fetchAllUsers()
        .then((profiles) => {
          if (active) setUsersList(profiles);
        })
        .finally(() => {
          if (active) setLoadingUsers(false);
        });
    }
    return () => {
      active = false;
    };
  }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Redirect href="/login" />;
  // Second layer of protection: the dashboard link is hidden for non-admins,
  // but a typed URL still cannot open this screen.
  if (!isAdmin) return <Redirect href="/dashboard" />;

  const totalUsers = usersList.length;
  const adminCount = usersList.filter((u) => u.role === 'admin').length;
  const standardCount = totalUsers - adminCount;

  return (
    <ScreenContainer variant="plain" maxWidth={960}>
      <StatusBar style="dark" />
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <View style={styles.icon}>
            <MaterialCommunityIcons name="shield-crown-outline" size={24} color={colors.warning} />
          </View>
          <View>
            <Text style={styles.kicker}>RESTRICTED AREA</Text>
            <Text style={styles.title}>Admin Console</Text>
          </View>
        </View>
        <RoleBadge role="admin" />
      </View>

      <Text style={styles.lead}>
        Welcome, <Text style={styles.bold}>{user.profile.displayName}</Text>. You have administrative privileges
        over workspace authentication, user records, and application security policies.
      </Text>

      {/* Application Statistics */}
      <View style={[styles.statRow, wide && styles.statRowWide]}>
        <View style={[styles.statCard, softShadow]}>
          <MaterialCommunityIcons name="account-group" size={22} color={colors.primary} />
          <Text style={styles.statLabel}>Registered Users</Text>
          <Text style={styles.statNumber}>{loadingUsers ? '...' : totalUsers || '1+'}</Text>
          <Text style={styles.statSub}>Firestore Directory</Text>
        </View>
        <View style={[styles.statCard, softShadow]}>
          <MaterialCommunityIcons name="shield-crown" size={22} color={colors.warning} />
          <Text style={styles.statLabel}>Admins</Text>
          <Text style={styles.statNumber}>{loadingUsers ? '...' : adminCount || '1'}</Text>
          <Text style={styles.statSub}>Role: admin</Text>
        </View>
        <View style={[styles.statCard, softShadow]}>
          <MaterialCommunityIcons name="account" size={22} color={colors.success} />
          <Text style={styles.statLabel}>Standard Users</Text>
          <Text style={styles.statNumber}>{loadingUsers ? '...' : standardCount}</Text>
          <Text style={styles.statSub}>Role: user</Text>
        </View>
      </View>

      {/* User Management Overview */}
      <View style={[styles.panel, softShadow]}>
        <View style={styles.panelHeaderRow}>
          <View>
            <Text style={styles.panelTitle}>User Management Overview</Text>
            <Text style={styles.panelCopy}>
              Workspace users registered in Firestore with verified domain authentication.
            </Text>
          </View>
          {loadingUsers && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        {usersList.length === 0 && !loadingUsers ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Current signed-in user is registered as admin:</Text>
            <View style={styles.userRow}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarLetter}>
                  {user.profile.displayName[0]?.toUpperCase() ?? 'A'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.profile.displayName}</Text>
                <Text style={styles.userEmail}>{user.profile.email}</Text>
              </View>
              <RoleBadge role={user.profile.role} />
            </View>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: '100%', minWidth: 500, gap: spacing.sm }}>
              {usersList.map((usr) => (
                <View key={usr.uid} style={styles.userRow}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.avatarLetter}>
                      {usr.displayName[0]?.toUpperCase() ?? 'U'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{usr.displayName}</Text>
                    <Text style={styles.userEmail}>{usr.email}</Text>
                  </View>
                  <RoleBadge role={usr.role} />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Trusted role source */}
      <View style={[styles.panel, softShadow, { marginTop: spacing.lg }]}>
        <Text style={styles.panelTitle}>Role Authorization Source</Text>
        <Text style={styles.panelCopy}>
          Administrator access is never read from a client-side list. It comes only from a trusted
          Firestore user record or a Firebase custom claim.
        </Text>
        <View style={styles.emailList}>
          <View style={styles.emailRow}>
            <MaterialCommunityIcons name="database-lock-outline" size={17} color={colors.primary} />
            <Text style={styles.email}>users/{'{uid}'}.role = "admin"</Text>
          </View>
          <View style={styles.emailRow}>
            <MaterialCommunityIcons name="badge-account-outline" size={17} color={colors.primary} />
            <Text style={styles.email}>Firebase custom claim: admin = true</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoPanel}>
        <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
        <Text style={styles.infoText}>
          Firestore rules verify the exact @hbplus.fit domain on every read and write. New accounts
          start as "user"; promotion requires an authorized admin or server-side claim update.
        </Text>
      </View>

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={16} color={colors.primary} />
        <Text style={styles.backLink}>Back to dashboard</Text>
      </Pressable>
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
  statRow: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statRowWide: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
  },
  statSub: {
    fontSize: 12,
    color: colors.muted,
  },
  panel: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  panelCopy: {
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
  emptyWrap: {
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  userEmail: {
    fontSize: 12.5,
    color: colors.muted,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xl,
    alignSelf: 'flex-start',
  },
  backLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

