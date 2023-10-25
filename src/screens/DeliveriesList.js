import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import DeliveryTile from '../components/DeliveryTile'
import SecondaryTitle from '../components/SecondaryTitle'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import { StyleSheet } from 'react-native'
import { List } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  }
})

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

const DeliveriesListItems = ({ deliveries, activable }) => {
  return (
    <ScrollView
      neverEmpty
      data={deliveries}
      keyExtractor={(delivery) => delivery.delivery_id}
      renderItem={({ item }) => <DeliveryTile activable={activable} delivery={item} />}
    />
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
    <Padder style={styles.container}>
      <SecondaryTitle>
        Tus entregas
      </SecondaryTitle>

      <List.Section>
        <List.Subheader style={{ color: "green" }}>
          Entregas activas
        </List.Subheader>

        {
          activeDeliveriesQuery.isFetching ?
          <LoadingSpinner /> :
          <DeliveriesListItems
            deliveries={activeDeliveriesQuery.data}
          />
        }

        <List.Subheader style={{ color: "red" }}>
          Entregas inactivas
        </List.Subheader>

        {
          inactiveDeliveriesQuery.isFetching ?
          <LoadingSpinner /> :
          <DeliveriesListItems
            activable
            deliveries={inactiveDeliveriesQuery.data}
          />
        }
      </List.Section>
    </Padder>
  )
}
