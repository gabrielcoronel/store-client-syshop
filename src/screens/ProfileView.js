import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import FloatingActionButton from '../components/FloatingActionButton'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { Avatar, Text, TouchableRipple } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  storeView: {
    flex: 1,
    alignItems: "center"
  },
  topContainer: {
    borderRadius: 30,
    height: "30%",
    width: "100%",
    backgroundColor: configuration.BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  descriptionContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "silver",
    padding: 15,
    width: "80%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bottom: 25
  },
  extraInformationContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  linksContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  informationEntry: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    padding: 5
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

      <Caption1 style={{ color: configuration.ACCENT_COLOR_1, flexShrink: 1 }}>
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

const TopContainer = ({ picture, name }) => {
  return (
    <View style={styles.topContainer}>
      <Avatar.Image
        source={{ uri: formatBase64String(picture) }}
        size={80}
      />

      <Text
        variant="titleLarge"
        style={{ color: "white" }}
      >
        {name}
      </Text>
    </View>
  )
}

const DescriptionContainer = ({ description }) => {
  return (
    <View style={styles.descriptionContainer}>
      <Text
        variant="bodySmall"
        color={{ color: configuration.SECONDARY_COLOR }}
      >
        {description}
      </Text>
    </View>
  )
}

const ExtraInformationContainer = ({ followerCount, location, phoneNumber }) => {
  return (
    <View style={styles.extraInformationContainer}>
      <InformationEntry
        icon="account"
        text={`${followerCount} ${followerCount !== 1 ? 'seguidores' : 'seguidor'}`}
      />

      <InformationEntry
        icon="map-marker"
        text={formatLocation(location)}
      />

      <InformationEntry
        icon="phone"
        text={phoneNumber}
      />
    </View>
  )
}

const LinksContainer = ({ multimedia }) => {
  const navigation = useNavigation()

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

  return (
    <View style={styles.linksContainer}>
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

const StoreView = () => {
  const [session, _] = useSession()

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
      <TopContainer
        picture={picture}
        name={name}
      />

      <DescriptionContainer
        description={description}
      />

      <ExtraInformationContainer
        followerCount={follower_count}
        location={location}
        phoneNumber={phone_number}
      />

      <LinksContainer
        multimedia={multimedia}
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
    <View style={styles.container}>
      <StoreView />

      <FloatingActionButton
        icon="pencil"
        onPress={navigateToEditProfile}
        style={styles.fab}
      />
    </View>
  )
}
