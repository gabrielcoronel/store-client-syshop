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

export default ({ icon, message }) => {
  return (
    <View style={styles.emptyComponent}>
      <IconButton
        disabled
        icon={icon}
        size={50}
      />

      <Body>
        {message}
      </Body>
    </View>
  )
}
