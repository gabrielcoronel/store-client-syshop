import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import { Text } from 'react-native-paper'

const fetchChats = async (storeId) => {
  const payload = {
    user_id: storeId
  }
  const chats = await requestServer(
    "/chat_service/get_user_chats",
    payload
  )

  return chats
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

  const chatsQuery = useQuery({
    queryKey: ["listOfChats"],
    queryFn: () => fetchChats(session.data.storeId),
    disabled: session.isLoading
  })

  if (chatsQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Padder>
      <Text variant="titleLarge">
        Tus mensajes
      </Text>

      <ScrollView
        data={chatsQuery.data}
        keyExtractor={(chat) => chat.chat_id}
        renderItem={({ item }) => <ChatTile chat={item} />}
        emptyIcon="chat"
        emptyMessage="No has hablado con nadie"
      />
    </Padder>
  )
}
