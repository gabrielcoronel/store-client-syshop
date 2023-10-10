import { TextInput, StyleSheet } from 'react-native'

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

export default ({ ...textInputProps }) => {
  return (
    <TextInput
      {...textInputProps}
      style={{
        ...styles.textInput,
      }}
      multiline
    />
  )
}
