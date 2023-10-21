import { useQuery } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Alert } from 'react-native'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import ScrollView from '../components/ScrollView'
import { View, Image, StyleSheet } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { TouchableRipple } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
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

const fetchInstagramPostsIds = async (accessData) => {
  const firstUrl = `https://graph.instagram.com/v18.0/${accessData.user_id}/media?access_token=${accessData.access_token}`
  let currentUrl = firstUrl
  let ids = []

  while (true) {
    const response = await axios.get(currentUrl)

    if (response.status < 200 || response.status >= 300) {
      throw Error()
    }

    const currentIds = response.data.data.map((x) => x.id)

    ids = [...currentIds, ...ids]

    currentUrl = response.data.paging.next

    if (currentUrl === null || currentUrl === undefined) {
      return ids
    }
  }
}

const fetchInstagramPosts = async (accessData) => {
  const postsIds = await fetchInstagramPostsIds(accessData)
  const parsedPosts = []

  for (const id of postsIds) {
    const url = `https://graph.instagram.com/${id}?fields=caption,media_type,media_url,children&access_token=${accessData.access_token}`
    const post = await axios.get(url)

    if (response.status < 200 || response.status >= 300) {
      throw Error()
    }

    if (post.media_type === "VIDEO") {
      continue
    }

    const picturesUrls = post.media_type === "IMAGE" ?
      [post.media_url] :
      post.children

    const parsedPost = {
      picturesUrls,
      description: post.caption
    }

    parsedPosts.push(parsedPost)
  }

  return parsedPosts
}

const InstagramPostTile = ({ instagramPost }) => {
  const navigation = useNavigation()

  const navigateToCreatePost = () => {
    navigation.navigate(
      "CreatePost",
      {
        instagramPost
      }
    )
  }

  return (
    <TouchableRipple
      onPress={navigateToCreatePost}
    >
      <View style={styles.tile}>
        <Image
          source={{
            uri: instagramPost.picturesUrls[0],
            height: 120,
            width: 120,
          }}
          style={styles.image}
        />

        <View style={styles.informationContainer}>
            <Caption1 style={{ color: "white" }}>
              {instagramPost.description}
            </Caption1>
        </View>
      </View>
    </TouchableRipple>
  )
}

export default () => {
  const route = useRoute()

  const { instagramAccessData } = route.params

  const handleError = () => {
    Alert.alert(
      "Error de conexión",
      "No se pudo conectar con Instagram"
    )
  }

  const instagramPostsQuery = useQuery({
    queryKey: ["instagramPosts"],
    queryFn: () => fetchInstagramPosts(instagramAccessData),
    onError: handleError
  })

  if (instagramPostsQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Padder style={styles.container}>
      <ScrollView
        data={instagramPostsQuery.data}
        keyExtractor={(_, index) => index}
        renderItem={({ item }) => <InstagramPostTile post={item} />}
        emptyIcon="basket"
        emptyMessage="Tu cuenta de Instagram no tiene publicaciones"
      />
    </Padder>
  )
}
