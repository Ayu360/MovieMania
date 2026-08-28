import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import FloatingBackButton from '@/components/FloatingBackButton';
import { colors } from '@/constants';

const Terms = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FloatingBackButton topInset={insets.top} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.body}>
          Placeholder terms and conditions. Replace this text with your final legal copy
          before shipping.
        </Text>
        <Text style={styles.body}>
          By using MovieMania you agree to use the app for personal, non-commercial
          discovery of movie information. Movie data is provided by third-party sources
          and may be inaccurate or incomplete.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  title: {
    color: colors.text.DEFAULT,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  body: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
});

export default Terms;
