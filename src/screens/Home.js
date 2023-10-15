import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import { Fragment } from 'react'
import {
  Portal,
  Modal,
  Surface,
  FAB
} from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 0,
  },
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    left: Dimensions.get("screen").width * 0.8
  },
  fab2: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.7,
    left: Dimensions.get("screen").width * 0.8
  },
  searchBarModal: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1
  },
  postsListContainer: {
    justifyContent: "space-evenly",
    gap: 16,
    padding: 16
  }
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
    <View style={{ flex: 1 }}>
      <ScrollView
        data={postsQuery.data}
        keyExtractor={(post) => post.post_id}
        renderItem={({ item }) => <PostTile post={item} />}
        emptyIcon="basket-plus"
        emptyMessage="No has realizado ninguna publicación"
      />
    </View>
  )
}

export default () => {
  const navigation = useNavigation()

  const [isModalVisible, setIsModalVisible] = useState(false)

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

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
    <Fragment>
      <Padder style={styles.container}>
        <PostsList />

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
      </Padder>

      <FAB
        icon="plus"
        onPress={navigateToCreatePost}
        style={styles.fab2}
      />

      <FAB
        icon="magnify"
        onPress={() => setIsModalVisible(true)}
        style={styles.fab}
      />
    </Fragment>
  )
}
