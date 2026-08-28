import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, icons } from '@/constants';

type Props = {
  value: string;
  placeholder?: string;
  handleChangeText: (value: string) => void;
  handleSubmit: () => void;
};

const SearchBar = ({
  value,
  placeholder = 'Search movies',
  handleChangeText,
  handleSubmit,
}: Props) => {
  return (
    <View style={styles.container}>
      <Image source={icons.search} style={styles.icon} resizeMode="contain" />
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.text.dim}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity
          onPress={() => handleChangeText('')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={colors.text.dim} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    paddingHorizontal: 14,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.text.DEFAULT,
    fontSize: 15,
    padding: 0,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: colors.text.muted,
  },
});

export default SearchBar;
