import { View, Image, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import SyShopLogo from '../../assets/syshop-logo.png'
import configuration from '../configuration'

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 12
  },
  leftHeader: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontFamily: "Cookie",
    fontWeight: "bold",
    color: configuration.BACKGROUND_COLOR
  },
  text: {
    fontFamily: "Roboto",
    color: configuration.BACKGROUND_COLOR
  },
  image: {
    height: 70,
    width: 70
  }
})

export default ({ text }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        <Image
          source={SyShopLogo}
          style={styles.image}
        />

        <Text
          variant="titleLarge"
          style={styles.title}
        >
          SyShop
        </Text>
      </View>

      <Text variant="bodyMedium" style={styles.text}>
        {text}
      </Text>
    </View>
  )
}
