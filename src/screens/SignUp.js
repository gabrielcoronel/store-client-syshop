import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatLocation } from '../utilities/formatting'
import {
  makeNotEmptyChecker,
  checkEmail,
  checkPhoneNumber
} from '../utilities/validators'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import Button from '../components/Button'
import LocationSelector from '../components/LocationSelector'
import MultimediaAdder from '../components/MultimediaAdder'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, Alert, StyleSheet } from 'react-native'
import { Subhead } from 'react-native-ios-kit'
import { Text, Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: "center",
    backgroundColor: configuration.BACKGROUND_COLOR
  },
  locationSection: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  multimediaSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  inputsContainer: {
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const signUpWithPlainAccount = async (
  userInformation,
  multimedia,
  location
) => {
  const payload = {
    ...userInformation,
    multimedia,
    location
  }

  const handleError = (data) => {
    if (data.message === "UNAVAILABLE_EMAIL") {
      Alert.alert(
        "Correo ocupado",
        "El correo electrónico que ingresaste ya está en uso"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/stores_service/sign_up_store_with_plain_account",
    payload,
    handleError
  )

  return session
}

const signUpWithGoogleAccount = async (
  userInformation,
  googleUniqueIdentifier,
  multimedia,
  location
) => {
  delete userInformation["email"]
  delete userInformation["password"]

  const payload = {
    ...userInformation,
    multimedia,
    location,
    google_unique_identifier: googleUniqueIdentifier
  }

  const handleError = (data) => {
    if (data.message === "GOOGLE_ACCOUNT_ALREADY_EXISTS") {
      Alert.alert(
        "Cuanta de Google ocupada",
        "Alguien ya se registró con esta cuenta de Google"
      )

      return true
    }

    return false
  }

  const session = await requestServer(
    "/stores_service/sign_up_store_with_google_account",
    payload,
    handleError
  )

  return session
}

const LocationSection = ({ location, onSelect }) => {
  return (
    <View style={styles.locationSection}>
      <Subtitle>
        Especifica el domicilio de tu emprendimiento
      </Subtitle>

      <Subhead>
        {
          location !== null ?
          formatLocation(location) :
          null
        }
      </Subhead>

      <LocationSelector
        onSelect={onSelect}
      />
    </View>
  )
}

const MultimediaSection = ({ multimedia, setMultimedia }) => {
  return (
    <View style={styles.multimediaSection}>
      <Subtitle>
        Añade imágenes de tu tienda
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
  const [_, setSession] = useSession()

  const [signingUpWithPlainAccount, setSigninUpWithPlainAccount] = useState(true)
  const [useUrlPicture, setUseUrlPicture] = useState(false)
  const [googleUniqueIdentifier, setGoogleUniqueIdentifier] = useState(null)
  const [picture, setPicture] = useState(null)
  const [location, setLocation] = useState(null)
  const [multimedia, setMultimedia] = useState([])

  const handleSignUp = () => {
    if (!form.validate() || location === null) {
      Alert.alert(
        "Información incompleta",
        "Ingresa la información necesaria para registrarte"
      )

      return
    }

    if (signingUpWithPlainAccount) {
      signUpWithPlainAccountMutation.mutate({
        picture,
        location,
        multimedia,
        ...form.fields
      })
    } else {
      signUpWithGoogleAccountMutation.mutate({
        googleUniqueIdentifier,
        location,
        multimedia,
        picture,
        ...form.fields
      })
    }
  }

  const handleChangePicture = (newPicture) => {
    setUseUrlPicture(false)
    setPicture(newPicture)
  }

  const fillUpFormWithGoogleData = (userInformation) => {
    form.setField("name")(userInformation.given_name)
    form.setField("email")("google@gmail.com")
    form.setField("password")("Google")

    setPicture(_ => userInformation.picture)
    setSigninUpWithPlainAccount(_ => false)
    setUseUrlPicture(_ => true)
    setGoogleUniqueIdentifier(_ => userInformation.id)
  }

  const form = useForm(
    {
      name: "",
      description: "",
      phone_number: "",
      email: "",
      password: ""
    },
    {
      name: makeNotEmptyChecker("Nombre vacío"),
      description: () => null,
      phone_number: checkPhoneNumber,
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )
  const signUpWithPlainAccountMutation = useMutation(
    ({
      multimedia,
      location,
      ...userInformation
    }) => signUpWithPlainAccount(
      userInformation,
      multimedia,
      location
    )
  )
  const signUpWithGoogleAccountMutation = useMutation(
    ({
      googleUniqueIdentifier,
      multimedia,
      location,
      ...userInformation
    }) => signUpWithGoogleAccount(
      userInformation,
      googleUniqueIdentifier,
      multimedia,
      location
    )
  )

  const signUpData =
    signUpWithPlainAccountMutation.isSuccess ?
    signUpWithPlainAccountMutation.data :
    (
      signUpWithGoogleAccountMutation.isSuccess ?
      signUpWithGoogleAccountMutation.data :
      null
    )
  const isSignUpLoading = (
    (signUpWithPlainAccountMutation.isLoading) ||
    (signUpWithGoogleAccountMutation.isLoading)
  )

  useEffect(() => {
    if (signUpData !== null) {
      setSession({
        token: signUpData.token,
        storeId: signUpData.user_id
      })

      navigation.navigate("Home")
    }
  }, [signUpData])

  return (
    <Scroller>
      <KeyboardAwareScrollView>
        <Padder style={styles.container}>
          <Title>
            Registrarse
          </Title>

          <Subtitle>
            Ingresa los datos de tu emprendimiento
          </Subtitle>

          <PictureInput
            defaultIcon="store"
            picture={picture}
            onChangePicture={handleChangePicture}
            useUrl={useUrlPicture}
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

            {
              signingUpWithPlainAccount ?
              (
                <View style={styles.inputsContainer}>
                  <TextField
                    value={form.getField("email")}
                    onChangeText={form.setField("email")}
                    error={form.getError("email")}
                    placeholder="Correo electrónico"
                  />

                  <TextField
                    value={form.getField("password")}
                    onChangeText={form.setField("password")}
                    error={form.getError("password")}
                    placeholder="Contraseña"
                    secureTextEntry
                  />
                </View>
              ) :
              null
            }
          </View>

          <Divider style={{ width: "90%" }} />

          <LocationSection
            location={location}
            onSelect={setLocation}
          />

          <Divider style={{ width: "90%" }} />

          <MultimediaSection
            multimedia={multimedia}
            setMultimedia={setMultimedia}
          />

          <Button
            onPress={handleSignUp}
            disabled={isSignUpLoading}
            style={{ width: "70%" }}
          >
            {
              isSignUpLoading ?
              <LoadingSpinner /> :
              "Registrarse"
            }
          </Button>

          <Divider style={{ width: "90%" }} />

          <Subtitle>
            También puedes registrarte con
          </Subtitle>

          <GoogleSignInButton
            text="Registrate con Google"
            onSignIn={fillUpFormWithGoogleData}
          />
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
