import { StyleSheet } from 'react-native'
import { Button, Headline } from 'react-native-ios-kit'

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#ffffff",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ({ children, style, ...iosButtonProps }) => {
  return (
    <Button
      centered
      inverted
      rounded
      {...iosButtonProps}
      style={{
        ...styles.button,
        ...style
      }}
    >
      <Headline style={styles.text}>
        {children}
      </Headline>
    </Button>
  )
}
