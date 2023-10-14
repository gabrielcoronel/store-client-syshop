import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import Scroller from '../components/Scroller'
import LoadingSpinner from '../components/LoadingSpinner'
import SecondaryTitle from '../components/SecondaryTitle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Body, Caption1 } from 'react-native-ios-kit'
import { Divider, FAB } from 'react-native-paper'
import { ImageSlider } from 'react-native-image-slider-banner'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  fab: {
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    left: Dimensions.get("screen").width * 0.8
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
    multimedia,
    location,
    follower_count
  } = storeQuery.data
  const imageSliderData = multimedia.map((image) => {
    return {
      img: formatBase64String(image)
    }
  })

  return (
    <View style={styles.storeView}>
      <ImageSlider
        data={imageSliderData}
        autoPlay={false}
      />

      <View style={{ padding: 10, gap: 15 }}>
        <SecondaryTitle>
          {name}
        </SecondaryTitle>

        <Body>
          {description}
        </Body>

        <Divider style={{ width: "90%" }}/>

        <Caption1
          style={{ color: configuration.ACCENT_COLOR_1 }}
        >
          {`${follower_count} ${follower_count !== 1 ? 'seguidores' : 'seguidor'}`}
        </Caption1>

        <Caption1
          style={{ color: configuration.ACCENT_COLOR_2 }}
        >
          {formatLocation(location)}
        </Caption1>
      </View>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  return (
    <Scroller>
      <SafeAreaView style={styles.container}>
        <StoreView />

        <FAB
          icon="pencil"
          onPress={navigateToEditProfile}
          style={styles.fab}
        />
      </SafeAreaView>
    </Scroller>
  )
}
