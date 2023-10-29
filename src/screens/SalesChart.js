import { useQuery } from '@tanstack/react-query'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import SecondaryTitle from '../components/SecondaryTitle'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart } from 'react-native-gifted-charts'
import { View, StyleSheet } from 'react-native'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    gap: 25,
    width: "100%"
  }
})

const fetchChartData = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const chartData = await requestServer(
    "/sales_service/get_store_sales_chart_data",
    payload
  )

  return chartData
}

export default () => {
  const [session, _] = useSession()

  const chartDataQuery = useQuery({
    queryKey: ["chartData"],
    queryFn: () => fetchChartData(session.data.storeId)
  })

  if (chartDataQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const chartData = chartDataQuery.data.map((entry) => {
    const label = entry[0].slice(0, 3);
    
    const value = entry[2]

    console.log(label)

    return {
      value,
      label
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <SecondaryTitle>
        Gráfico de ventas
      </SecondaryTitle>

      <View
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BarChart
          frontColor={configuration.ACCENT_COLOR_1}
          barWidth={22}
          spacing={24}
          labelWidth={30}
          hideRules
          data={chartData}
        />
      </View>
    </SafeAreaView>
  )
}
