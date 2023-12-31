import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import HomeHeader from '../components/HomeHeader'
import FloatingActionButton from '../components/FloatingActionButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Portal,
  Modal,
  Surface
} from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
  postsList: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15
  },
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    left: Dimensions.get("screen").width * 0.85
  },
  fab2: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.72,
    left: Dimensions.get("screen").width * 0.85
  },
  searchBarModal: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1
  },
})

const fetchPosts = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const posts = await requestServer(
    "/posts_service/get_store_posts",
    payload
  )

  return posts
}

const PostsList = () => {
  const [session, _] = useSession()

  const postsQuery = useQuery({
    queryKey: ["createdPosts"],
    queryFn: () => fetchPosts(session.data.storeId),
    disabled: session.isLoading
  })

  if (postsQuery.isFetching || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <View style={styles.postsList}>
      <ScrollView
        style={{ flex: 1 }}
        data={postsQuery.data}
        keyExtractor={(post) => post.post_id}
        renderItem={({ item }) => <PostTile post={item} isOwnPost />}
        emptyIcon="basket-plus"
        emptyMessage="No has realizado ninguna publicación"
      />
    </View>
  )
}

export default () => {
  const navigation = useNavigation()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleSearchSubmit = (text, categoriesNames, storesNames) => {
    setIsModalVisible(false)

    navigation.navigate("SearchResults", {
      text,
      categoriesNames,
      storesNames
    })
  }

  const handleSearchByPicture = (picture) => {
    setIsModalVisible(false)

    navigation.navigate("PictureSearchResults", {
      picture
    })
  }

  const navigateToCreatePost = () => {
    navigation.navigate("CreatePost")
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <HomeHeader text="Tus publicaciones" />

        <PostsList />
      </View>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.searchBarModal}
        >
          <Surface elevation={5}>
            <SearchBar
              onSearchSubmit={handleSearchSubmit}
              onPictureTaken={handleSearchByPicture}
              onCancel={() => setIsModalVisible(false)}
            />
          </Surface>
        </Modal>
      </Portal>

      <FloatingActionButton
        icon="plus"
        onPress={navigateToCreatePost}
        style={styles.fab2}
      />

      <FloatingActionButton
        icon="magnify"
        onPress={() => setIsModalVisible(true)}
        style={styles.fab}
      />
    </SafeAreaView>
  )
}
