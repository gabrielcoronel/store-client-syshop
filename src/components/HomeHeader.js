import { View, Image, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import SyShopLogo from '../../assets/syshop-logo.png'
import configuration from '../configuration'

const styles = StyleSheet.create({
  header: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white"
  },
  title: {
    fontFamily: "Galada",
    color: configuration.BACKGROUND_COLOR
  },
  image: {
    height: 65,
    width: 65
  }
})

export default ({ text }) => {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <Text variant="titleMedium" style={styles.title}>
          SyShop
        </Text>

        <Image
          source={SyShopLogo}
          style={styles.image}
        />
      </View>

      <Text variant="bodyMedium" style={{ color: configuration.BACKGROUND_COLOR }}>
        {text}
      </Text>
    </View>
  )
}