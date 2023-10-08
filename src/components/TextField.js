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

      <HelperText type="error" visibler={(error !== null) && (error !== undefined)}>
        {error}
      </HelperText>
    </View>
  )
}
