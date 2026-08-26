import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

import useAuthStore from '@/store/authStore';
import FormField, { type FormFieldHandle } from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { colors, images } from '@/constants';

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

type Form = {
  email: string;
  userName: string;
  password: string;
};

const SignIn = () => {
  const signIn = useAuthStore((s) => s.signIn);
  const [form, setForm] = useState<Form>({ email: '', userName: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const userRef = useRef<FormFieldHandle>(null);
  const passRef = useRef<FormFieldHandle>(null);

  const update =
    <K extends keyof Form>(key: K) =>
    (value: Form[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.email.trim() || !form.userName.trim() || !form.password.trim()) {
      Alert.alert('Incomplete details', 'Please fill in all fields.');
      return;
    }
    if (!validateEmail(form.email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    signIn(form);
    router.replace('/(tabs)/homeScreen');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image source={images.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.h1}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to save movies to your Watchlist.</Text>
          </View>

          <View style={styles.fields}>
            <FormField
              label="Email"
              value={form.email}
              placeholder="you@example.com"
              handleChangeText={update('email')}
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => userRef.current?.focus()}
            />
            <FormField
              ref={userRef}
              label="Username"
              value={form.userName}
              placeholder="What should we call you?"
              handleChangeText={update('userName')}
              autoComplete="username"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passRef.current?.focus()}
            />
            <FormField
              ref={passRef}
              label="Password"
              value={form.password}
              placeholder="At least 8 characters"
              handleChangeText={update('password')}
              secureTextEntry
              autoComplete="current-password"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <View style={styles.actions}>
            <CustomButton title="Sign in" handlePress={handleSubmit} isLoading={submitting} />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Not now?</Text>
              <Link href="../" replace style={styles.footerLink}>
                Back to Home
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 32,
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
  fields: {
    gap: 20,
  },
  actions: {
    marginTop: 32,
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
