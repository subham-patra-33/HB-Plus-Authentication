import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/theme';

type Props = {
  children: ReactNode;
  maxWidth?: number;
  variant?: 'branded' | 'plain';
};

export function ScreenContainer({
  children,
  maxWidth = 1120,
  variant = 'branded',
}: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 640;

  return (
    <View style={styles.root}>
      {variant === 'branded' ? (
        <LinearGradient
          colors={[colors.primaryDark, colors.primary, '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.canvas }]} />
      )}

      {variant === 'branded' && (
        <>
          <View style={[styles.orb, styles.orbTop, { width: compact ? 220 : 360, height: compact ? 220 : 360 }]} />
          <View style={[styles.orb, styles.orbBottom, { width: compact ? 160 : 280, height: compact ? 160 : 280 }]} />
        </>
      )}

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.inner, { maxWidth: compact ? undefined : maxWidth }]}>
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    overflow: 'hidden',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    opacity: 0.06,
  },
  orbTop: {
    top: -120,
    right: -90,
  },
  orbBottom: {
    bottom: -110,
    left: -80,
  },
});
