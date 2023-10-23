import { View, TextInput, StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    padding: 15,
    width: 275,
    borderColor: configuration.ACCENT_COLOR_1,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "white",
  }
})

export default ({ error, light, style, multiline, ...textInputProps }) => {
  return (
    <View style={styles.container}>
      <TextInput
        {...textInputProps}
        style={{
          ...styles.textInput,
          ...style,
          ...(multiline ? { paddingVertical: 20 } : {})
        }}
        placeholderTextColor="silver"
        multiline={multiline}
      />

      {
        (error !== null) && (error !== undefined) ?
        (
          <HelperText type="error" visible={(error !== null) && (error !== undefined)}>
            {error}
          </HelperText>
        ) :
        null
      }
    </View>
  )
}
