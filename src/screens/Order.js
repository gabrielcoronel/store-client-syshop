import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useStripe } from '@stripe/stripe-react-native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String } from '../utilities/formatting'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import Padder from '../components/Padder'
import { Alert, Image, StyleSheet, Dimensions } from 'react-native'
import { TableView, InfoRow, Stepper, Title2 } from 'react-native-ios-kit'

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    padding: 16
  }
})

const fetchPost = async (postId, customerId) => {
  const payload = {
    post_id: postId,
    customer_id: customerId
  }
  const post = await requestServer(
    "/posts_service/get_post_by_id",
    payload
  )

  return post
}

const createSaleIntent = async (postId, customerId, amount) => {
  const payload = {
    post_id: postId,
    customer_id: customerId,
    amount
  }
  const response = await requestServer(
    "/sales_service/create_sale_intent",
    payload
  )

  return response
}

export default () => {
    const navigation = useNavigation()
    const route = useRoute()
    const [session, _] = useSession()
    const { initPaymentSheet, presentPaymentSheet } = useStripe()

    const { postId } = route.params

    const [amount, setAmount] = useState(1)

    const handleBuy = () => {
      createSaleIntentMutation.mutate({
        postId,
        customerId: session.data.customerId,
        amount
      })
    }

    const handleSuccess = async (data) => {
      const stripeClientSecret = data.stripe_client_secret

      const paymentSheet = await initPaymentSheet({
        merchantDisplayName: postQuery.data.store_name,
        paymentIntentClientSecret: stripeClientSecret,
        style: "automatic",
        customFlow: false
      })

      if (paymentSheet.error) {
        Alert.alert(
          "Error de Stripe",
          "Hubo un error al intentar conectarse a Stripe, inténtale de nuevo más tarde"
        )

        return
      }

      const presentation = await presentPaymentSheet()

      if (presentation.error) {
        Alert.alert(
          "Error de Stripe",
          "Hubo un error al intentar conectarse a Stripe, inténtale de nuevo más tarde"
        )

        return
      }

      navigation.navigate("ChooseLocation", {
        saleId: data.sale_id
      })
    }

    const postQuery = useQuery({
      queryKey: ["postToBuy"],
      queryFn: () => fetchPost(postId, session.data.customerId),
      disabled: session.isLoading
    })
    const createSaleIntentMutation = useMutation(
      ({ postId, customerId, amount }) => createSaleIntent(postId, customerId, amount),
      {
        onSuccess: handleSuccess
      }
    )

    if (postQuery.isLoading) {
        return (
          <LoadingSpinner inScreen />
        )
    }



    return (
      <Padder style={styles.container}>
        <Title2>
          Comprando '{postQuery.data.title}'
        </Title2>

        <Image
          source={{
            uri: formatBase64String(postQuery.data.multimedia[0]),
            height: 200,
            width: 300
          }}
          style={{ borderRadius: 5 }}
        />

        <TableView>
          <InfoRow
            title="Cantidad de unidades a comprar"
            info={amount}
          />

          <InfoRow
            title="Precio total de la compra"
            info={`₡${postQuery.data.price * amount}`}
          />
        </TableView>

        <Stepper
          minValue={1}
          maxValue={postQuery.data.amount}
          value={amount}
          onValueChange={setAmount}
        />

        <Button
            onPress={handleBuy}
            style={{ width: "70%" }}
        >
          {
            createSaleIntentMutation.isLoading ?
            <LoadingSpinner /> :
            "Comprar"
          }
        </Button>
      </Padder>
    )
}
