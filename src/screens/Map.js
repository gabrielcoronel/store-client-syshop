import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { Appbar } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  map: {
    flex: 1
  }
})

export default () => {
  const route = useRoute()
  const navigation = useNavigation()

  const { placeName, latitude, longitude } = route.params

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header
        mode="center-aligned"
        elevated
        statusBarHeight={0}
      >
        <Appbar.Content
          title={placeName}
        />

        <Appbar.BackAction
          onPress={() => navigation.goBack()}
        />
      </Appbar.Header>

      <MapView
        style={styles.map}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={placeName}
        />
      </MapView>
    </SafeAreaView>
  )
}
