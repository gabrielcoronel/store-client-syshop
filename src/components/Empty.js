import { View, StyleSheet } from 'react-native'
import { Body } from 'react-native-ios-kit'
import { IconButton } from 'react-native-paper'

const styles = StyleSheet.create({
  emptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default ({ isDark, icon, message }) => {
  return (
    <View style={styles.emptyComponent}>
      <IconButton
        disabled
        color={isDark ? "white" : undefined}
        icon={icon}
        size={50}
      />

      <Body
        style={isDark ? { color: "white" } : undefined}
      >
        {message}
      </Body>
    </View>
  )
}
