import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { colors, icons } from '../constants'

const SearchBar = ({ value, placeholder = "Search movies", handleChangeText, handleSubmit }) => {
  return (
    <View style={styles.container}>
      <Image
        source={icons.search}
        style={styles.icon}
        resizeMode='contain'
      />
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
        <TouchableOpacity onPress={() => handleChangeText('')} hitSlop={8}>
          <Image source={icons.rightArrow} style={styles.clear} resizeMode='contain' />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

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
  clear: {
    width: 14,
    height: 14,
    tintColor: colors.text.dim,
    transform: [{ rotate: '45deg' }],
  },
})

export default SearchBar
