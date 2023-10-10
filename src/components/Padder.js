import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  padder: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  }
})

export default ({ children, style, ...props }) => {
  return (
    <SafeAreaView
      style={{
        ...styles.padder,
        ...style
      }}
      {...props}
    >
      {children}
    </SafeAreaView>
  )
}
