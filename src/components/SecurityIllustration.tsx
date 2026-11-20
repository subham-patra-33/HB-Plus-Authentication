import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ALLOWED_EMAIL_DOMAIN } from '@/constants';
import { spacing } from '@/styles/theme';

export function SecurityIllustration() {
  const { width } = useWindowDimensions();
  const compact = width < 520;

  const features = [
    { icon: 'shield-check-outline', label: 'Google OAuth 2.0 identity verification' },
    { icon: 'domain', label: `Exact @${ALLOWED_EMAIL_DOMAIN} domain enforcement` },
    { icon: 'database-lock-outline', label: 'Firestore-backed role protection' },
  ] as const;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.orbitOuter}>
        <View style={styles.orbitMiddle}>
          <View style={styles.orbitInner}>
            <MaterialCommunityIcons name="shield-lock-outline" size={30} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={[styles.features, compact && styles.featuresCompact]}>
        {features.map((feature) => (
          <View key={feature.label} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <MaterialCommunityIcons name={feature.icon} size={16} color="#BFDBFE" />
            </View>
            <Text style={[styles.featureText, compact && styles.featureTextCompact]}>
              {feature.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  containerCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  orbitOuter: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitMiddle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  features: {
    flex: 1,
    gap: spacing.sm,
  },
  featuresCompact: {
    alignSelf: 'stretch',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  featureTextCompact: {
    fontSize: 12.5,
  },
});
