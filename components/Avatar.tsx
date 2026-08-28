import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants';

type Props = {
  photoURL?: string | null;
  name?: string | null;
  size: number;
};

const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]!.toUpperCase();
  return (parts[0][0]! + parts[parts.length - 1][0]!).toUpperCase();
};

const Avatar = ({ photoURL, name, size }: Props) => {
  const radius = size / 2;

  if (photoURL) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.42) }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.accent.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.text.DEFAULT,
    fontWeight: '700',
  },
});

export default Avatar;
