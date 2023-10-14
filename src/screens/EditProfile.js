import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { makeNotEmptyChecker, checkPhoneNumber } from '../utilities/validators'
import TextField from '../components/TextField'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import MultimediaAdder from '../components/MultimediaAdder'
import Button from '../components/Button'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import { View, Text, Alert, StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  inputsContainer: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  multimediaSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  title: {
    fontSize: 35,
    color: "#344340",
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "gray",
    display: "flex",
    textAlign: "center",
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

const MultimediaSection = ({ multimedia, setMultimedia }) => {
  return (
    <View style={styles.multimediaSection}>
      <Subtitle>
        Edita las fotografías de tu emprendimiento
      </Subtitle>

      <MultimediaAdder
        multimedia={multimedia}
        setMultimedia={setMultimedia}
      />
    </View>
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
        <Title>
          Edita tu perfil
        </Title>

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

          <TextField
            value={form.getField("description")}
            onChangeText={form.setField("description")}
            error={form.getError("description")}
            placeholder="Descripción"
            multiline
          />

          <TextField
            value={form.getField("phone_number")}
            onChangeText={form.setField("phone_number")}
            error={form.getError("phone_number")}
            placeholder="Número telefónico"
            keyboardType="numeric"
          />
        </View>

        <Divider style={{ width: "90%" }}/>

        <MultimediaSection
          multimedia={multimedia}
          setMultimedia={setMultimedia}
        />        

        <Button
          onPress={handleUpdate}
          disabled={updateStoreMutation.isLoading}
          style={{ width: "70%" }}
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
