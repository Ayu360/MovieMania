import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../constants'

const FormField = forwardRef(
  (
    {
      label,
      value,
      placeholder,
      handleChangeText,
      secureTextEntry = false,
      keyboardType,
      autoCapitalize = 'none',
      autoComplete,
      returnKeyType,
      onSubmitEditing,
      blurOnSubmit,
    },
    ref,
  ) => {
    const [hidden, setHidden] = useState(true)
    const [focused, setFocused] = useState(false)
    const inputRef = useRef(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }))

    return (
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.container}
      >
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
          <TextInput
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={colors.text.dim}
            onChangeText={handleChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.input}
            secureTextEntry={secureTextEntry && hidden}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            autoCorrect={false}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            selectionColor={colors.accent.orange}
            underlineColorAndroid="transparent"
          />
          {secureTextEntry ? (
            <Pressable
              onPress={() => setHidden((h) => !h)}
              hitSlop={12}
              style={styles.togglePress}
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            >
              <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    )
  },
)

FormField.displayName = 'FormField'

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapFocused: {
    borderColor: colors.accent.orange,
  },
  input: {
    flex: 1,
    color: colors.text.DEFAULT,
    fontSize: 16,
    height: '100%',
    padding: 0,
  },
  togglePress: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
  },
  toggle: {
    color: colors.accent.orange,
    fontSize: 13,
    fontWeight: '700',
  },
})

export default FormField
