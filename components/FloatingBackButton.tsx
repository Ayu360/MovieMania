import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/constants';

type Props = {
  topInset: number;
};

const FloatingBackButton = ({ topInset }: Props) => (
  <Pressable
    onPress={() => router.back()}
    hitSlop={12}
    style={({ pressed }) => [
      styles.backBtn,
      { top: topInset + 8 },
      pressed && { opacity: 0.6 },
    ]}
    accessibilityRole="button"
    accessibilityLabel="Back"
  >
    <Text style={styles.backChevron}>‹</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 24, 28, 0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    color: colors.text.DEFAULT,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
    marginTop: -2,
    marginLeft: -2,
  },
});

export default FloatingBackButton;
