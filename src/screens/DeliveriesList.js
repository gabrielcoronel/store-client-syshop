import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { View } from 'react-native'
import { List, Text } from 'react-native-paper'
import DeliveryTile from '../components/DeliveryTile'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'

const fetchActiveDeliveries = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const activeDeliveries = await requestServer(
    "/deliveries_service/get_store_active_deliveries",
    payload
  )

  return activeDeliveries
}

const fetchInactiveDeliveries = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const inactiveDeliveries = await requestServer(
    "/deliveries_service/get_store_inactive_deliveries",
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
        activable
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
  const [session, _] = useSession()

  const activeDeliveriesQuery = useQuery({
    queryKey: ["activeDeliveries"],
    queryFn: () => fetchActiveDeliveries(session.data.storeId),
    disabled: session.isLoading
  })
  const inactiveDeliveriesQuery = useQuery({
    queryKey: ["inactiveDeliveries"],
    queryFn: () => fetchInactiveDeliveries(session.data.storeId),
    disabled: session.isLoading
  })

  if (session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Scroller>
      <Padder>
        <Text variant="titleLarge">
          Tus entregas
        </Text>

        <List.Section>
          <List.Subheader>
            Entregas inactivas
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
            <DeliveriesListItems
              activable
              deliveries={inactiveDeliveriesQuery.data}
            />
          }
        </List.Section>
      </Padder>
    </Scroller>
  )
}
