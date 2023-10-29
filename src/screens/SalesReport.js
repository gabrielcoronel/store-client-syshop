import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from "../utilities/requests"
import LoadingSpinner from '../components/LoadingSpinner'
import SecondaryTitle from '../components/SecondaryTitle'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    gap: 25,
  },
  reportEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10
  }
})

const fetchSalesReport = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const report = await requestServer(
    "/sales_service/get_store_sales_report",
    payload
  )

  return report
}

const ReportEntry = ({ title, value }) => {
  return (
    <View style={styles.reportEntry}>
      <Text
        variant="bodyMedium"
        style={{ color: configuration.SECONDARY_COLOR }}
      >
        {title}
      </Text>

      <Text
        variant="bodyMedium"
        style={{ color: configuration.ACCENT_COLOR_1 }}
      >
        {value}
      </Text>
    </View>
  )
}

const Link = ({ text, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <View style={styles.link}>
        <Text
          variant="bodyMedium"
          style={{ color: configuration.SECONDARY_COLOR }}
        >
          {text}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={configuration.SECONDARY_COLOR}
        />
      </View>
    </TouchableRipple>
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const navigateToSalesChart = () => {
    navigation.navigate("SalesChart")
  }

  const reportQuery = useQuery({
    queryKey: ["salesReport"],
    queryFn: () => fetchSalesReport(session.data.storeId)
  })

  if (reportQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <SecondaryTitle>
        Reporte de ventas
      </SecondaryTitle>

      <View style={{ width: "100%" }}>
        <ReportEntry
          title="En las últimas 24 horas"
          value={reportQuery.data.amount_today}
        />

        <ReportEntry
          title="En esta semana"
          value={reportQuery.data.amount_this_week}
        />

        <ReportEntry
          title="En este mes"
          value={reportQuery.data.amount_this_month}
        />

        <ReportEntry
          title="En el año"
          value={reportQuery.data.amount_this_year}
        />

        <Link
          text="Ver gráfico"
          onPress={navigateToSalesChart}
        />
      </View>
    </SafeAreaView>
  )
}
