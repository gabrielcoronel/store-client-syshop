import { View, TextInput, StyleSheet } from 'react-native'
import { HelperText } from 'react-native-paper'

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    width: 275,
    borderColor: "silver",
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    color: "black"
  }
})

export default ({ error, ...textInputProps }) => {
  return (
    <View>
      <TextInput
        {...textInputProps}
        style={styles.textInput}
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
