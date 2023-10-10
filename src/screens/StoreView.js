import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import { default as startPhoneCall } from 'react-native-phone-call'
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

const fetchChat = async (customerId, storeId) => {
  const payload = {
    sender_id: customerId,
    receiver_id: storeId
  }
  const optionChat = await requestServer(
    "/chat_service/get_chat_by_sender_and_receiver",
    payload
  )

  return optionChat
}

const followStore = async (storeId, customerId) => {
  const payload = {
    store_id: storeId,
    customer_id: customerId
  }
  const _ = await requestServer(
    "/stores_service/follow_store",
    payload
  )
}

const StoreView = ({ storeId, customerId }) => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [isFollowing, setIsFollowing] = useState(null)

  const handleQuerySuccess = (data) => {
    setIsFollowing(data.does_customer_follow_store)
  }

  const handleFollow = () => {
    followStoreMutation.mutate({
      storeId,
      customerId
    })

    setIsFollowing(!isFollowing)
  }

  const handleFollowSuccess = (_) => {
    queryClient.refetchQueries({
      queryKey: ["feedPosts"]
    })
  }

  const navigateToChat = async () => {
    const optionalChat = await fetchChat(session.data.storeId, storeId)

    const chatId = optionalChat?.chat_id

    navigation.navigate("Chat", {
      chat: {
        chat_id: chatId,
        user: {
          user_id: storeId,
          name: storeQuery.data.name,
          picture: storeQuery.data.picture
        }
      }
    })
  }

  const callStore = async () => {
    try {
      await startPhoneCall({
        number: storeQuery.data.phone_number,
        prompt: true,
        skipCanOpen: true
      })
    } catch (error) {
      Alert.alert(
        "No se pudo realizar la llamada",
        "Inténtalo más tarde"
      )
    }
  }

  const storeQuery = useQuery({
    queryKey: ["store"],
    queryFn: () => fetchStore(storeId, session.data.storeId),
    onSuccess: handleQuerySuccess,
    disabled: session.isLoading
  })
  const followStoreMutation = useMutation(
    ({ storeId, customerId }) => followStore(storeId, customerId),
    {
      onSuccess: handleFollowSuccess
    }
  )

  if (storeQuery.isLoading) {
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
          icon="phone"
          onPress={callStore}
        />

        <Appbar.Action
          icon="chat"
          onPress={navigateToChat}
        />

        <Appbar.Action
          disabled={isFollowing === null}
          icon={isFollowing ? "check" : "plus"}
          onPress={handleFollow}
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

const PostsList = ({ storeId, customerId }) => {
  const storePostsQuery = useQuery({
    queryKey: ["storePosts"],
    queryFn: () => fetchStorePosts(storeId, customerId)
  })

  if (storePostsQuery.isLoading) {
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
        emptyMessage="Esta tienda no ha hecho ninguna publicación"
      />
    </View>
  )
}

export default () => {
  const route = useRoute()
  const [session, _] = useSession()

  const { storeId } = route.params

  if (session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <VirtualizedView>
      <SafeAreaView>
        <StoreView
          storeId={storeId}
          customerId={session.data.storeId}
        />

        <Divider />

        <PostsList
          storeId={storeId}
          customerId={session.data.storeId}
        />
      </SafeAreaView>
    </VirtualizedView>
  )
}
