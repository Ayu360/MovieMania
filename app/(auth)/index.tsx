import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import CustomButton from '@/components/CustomButton';
import { colors, images } from '@/constants';
import { signInWithGoogle } from '@/lib/auth/firebase';

const SignIn = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Sign-in failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.h1}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to save movies to your Watchlist.</Text>
        </View>

        <View style={styles.actions}>
          <CustomButton
            title="Continue with Google"
            handlePress={handleGoogle}
            isLoading={submitting}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Not now?</Text>
            <Link href="../" replace style={styles.footerLink}>
              Back to Home
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    paddingTop: 20,
    gap: 8,
  },
  logo: {
    width: 130,
    height: 36,
    marginBottom: 12,
  },
  h1: {
    color: colors.text.DEFAULT,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: 14,
  },
  footerLink: {
    color: colors.accent.orange,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SignIn;
