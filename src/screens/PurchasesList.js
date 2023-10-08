import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import SaleTile from '../components/SaleTile'
import Screen from '../components/Screen'
import { View } from 'react-native'
import { Title2 } from 'react-native-ios-kit'

const fetchPurchases = async (customerId) => {
    const payload = {
        customer_id: customerId
    }
    const purchases = await requestServer(
        "/sales_service/get_customer_purchases",
        payload
    )

    return purchases
}

export default () => {
    const [session, _] = useSession()

    const purchasesQuery = useQuery({
      queryKey: ["customerPurchases"],
      queryFn: () => fetchPurchases(session.data.customerId),
      disabled: session.isLoading
    })

    if (purchasesQuery.isLoading || session.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    return (
      <Screen>
        <View style={{ flex: 1, gap: 20 }}>
          <Title2>
            Tus compras
          </Title2>

          <ScrollView
              data={purchasesQuery.data}
              keyExtractor={(purchase) => purchase.sale_id}
              renderItem={({ item }) => <SaleTile sale={item} />}
              emptyIcon="basket"
              emptyMessage="No has comprado nada"
          />
        </View>
      </Screen>
    )
}
