import { atom, useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage, loadable } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = createJSONStorage(() => AsyncStorage)
const sessionAtom = atomWithStorage("session", null, storage)
const loadableSessionAtom = loadable(sessionAtom)
const websocketAtom = atom(null)

export const useSession = () => {
  const [session] = useAtom(loadableSessionAtom)
  const [_, setSession] = useAtom(sessionAtom)

  const fineSession = {
    ...session,
    isLoading: session.state === "loading"
  }

  return [fineSession, setSession]
}

export const useWebsocket = () => {
  const [websocket, setWebsocket] = useAtom(websocketAtom)

  return [websocket, setWebsocket]
}

export const isUserLoggedIn = async () => {
  const session = await AsyncStorage.getItem("session")

  return (session !== null)
}
