import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { makeNotEmptyChecker, checkPhoneNumber } from '../utilities/validators'
import TextField from '../components/TextField'
import TextArea from '../components/TextArea'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import MultimediaAdder from '../components/MultimediaAdder'
import Button from '../components/Button'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import { View, Alert, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  }
})

const fetchStore = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const updateStore = async (storeId, newStore, picture, multimedia) => {
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
  const [multimedia, setMultimedia] = useState([])

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
    form.setField("description")(data.description)
    form.setField("phone_number")(data.phone_number)

    setPicture(data.picture)
    setMultimedia(data.multimedia)
  }

  const handleUpdate = () => {
    if (!form.validate()) {
      Alert.alert(
        "Información incompleta",
        "Ingresa información necesaria para actualizar los datos"
      )

      return
    }

    updateStoreMutation.mutate({
      storeId: session.data.storeId,
      fields: form.fields,
      picture,
      multimedia
    })
  }

  const form = useForm(
    {
      name: null,
      description: null,
      phone_number: null
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      description: () => null,
      phone_number: checkPhoneNumber
    }
  )
  const storeQuery = useQuery({
    queryKey: ["storeToEdit"],
    queryFn: () => fetchStore(session.data.storeId),
    onSuccess: (data) => fillFormFields(data),
    disabled: session.isLoading
  })
  const updateStoreMutation = useMutation(
    ({ storeId, fields, picture, multimedia }) => updateStore(
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
        <PictureInput
          picture={picture}
          onChangePicture={setPicture}
        />

        <View style={styles.inputsContainer}>
          <TextField
            value={form.getField("name")}
            onChangeText={form.setField("name")}
            error={form.getError("name")}
            placeholder="Nombre"
          />

          <TextArea
            value={form.getField("description")}
            onChangeText={form.setField("description")}
            error={form.getError("description")}
            placeholder="Descripción"
          />

          <TextField
            value={form.getField("phone_number")}
            onChangeText={form.setField("phone_number")}
            error={form.getError("phone_number")}
            placeholder="Número telefónico"
            keyboardType="numeric"
          />
        </View>

        <MultimediaAdder
          multimedia={multimedia}
          setMultimedia={setMultimedia}
        />        

        <Button
          onPress={handleUpdate}
          disabled={updateStoreMutation.isLoading}
        >
          {
            updateStoreMutation.isLoading ?
            <LoadingSpinner /> :
            "Confirmar"
          }
        </Button>
      </Padder>
    </Scroller>
  )
}
