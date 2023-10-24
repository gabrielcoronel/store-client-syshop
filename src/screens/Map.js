import { useRoute } from '@react-navigation/stack'
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  }
})

export default () => {
  const route = useRoute()

  const { placeName, latitude, longitude } = route.params

  return (
    <SafeAreaView style={styles.container}>
      <MapView>
        <Marker
          coordinate={{ latitude, longitude }}
          title={placeName}
        />
      </MapView>
    </SafeAreaView>
  )
}
