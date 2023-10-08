import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import ScrollView from '../components/ScrollView'
import VirtualizedView from '../components/VirtualizedView'
import LoadingSpinner from '../components/LoadingSpinner'
import PostTile from '../components/PostTile'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { Body, Caption1, Title2 } from 'react-native-ios-kit'
import { Appbar, Divider } from 'react-native-paper'
import { ImageSlider } from 'react-native-image-slider-banner'

const fetchStore = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const fetchStorePosts = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const posts = await requestServer(
    "/posts_service/get_store_posts",
    payload
  )

  return posts
}

const StoreView = () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const storeQuery = useQuery({
    queryKey: ["storeProfileView"],
    queryFn: () => fetchStore(session.data.storeId, session.data.storeId),
    disabled: session.isLoading
  })

  if (storeQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const {
    name,
    description,
    multimedia,
    location,
    follower_count
  } = storeQuery.data
  const imageSliderData = multimedia.map((image) => {
    return {
      img: formatBase64String(image)
    }
  })

  return (
    <View>
      <Appbar.Header
        mode="center-aligned"
        statusBarHeight={0}
      >
        <Appbar.Content title={name} />

        <Appbar.Action
          icon="pencil"
          onPress={navigateToEditProfile}
        />
      </Appbar.Header>

      <ImageSlider
        data={imageSliderData}
        autoPlay={false}
      />

      <View style={{ padding: 15 }}>
        <Caption1
          style={{ color: "gray" }}
        >
          {`${follower_count} ${follower_count > 1 ? 'followers' : 'follower'}`}
        </Caption1>

        <Caption1
          style={{ color: "gray" }}
        >
          {formatLocation(location)}
        </Caption1>

        <Body>
          {description}
        </Body>
      </View>
    </View>
  )
}

const PostsList = () => {
  const [session, _] = useSession()

  const storePostsQuery = useQuery({
    queryKey: ["storePostsProfileView"],
    queryFn: () => fetchStorePosts(session.data.storeId, session.data.storeId)
  })

  if (storePostsQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <View style={{ flex: 1, paddingTop: 20, paddingLeft: 15, paddingRight: 15 }}>
      <View style={{ paddingBottom: 15 }}>
        <Title2>
          Publicaciones
        </Title2>
      </View>

      <ScrollView
        data={storePostsQuery.data}
        keyExtractor={(post) => post.post_id}
        renderItem={({ item }) => <PostTile post={item} />}
        emptyIcon="basket"
        emptyMessage="No has hecho ninguna publicación"
      />
    </View>
  )
}

export default () => {
  return (
    <VirtualizedView>
      <SafeAreaView>
        <StoreView />

        <Divider />

        <PostsList />
      </SafeAreaView>
    </VirtualizedView>
  )
}
