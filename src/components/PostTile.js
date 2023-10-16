import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Image, StyleSheet } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Headline, Subhead, Caption1 } from 'react-native-ios-kit'
import { Chip, IconButton } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: configuration.BACKGROUND_COLOR
  },
  extraInformationView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%"
  },
  contentView: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 12
  },
  categoriesView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
    width: "40%"
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10
  }
})

export default ({ post }) => {
  const navigation = useNavigation()

  const categoriesChips = post
      .categories
      .map((category, index) => {
        return (
          <Chip
            key={index}
            mode="flat"
            icon="pound"
            style={{ backgroundColor: configuration.BACKGROUND_COLOR }}
            textStyle={{ color: "white" }}
          >
            {category}
          </Chip>
        )
      })

  const navigateToPostView = () => {
    navigation.navigate("PostView", {
      postId: post.post_id
    })
  }

  const navigateToStoreView = () => {
    navigation.navigate("StoreView", {
      storeId: post.store_id
    })
  }

  const header = (
    <View>
      <Headline style={{ color: configuration.SECONDARY_COLOR }}>
        {post.title}
      </Headline>

      <Caption1 style={{ fontWeight: "bold", color: "green" }}>
        ₡{post.price}.00
      </Caption1>

      <Caption1>
        {
          post.amount === 1 ?
          "Una unidad disponible" :
          `${post.amount} unidades disponibles`
        }
      </Caption1>
    </View>
  )

  return (
    <Card
      onPress={navigateToPostView}
      header={header}
      style={styles.card}
    >
      <Image
        source={{
          uri: formatBase64String(post.multimedia[0]),
          height: 100
        }}
      />

      <Subhead>
        {post.description}
      </Subhead>

      <View style={styles.extraInformationView}>
        <View style={styles.categoriesView}>
          {categoriesChips}
        </View>
        
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
            {post.likes}
          </Caption1>

          <MaterialCommunityIcons
            name='heart'
            color={configuration.ACCENT_COLOR_1}
            size={24}
          />
        </View>
      </View>

      <View style={styles.buttonsView}>
        <IconButton
          icon="store-outline"
          iconColor={configuration.ACCENT_COLOR_1}
          style={{ backgroundColor: "white" }}
          onPress={navigateToStoreView}
        />
      </View>
    </Card>
  )
}
