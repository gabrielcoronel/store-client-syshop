import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import LoadingSpinner from '../components/LoadingSpinner'
import SaleTile from '../components/SaleTile'
import Screen from '../components/Screen'
import { View } from 'react-native'
import { Title2 } from 'react-native-ios-kit'

const fetchSales = async (storeId) => {
    const payload = {
        store_id: storeId
    }
    const sales = await requestServer(
        "/sales_service/get_store_sales",
        payload
    )

    return sales
}

export default () => {
    const [session, _] = useSession()

    const salesQuery = useQuery({
      queryKey: ["storeSales"],
      queryFn: () => fetchSales(session.data.storeId),
      disabled: session.isLoading
    })

    if (salesQuery.isLoading || session.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    return (
      <Screen>
        <View style={{ flex: 1, gap: 20 }}>
          <Title2>
            Tus ventas
          </Title2>

          <ScrollView
              data={salesQuery.data}
              keyExtractor={(sale) => sale.sale_id}
              renderItem={({ item }) => <SaleTile sale={item} />}
              emptyIcon="basket"
              emptyMessage="No has vendido nada"
          />
        </View>
      </Screen>
    )
}
