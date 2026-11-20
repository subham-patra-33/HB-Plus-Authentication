import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/styles/theme';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  /** `dark` is for blue/dark backgrounds; `light` is for white surfaces. */
  theme?: 'light' | 'dark';
};

export function HBPlusLogo({
  size = 'md',
  showSubtitle = false,
  theme = 'light',
}: Props) {
  const isDark = theme === 'dark';
  const markSize = size === 'sm' ? 34 : size === 'lg' ? 52 : 42;
  const titleSize = size === 'sm' ? 16 : size === 'lg' ? 26 : 20;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mark,
          {
            width: markSize,
            height: markSize,
            borderRadius: radius.md,
            backgroundColor: isDark ? 'rgba(255,255,255,0.16)' : colors.primary,
            borderColor: isDark ? 'rgba(255,255,255,0.38)' : colors.primaryDark,
          },
        ]}
      >
        <Text style={[styles.monogram, { fontSize: markSize * 0.36, color: '#FFFFFF' }]}>
          HB
        </Text>
        <View
          style={[
            styles.plusDot,
            { backgroundColor: isDark ? '#93C5FD' : '#BFDBFE' },
          ]}
        >
          <Text style={[styles.plus, { color: isDark ? colors.primaryDeep : colors.primary }]}>
            +
          </Text>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={[styles.title, { fontSize: titleSize, color: isDark ? '#FFFFFF' : colors.ink }]}>
          HB <Text style={{ color: isDark ? '#BFDBFE' : colors.primary }}>Plus</Text>
        </Text>
        {showSubtitle && (
          <Text style={[styles.subtitle, { color: isDark ? '#BFDBFE' : colors.muted }]}>
            ORGANIZATION WORKSPACE
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mark: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  monogram: {
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 20,
  },
  plusDot: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  plus: {
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 13,
  },
  copy: {
    gap: 1,
  },
  title: {
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.15,
  },
});
