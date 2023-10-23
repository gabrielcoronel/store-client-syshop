import { useNavigation } from '@react-navigation/native'
import { formatDate, formatBase64String } from '../utilities/formatting'
import { View, Image, StyleSheet } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { TouchableRipple, Text } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  tile: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: configuration.BACKGROUND_COLOR,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 15,
    gap: 10,
    shadowColor: "silver",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8
  },
  informationContainer: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    columnGap: 10,
  },
  image: {
    borderRadius: 15,
    resizeMode: 'contain'
  }
})

export default ({ sale }) => {
  const navigation = useNavigation()

  const navigateToPostView = () => {
    navigation.navigate(
      "PostView",
      {
        postId: sale.post.post_id
      }
    )
  }

  return (
    <TouchableRipple
      onPress={navigateToPostView}
    >
      <View style={styles.tile}>
        <Image
          source={{
            uri: formatBase64String(sale.post.multimedia[0]),
            height: 120,
            width: 120,
          }}
          style={styles.image}
        />

        <View style={styles.informationContainer}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: "white" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {sale.post.title}
            </Text>

            <Caption1 style={{ color: "white" }}>
              Comprado el {formatDate(sale.purchase_date)}
            </Caption1>
          </View>

          <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
            ₡{sale.post.price * sale.amount} 
          </Caption1>
        </View>
      </View>
    </TouchableRipple>
  )
}
