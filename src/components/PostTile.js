import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import LikeButton from './LikeButton'
import { View, Image } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Headline, Subhead, Caption1 } from 'react-native-ios-kit'
import { Chip, IconButton } from 'react-native-paper'

const styles = {
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
}

export default ({ post }) => {
  const navigation = useNavigation()

  const categoriesChips = post
      .categories
      .map((category, index) => {
        return (
          <Chip
            key={index}
            mode="flat"
            icon="shape"
          >
            {category}
          </Chip>
        )
      })
  const likesText = `${post.likes} ${post.likes === 1 ? "like" : "likes"}`

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
      <Headline>
        {post.title}
      </Headline>

      <Caption1>
        ₡{post.price}
        •
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
        
        <Caption1>
          {likesText}
        </Caption1>
      </View>

      <View style={styles.buttonsView}>
        <IconButton
          icon="store"
          onPress={navigateToStoreView}
        />

        <LikeButton
          postId={post.post_id}
          doesCustomerLikePost={post.does_customer_like_post}
        />
    </View>
    </Card>
  )
}
