import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import SecondaryTitle from '../components/SecondaryTitle'
import FloatingActionButton from '../components/FloatingActionButton'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Caption1, Footnote } from 'react-native-ios-kit'
import { Divider, Avatar, Text, TouchableRipple } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  storeView: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
    padding: 20
  },
  informationEntry: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10
  },
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    left: Dimensions.get("screen").width * 0.85
  }
})

const fetchStore = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const InformationEntry = ({ icon, text }) => {
  return (
    <View style={styles.informationEntry}>
      <MaterialCommunityIcons
        name={icon}
        size={30}
        color="silver"
      />

      <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
        {text}
      </Caption1>
    </View>
  )
}

const Link = ({ text, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <View style={styles.link}>
        <Text
          variant="bodyMedium"
          style={{ color: configuration.SECONDARY_COLOR }}
        >
          {text}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={configuration.SECONDARY_COLOR}
        />
      </View>
    </TouchableRipple>
  )
}

const StoreView = () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const navigateToMultimediaView = (multimedia) => {
    navigation.navigate(
      "MultimediaView",
      {
        multimedia
      }
    )
  }

  const navigateToHome = () => {
    navigation.navigate("Home")
  }

  const storeQuery = useQuery({
    queryKey: ["storeProfileView"],
    queryFn: () => fetchStore(session.data.storeId),
    disabled: session.isLoading
  })

  if (storeQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const {
    name,
    description,
    phone_number,
    multimedia,
    picture,
    location,
    follower_count
  } = storeQuery.data

  return (
    <View style={styles.storeView}>
        <Avatar.Image
          source={{ uri: formatBase64String(picture) }}
          size={80}
        />

        <View style={{ width: "100%", alignItems: "flex-start" }}>
          <SecondaryTitle>
            {name}
          </SecondaryTitle>

          <Footnote>
            {description}
          </Footnote>
        </View>

        <Divider />
        
        <InformationEntry
          icon="account"
          text={`${follower_count} ${follower_count !== 1 ? 'seguidores' : 'seguidor'}`}
        />

        <InformationEntry
          icon="map-marker"
          text={formatLocation(location)}
        />

        <InformationEntry
          icon="phone"
          text={phone_number}
        />

        <Divider />

        <Link
          text="Ver imágenes"
          onPress={() => navigateToMultimediaView(multimedia)}
        />

        <Link
          text="Ver publicaciones"
          onPress={navigateToHome}
        />
    </View>
  )
}

export default () => {
  const navigation = useNavigation()

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StoreView />

      <FloatingActionButton
        icon="pencil"
        onPress={navigateToEditProfile}
        style={styles.fab}
      />
    </SafeAreaView>
  )
}
