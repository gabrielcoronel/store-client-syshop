import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatDate } from '../utilities/formatting'
import TextArea from '../components/TextArea'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import CommentTile from '../components/CommentTile'
import LikeButton from '../components/LikeButton'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { ImageSlider } from 'react-native-image-slider-banner'
import { withTheme, Title2, Title3, Body, Caption1 } from 'react-native-ios-kit'
import { View, StyleSheet } from 'react-native'
import {
  Divider,
  IconButton,
  Chip,
  TouchableRipple
} from 'react-native-paper'

const styles = StyleSheet.create({
  informationView: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    gap: 8,
    padding: 16
  },
  informationActionsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 8
  },
  categoriesChipsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%",
    gap: 8
  },
  buyButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: 8
  },
  commentInputView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 16,
    width: "100%",
  }
})

const fetchPost = async (postId, customerId) => {
  const payload = {
    post_id: postId,
    customer_id: customerId
  }
  const post = await requestServer(
    "/posts_service/get_post_by_id",
    payload
  )

  return post
}

const fetchPostComments = async (postId) => {
  const payload = {
    post_id: postId
  }
  const comments = await requestServer(
    "/comments_service/get_post_comments",
    payload
  )

  return comments
}

const addPostComment = async (postId, customerId, text) => {
  const payload = {
    post_id: postId,
    user_id: customerId,
    text
  }
  const _ = await requestServer(
    "/comments_service/add_comment",
    payload
  )
}

const formatPostDate = (isoDateString) => {
  const formatted = `Publicado el ${formatDate(isoDateString)}`

  return formatted
}

const formatPostAmount = (amount) => {
  if (amount === 1) {
    return ""
  }

  const formatted = `${amount} unidades disponibles`

  return formatted
}

const CommentInput = ({ postId, customerId }) => {
  const queryClient = useQueryClient()

  const [text, setText] = useState("")

  const handleCommentSubmit = async () => {
    addCommentMutation.mutate({
      postId,
      customerId,
      text
    })
  }

  const addCommentMutation = useMutation(
    ({ postId, customerId, text }) => addPostComment(postId, customerId, text),
    {
      onSuccess: () => queryClient.refetchQueries({
        queryKey: ["postComments"]
      })
    }
  )

  return (
    <View style={styles.commentInputView}>
      <TextArea
        value={text}
        onChangeText={setText}
        placeholder="Escribe un comentario"
      />

      {
        addCommentMutation.isLoading ?
        <LoadingSpinner /> :
        <IconButton
          icon="send"
          mode="contained"
          disabled={text === ""}
          onPress={handleCommentSubmit}
        />
      }
    </View>
  )
}

const CommentsScrollView = ({ postId }) => {
  const [session, _] = useSession()

  const commentsQuery = useQuery({
    queryKey: ["postComments"],
    queryFn: () => fetchPostComments(postId)
  })

  if (commentsQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <View>
      <CommentInput
        customerId={session.data.customerId}
        postId={postId}
      />

      <ScrollView
        data={commentsQuery.data}
        keyExtractor={(comment) => comment.comment_id}
        renderItem={({ item }) => <CommentTile comment={item} />}
        emptyIcon="comment"
        emptyMessage="No hay comentarios por aquí"
      />
    </View>
  )
}

const PostView = ({ postId, theme }) => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const navigateToStoreView = () => {
    navigation.navigate("StoreView", {
      storeId: post.store_id
    })
  }

  const navigateToOrder = () => {
    navigation.navigate("Order", {
      postId: post.post_id
    })
  }

  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: () => fetchPost(postId, session.data.customerId),
    disabled: session.isLoading
  })

  if (postQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const categoriesChips = postQuery.data.categories.map((category) => {
    return (
      <Chip
        key={category}
        mode="flat"
        icon="shape"
      >
        {category}
      </Chip>
    )
  })

  const post = postQuery.data
  const imageSliderData = post.multimedia.map((image) => {
    return {
      img: formatBase64String(image)
    }
  })

  return (
    <View>
      <ImageSlider
        data={imageSliderData}
        autoPlay={false}
      />

      <View style={styles.informationView}>
        <TouchableRipple
          onPress={navigateToStoreView}
        >
          <Title3
            style={{ color: theme.primaryColor }}
          >
            {post.store_name}
          </Title3>
        </TouchableRipple>

        <Title2>
          {post.title}
        </Title2>

        <Caption1
          style={{ color: "gray" }}
        >
          {formatPostDate(post.publication_date)}
        </Caption1>

        <Caption1
          style={{ color: "gray" }}
        >
          {
            formatPostAmount(post.amount)
          }
        </Caption1>

        <Body>
          {post.description}
        </Body>

        <View style={styles.informationActionsView}>
          <View style={styles.categoriesChipsView}>
            {categoriesChips}
          </View>

          <LikeButton
            postId={post.post_id}
            doesCustomerLikePost={post.does_customer_like_post}
          />
        </View>

        <View style={styles.buyButtonWrapper}>
          <Button
            onPress={navigateToOrder}
            style={{ width: "100%" }}
          >
            Comprar (₡{post.price})
          </Button>
        </View>
      </View>
    </View>
  )
}

export default () => {
  const route = useRoute()

  const { postId } = route.params

  const ThemedPostView = withTheme(PostView)

  return (
    <Screen>
      <ThemedPostView postId={postId} />

      <Divider />

      <CommentsScrollView postId={postId} />
    </Screen>
  )
}
