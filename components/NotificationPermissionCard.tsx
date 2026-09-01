import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CustomButton from '@/components/CustomButton';
import { colors } from '@/constants';

type Props = {
  onEnable: () => void;
  onDismiss: () => void;
};

const NotificationPermissionCard = ({ onEnable, onDismiss }: Props) => (
  <View style={styles.card}>
    <View style={styles.iconWrap}>
      <MaterialIcons
        name="notifications-active"
        size={24}
        color={colors.accent.orange}
      />
    </View>
    <Text style={styles.title}>Get notified about new releases</Text>
    <Text style={styles.body}>
      Turn on notifications to hear about trending picks, staff highlights, and
      updates on titles you save.
    </Text>
    <View style={styles.actions}>
      <View style={styles.actionButton}>
        <CustomButton title="Enable" handlePress={onEnable} />
      </View>
      <View style={styles.actionButton}>
        <CustomButton
          title="Not now"
          variant="secondary"
          handlePress={onDismiss}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.text.DEFAULT,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  body: {
    color: colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});

export default NotificationPermissionCard;
