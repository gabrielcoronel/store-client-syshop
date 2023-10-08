import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import Screen from '../components/Screen'
import { Fragment } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { TableView, InfoRow, RowItem, Avatar } from 'react-native-ios-kit'
import {
    Text,
    FAB
} from 'react-native-paper'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      gap: 32,
    },
    fab: {
      position: "absolute",
      top: Dimensions.get("screen").height * 0.75,
      left: Dimensions.get("screen").width * 0.8
    }
})

const fetchCustomer = async (customerId) => {
    const payload = {
        customer_id: customerId
    }
    const customer = await requestServer(
        "/customers_service/get_customer_by_id",
        payload
    )

    return customer
}

export default () => {
    const navigation = useNavigation()
    const [session, _] = useSession()

    navigation.addListener("beforeRemove", (event) => {
      event.preventDefault()
    })

    const navigateToEditProfile = () => {
      navigation.navigate("EditProfile")
    }

    const customerQuery = useQuery({
      queryKey: ["customer"],
      queryFn: () => fetchCustomer(session.data.customerId),
      disabled: session.isLoading
    })

    if (customerQuery.isLoading || session.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    const {
        name,
        first_surname,
        second_surname,
        picture,
        phone_number
    } = customerQuery.data
    const formattedName = `${name} ${first_surname} ${second_surname}`

    return (
      <Fragment>
        <Screen>
          <Text variant="titleLarge">
            Tu información
          </Text>

          <TableView>
            <RowItem
              title="Foto de perfil"
              rightComponent={() => {
                  return (
                    <Avatar
                      url={formatBase64String(picture)}
                      size={60}
                    />
                  )
                }
              }
            />

            <InfoRow
              title="Nombre"
              info={formattedName}
            />

            <InfoRow
              title="Número de teléfono"
              info={phone_number}
            />
          </TableView>

          <FAB
            icon="pencil"
            onPress={navigateToEditProfile}
            style={styles.fab}
          />
        </Screen>

        <FAB
          icon="pencil"
          onPress={navigateToEditProfile}
          style={styles.fab}
        />
      </Fragment>
    )
}
