import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { View } from 'react-native'
import { List, Text } from 'react-native-paper'
import DeliveryTile from '../components/DeliveryTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'

const fetchActiveDeliveries = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const activeDeliveries = await requestServer(
    "/deliveries_service/get_customer_active_deliveries",
    payload
  )

  return activeDeliveries
}

const fetchInactiveDeliveries = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const inactiveDeliveries = await requestServer(
    "/deliveries_service/get_customer_inactive_deliveries",
    payload
  )

  return inactiveDeliveries
}

const DeliveriesListItems = ({ deliveries }) => {
  const deliviriesListItems = deliveries.map((delivery) => {
    return (
      <DeliveryTile
        key={delivery.delivery_id}
        delivery={delivery}
      />
    )
  })

  return (
    <View>
      {deliviriesListItems}
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

  const activeDeliveriesQuery = useQuery({
    queryKey: ["activeDeliveries"],
    queryFn: () => fetchActiveDeliveries(session.data.customerId),
    disabled: session.isLoading
  })
  const inactiveDeliveriesQuery = useQuery({
    queryKey: ["inactiveDeliveries"],
    queryFn: () => fetchInactiveDeliveries(session.data.customerId),
    disabled: session.isLoading
  })

  if (session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Screen>
      <Text variant="titleLarge">
        Entregas que esperas
      </Text>

      <List.Section>
        <List.Subheader>
          Entregas activas
        </List.Subheader>

        {
          activeDeliveriesQuery.isLoading ?
          <LoadingSpinner /> :
          <DeliveriesListItems deliveries={activeDeliveriesQuery.data} />
        }

        <List.Subheader>
          Entregas inactivas
        </List.Subheader>

        {
          inactiveDeliveriesQuery.isLoading ?
          <LoadingSpinner /> :
          <DeliveriesListItems deliveries={inactiveDeliveriesQuery.data} />
        }
      </List.Section>
    </Screen>
  )
}
