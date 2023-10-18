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
import Stepper, { useStepper } from '../components/Stepper'
import { View, Alert, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  section: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  inputsContainer: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center'
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

const GeneralInformationSection = ({ form, picture, setPicture, onNext }) => {
  return (
    <View style={styles.section}>
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

      <Button
        onPress={onNext}
        style={{ width: "70%" }}
      >
        Siguiente
      </Button>
    </View>
  )
}

const MultimediaSection = ({ multimedia, setMultimedia, onNext, isLoading }) => {
  return (
    <View style={styles.multimediaSection}>
      <Subtitle>
        Edita las fotografías de tu emprendimiento
      </Subtitle>

      <MultimediaAdder
        multimedia={multimedia}
        setMultimedia={setMultimedia}
      />

      <Button
        onPress={onNext}
        disabled={isLoading}
        style={{ width: "70%" }}
      >
        {
          updateStoreMutation.isLoading ?
          <LoadingSpinner /> :
          "Confirmar"
        }
      </Button>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const stepper = useStepper(2)
  const [picture, setPicture] = useState(null)
  const [multimedia, setMultimedia] = useState([])

  const handleSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["storeProfileView"]
    })

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

    setPicture(_ => data.picture)
    setMultimedia(_ => data.multimedia)
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
    ),
    {
      onSuccess: handleSuccess
    }
  )

  if (storeQuery.isLoading || session.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const getCurrentSection = () => {
    switch (stepper.position) {
      case 0:
        return (
          <GeneralInformationSection
            form={form}
            picture={picture}
            setPicture={setPicture}
            onNext={stepper.setNextPosition}
          />
        )

      case 1:
        return (
          <MultimediaSection
            multimedia={multimedia}
            setMultimedia={setMultimedia}
            onNext={handleUpdate}
            isLoading={updateStoreMutation.isLoading}
          />
        )
    }
  }

  return (
    <Scroller>
      <Padder style={styles.container}>
        <Title>
          Edita tu perfil
        </Title>

        <Stepper
          labels={["Información General", "Imágenes"]}
          stepCount={2}
          currentPosition={stepper.position}
          onPress={stepper.setPosition}
        />

        {getCurrentSection()}
      </Padder>
    </Scroller>
  )
}
