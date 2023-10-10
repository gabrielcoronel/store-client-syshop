import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { makeNotEmptyChecker, checkPhoneNumber } from '../utilities/validators'
import TextField from '../components/TextField'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import Button from '../components/Button'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import { Alert, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  }
})

const fetchCustomer = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const updateCustomer = async (storeId, newStore, picture, multimedia) => {
  const payload = {
    store_id: storeId,
    picture,
    multimedia,
    ...newStore
  }
  const _ = await requestServer(
    "/stores_service/update_store",
    payload
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [picture, setPicture] = useState(null)

  const handleSuccess = () => {
    queryClient.refetchQueries({ queryKey: ["storeProfileView"] })

    Alert.alert(
      "Éxito",
      "Información actualizada con éxito"
    )

    navigation.goBack()
  }

  const fillFormFields = (data) => {
    form.setField("name")(data.name)
    form.setField("first_surname")(data.first_surname)
    form.setField("second_surname")(data.second_surname)
    form.setField("phone_number")(data.phone_number)

    setPicture(data.picture)
  }

  const handleUpdate = () => {
    if (!form.validate()) {
      Alert.alert(
        "Información incompleta",
        "Ingresa información necesaria para actualizar los datos"
      )

      return
    }

    updateCustomerMutation.mutate({
      storeId: session.data.storeId,
      fields: form.fields,
      picture,
      multimedia
    })
  }

  const form = useForm(
    {
      name: null,
      first_surname: null,
      second_surname: null,
      phone_number: null
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      first_surname: makeNotEmptyChecker("Primer apellido vacío"),
      second_surname: makeNotEmptyChecker("Segundo apellido vacío"),
      phone_number: checkPhoneNumber
    }
  )
  const storeQuery = useQuery({
    queryKey: ["storeToEdit"],
    queryFn: () => fetchCustomer(session.data.storeId),
    onSuccess: (data) => fillFormFields(data),
    disabled: session.isLoading
  })
  const updateCustomerMutation = useMutation(
    ({ storeId, fields, picture }) => updateCustomer(
      storeId, fields, picture, multimedia
    ), {
      onSuccess: handleSuccess
    }
  )

  if (storeQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Scroller>
      <Padder style={styles.container}>
        <Text variant="titleLarge">
          Configuración
        </Text>

        <PictureInput
          picture={picture}
          onChangePicture={setPicture}
        />

        <TextField
          value={form.getField("name")}
          onChangeText={form.setField("name")}
          error={form.getError("name")}
          placeholder="Nombre"
        />

        <TextField
          value={form.getField("first_surname")}
          onChangeText={form.setField("first_surname")}
          error={form.getError("first_surname")}
          placeholder="Primer apellido"
        />

        <TextField
          value={form.getField("second_surname")}
          onChangeText={form.setField("second_surname")}
          error={form.getError("second_surname")}
          placeholder="Segundo apellido"
        />

        <TextField
          value={form.getField("phone_number")}
          onChangeText={form.setField("phone_number")}
          error={form.getError("phone_number")}
          placeholder="Número telefónico"
        />

        <Button
          onPress={handleUpdate}
          disabled={updateCustomerMutation.isLoading}
        >
          {
            updateCustomerMutation.isLoading ?
            <LoadingSpinner /> :
            "Confirmar"
          }
        </Button>
      </Padder>
    </Scroller>
  )
}
