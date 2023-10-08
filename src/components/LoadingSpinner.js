import { ActivityIndicator, View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ({ inScreen }) => {
  const containerStyle = {
    flex: inScreen ? 1 : undefined,
    ...styles.container
  }

  return (
    <View style={containerStyle}>
      <ActivityIndicator
        animating
        size={inScreen ? "large" : "small"}
      />
    </View>
  )
}
