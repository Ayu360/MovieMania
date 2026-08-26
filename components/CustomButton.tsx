import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { colors } from '@/constants';

type Variant = 'primary' | 'secondary';

type Props = {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
};

const CustomButton = ({
  title,
  handlePress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  containerStyles,
  textStyles,
}: Props) => {
  const isDisabled = isLoading || disabled;
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        containerStyles,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isSecondary ? colors.text.DEFAULT : colors.primary} />
      ) : (
        <Text
          style={[
            styles.text,
            isSecondary ? styles.textSecondary : styles.textPrimary,
            textStyles,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.accent.orange,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textPrimary: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.text.DEFAULT,
  },
});

export default CustomButton;
