import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'
import { Fragment } from 'react'
import {
  Portal,
  Modal,
  Surface,
  FAB
} from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.75,
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

const fetchPosts = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const posts = await requestServer(
    "/posts_service/get_posts_from_customer_following_stores",
    payload
  )

  return posts
}

const PostsList = () => {
  const [session, _] = useSession()

  const postsQuery = useQuery({
    queryKey: ["feedPosts"],
    queryFn: () => fetchPosts(session.data.customerId),
    disabled: session.isLoading
  })

  if (postsQuery.isLoading || session.isLoading) {
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
        emptyMessage="Sigue a algunas tiendas para ver contenido que te pueda interesar"
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

  return (
    <Fragment>
      <Screen>
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
      </Screen>

      <FAB
        icon="magnify"
        onPress={() => setIsModalVisible(true)}
        style={styles.fab}
      />
    </Fragment>
  )
}
