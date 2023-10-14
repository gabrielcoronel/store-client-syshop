import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import { List, TouchableRipple, Avatar } from 'react-native-paper'

const formatLastMessage = (message) => {
  const contentType = message.content_type

  switch (contentType) {
    case "text":
      return message.content

    case "image":
      return "Imagen"
  }
}

const UserChatPicture = ({ user }) => {
  return (
    <Avatar.Image
      source={{ uri: formatBase64String(user.picture) }}
      size={50}
    />
  )
}

export default ({ chat }) => {
  const navigation = useNavigation()

  const navigateToChat = () => {
    navigation.navigate("Chat", {
      chat
    })
  }

  return (
    <TouchableRipple
      onPress={navigateToChat}
    >
      <List.Item
        title={chat.user.name}
        description={formatLastMessage(chat.last_message)}
        left={(props) => <UserChatPicture {...props} user={chat.user} />}
      />
    </TouchableRipple>
  )
}
