import * as Linking from 'expo-linking'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { Alert } from 'react-native'
import { List, TouchableRipple } from 'react-native-paper'
import configuration from '../configuration'

const activateDelivery = async (deliveryId) => {
  const payload = {
    delivery_id: deliveryId
  }
  const handleError = (data) => {
    if (data.message === "UBER_ERROR") {
      Alert.alert(
        "Error de Uber",
        "Hubo un error con el servicio de Uber, inténtalo más tarde"
      )

      return true
    }

    return false
  }

  const _ = await requestServer(
    "/deliveries_service/activate_delivery",
    payload,
    handleError
  )
}

const TrackLocationIcon = ({ delivery, ...props }) => {
  const uberTrackingUrl = delivery.uber_tracking_url

  const openLink = async () => {
    if (!(await Linking.canOpenURL(uberTrackingUrl))) {
      Alert.alert(
        "No se pudo abrir el enlace",
        "Hubo un error intentando abrir el enlace de seguimiento de Uber"
      )
    }

    await Linking.openURL(uberTrackingUrl)
  }

  return (
    <TouchableRipple
      onPress={openLink}
      disabled={uberTrackingUrl === null}
    >
      <List.Icon
        {...props}
        color={configuration.ACCENT_COLOR_1}
        icon="map-marker"
      />
    </TouchableRipple>
  )
}

export default ({ activable, delivery }) =>  {
  const queryClient = useQueryClient()

  const handleActivateDelivery = () => {
    Alert.alert(
      "¿Deseas activar esta entrega?",
      "Estás apunto de activar esta entrega, una vez activada la entrega no podrás desactivarla",
      [
        {
          text: "Cancelar",
          onPress: null,
          style: "cancel"
        },
        {
          text: "Activar",
          onPress: () => {
            activateDeliveryMutation.mutate({
              deliveryId: delivery.delivery_id
            })
          }
        }
      ]
    )
  }

  const handleActivateDeliverySuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["activeDeliveries"]
    })

    queryClient.refetchQueries({
      queryKey: ["inactiveDeliveries"] })
  }

  const activateDeliveryMutation = useMutation(
    ({ deliveryId }) => activateDelivery(deliveryId),
    {
      onSuccess: handleActivateDeliverySuccess
    }
  )

  const title = delivery.post.title
  const amount = delivery.sale.amount
  const placeName = delivery.location.place_name

  return (
    <TouchableRipple
      disabled={!activable}
      onPress={handleActivateDelivery}
    >
      <List.Item
        titleStyle={{
          color: configuration.SECONDARY_COLOR
        }}
        descriptionStyle={{
          color: "silver"
        }}
        title={`${amount} ${amount === 1 ? "unidad" : "unidades"} de '${title}'`}
        description={placeName}
        left={(props) => <TrackLocationIcon {...props} delivery={delivery} />}
      />
    </TouchableRipple>
  )
}
