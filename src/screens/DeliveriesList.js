import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { View, StyleSheet } from 'react-native'
import { List } from 'react-native-paper'
import DeliveryTile from '../components/DeliveryTile'
import SecondaryTitle from '../components/SecondaryTitle'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  const navigation = useNavigation()
  const [session, _] = useSession()

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

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
      <Padder style={styles.container}>
        <SecondaryTitle>
          Tus entregas
        </SecondaryTitle>

        <List.Section>
          <List.Subheader>
            Entregas activas
          </List.Subheader>

          {
            activeDeliveriesQuery.isLoading ?
            <LoadingSpinner /> :
            <DeliveriesListItems
              deliveries={activeDeliveriesQuery.data}
            />
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
