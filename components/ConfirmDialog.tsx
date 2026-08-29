import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '@/constants';

const DESTRUCTIVE_RED = '#E5484D';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const handleBackdropPress = () => {
    if (!loading) onCancel();
  };

  const handleRequestClose = () => {
    if (!loading) onCancel();
  };

  const confirmColor = destructive ? DESTRUCTIVE_RED : colors.accent.orange;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
          {/* Inner Pressable stops backdrop dismiss when tapping the card */}
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={styles.actions}>
              <Pressable
                onPress={onCancel}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={cancelLabel}
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && !loading && { opacity: 0.6 },
                  loading && { opacity: 0.4 },
                ]}
              >
                <Text style={styles.cancelText}>{cancelLabel}</Text>
              </Pressable>

              <Pressable
                onPress={onConfirm}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: confirmColor },
                  pressed && !loading && { opacity: 0.8 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={styles.confirmText}>{confirmLabel}</Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 20,
  },
  title: {
    color: colors.text.DEFAULT,
    fontSize: 17,
    fontWeight: '700',
  },
  message: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    color: colors.text.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default ConfirmDialog;
