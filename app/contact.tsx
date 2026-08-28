import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import FloatingBackButton from '@/components/FloatingBackButton';
import { colors } from '@/constants';

const Contact = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FloatingBackButton topInset={insets.top} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Developer Contact</Text>
        <Text style={styles.body}>
          MovieMania is built and maintained by an independent developer.
        </Text>
        <Text style={styles.label}>Reach the developer</Text>
        <Text style={styles.body}>
          Email: your-email@example.com{'\n'}
          Replace this placeholder with your real contact details.
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
  label: {
    color: colors.text.DEFAULT,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  body: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
});

export default Contact;
