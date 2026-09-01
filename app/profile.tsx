import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import Avatar from '@/components/Avatar';
import FloatingBackButton from '@/components/FloatingBackButton';
import { colors } from '@/constants';
import { deleteAccount, signOut } from '@/lib/auth/firebase';
import { useConfirm } from '@/lib/confirm';
import useAuthStore from '@/store/authStore';

const DELETE_RED = '#E5484D';

const Profile = () => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const confirm = useConfirm();

  const handleLogout = async () => {
    try {
      await confirm({
        title: 'Log out?',
        message: 'You will need to sign in again to access your watchlist.',
        confirmLabel: 'Log out',
        onConfirm: signOut,
      });
    } catch (err) {
      Alert.alert('Could not log out', err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async () => {
    try {
      await confirm({
        title: 'Delete account?',
        message:
          'This permanently removes your account, watchlist, and profile data. This cannot be undone.',
        confirmLabel: 'Delete',
        destructive: true,
        onConfirm: deleteAccount,
      });
    } catch (err) {
      Alert.alert(
        'Could not delete account',
        err instanceof Error ? err.message : String(err),
      );
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FloatingBackButton topInset={insets.top} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Avatar photoURL={user?.photoURL} name={user?.name} size={96} />
          <Text style={styles.name}>{user?.name ?? 'Signed in'}</Text>
          {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
        </View>

        <View style={styles.card}>
          <Row label="Terms & Conditions" onPress={() => router.push('/terms')} />
          <View style={styles.divider} />
          <Row label="Developer Contact" onPress={() => router.push('/contact')} />
          <View style={styles.divider} />
          <Row label="About the Developer" onPress={() => router.push('/developer')} />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Delete account"
          >
            <Text style={styles.deleteText}>Delete account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type RowProps = { label: string; onPress: () => void };

const Row = ({ label, onPress }: RowProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    accessibilityRole="button"
  >
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowChevron}>›</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    color: colors.text.DEFAULT,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 14,
  },
  email: {
    color: colors.text.muted,
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLabel: {
    color: colors.text.DEFAULT,
    fontSize: 15,
    fontWeight: '500',
  },
  rowChevron: {
    color: colors.text.dim,
    fontSize: 22,
    lineHeight: 22,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  actions: {
    marginTop: 32,
    gap: 20,
  },
  logoutBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.accent.orange,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  deleteBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: DELETE_RED,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Profile;
