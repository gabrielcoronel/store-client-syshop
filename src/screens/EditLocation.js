import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import LocationSelector from '../components/LocationSelector'
import Button from '../components/Button'
import Padder from '../components/Padder'
import { Alert, StyleSheet } from 'react-native'
import { Title2 } from 'react-native-ios-kit'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 30
  }
})

const updateLocation = async (location, storeId) => {
  const payload = {
    store_id: storeId,
    ...location
  }
  const _ = await requestServer(
    "/locations_service/update_store_location",
    payload
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const [location, setLocation] = useState(null)

  const handleUpdateLocation = () => {
    updateLocationMutation.mutate({
      location,
      storeId: session.data.storeId
    })
  }

  const handleUpdateLocationSuccess = () => {
    Alert.alert(
      "Éxito",
      "El domicilio de tu emprendimiento se actualizó con éxito"
    )

    navigation.goBack()
  }

  const updateLocationMutation = useMutation(
    ({ location, storeId }) => updateLocation(location, storeId),
    {
      onSuccess: handleUpdateLocationSuccess
    }
  )

  return (
    <Padder>
      <View style={styles.container}>
        <Title2>
          Selecciona un nuevo domicilio
        </Title2>

        <LocationSelector
          onSelect={setLocation}
        />

        <Button
          style={{ width: "80%" }}
          disabled={location === null}
          onPress={handleUpdateLocation}
        >
          Confirmar
        </Button>
      </View>
    </Padder>
  )
}
