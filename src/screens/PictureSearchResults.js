import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Scroller from '../components/Scroller'
import Padder from '../components/Padder'
import {
  ScrollView as ReactNativeScrollView,
  StyleSheet
} from 'react-native'
import { Chip, Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    backgroundColor: "white"
  }
})

const fetchResult = async (picture) => {
  const payload = {
    picture
  }
  const result = await requestServer(
    "/posts_service/search_posts_by_image",
    payload
  )

  return result
}

const KeywordsList = ({ keywords }) => {
  const keywordsChips = keywords.map((keyword, index) => {
    return (
      <Chip
        key={index}
        icon="pound"
        style={{ backgroundColor: configuration.BACKGROUND_COLOR }}
        textStyle={{ color: "white" }}
      >
        {keyword}
      </Chip>
    )
  })

  return (
    <ReactNativeScrollView
      horizontal
      contentContainerStyle={{ gap: 10 }}
      style={{ flexGrow: 0 }}
    >
      {keywordsChips}
    </ReactNativeScrollView>
  )
}

const PostsList = ({ posts }) => {
  return (
    <ScrollView
      data={posts}
      keyExtractor={(post) => post.post_id}
      renderItem={({ item }) => <PostTile post={item} />}
      emptyIcon="basket"
      emptyMessage="No se encontraron resultados"
    />
  )
}

export default () => {
  const route = useRoute()

  const { picture } = route.params

  const resultQuery = useQuery({
    queryKey: ["picturePostResults"],
    queryFn: () => fetchResult(picture)
  })

  if (resultQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  console.log(resultQuery)

  return (
    <Scroller>
      <Padder style={styles.container}>
        <KeywordsList keywords={resultQuery.data.keywords} />

        <Divider style={{ width: "90%" }} />

        <PostsList posts={resultQuery.data.posts} />
      </Padder>
    </Scroller>
  )
}
