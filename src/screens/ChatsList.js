import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import ChatTile from '../components/ChatTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import SecondaryTitle from '../components/SecondaryTitle'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    gap: 20
  }
})

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
  const [session, _] = useSession()

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
    <Padder style={styles.container}>
      <SecondaryTitle>
        Tus mensajes
      </SecondaryTitle>

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
