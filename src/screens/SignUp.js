import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import { formatBase64String, formatLocation } from '../utilities/formatting'
import { selectPictureFromGallery } from '../utilities/camera'
import {
  makeNotEmptyChecker,
  checkEmail,
  checkPhoneNumber
} from '../utilities/validators'
import uuid from 'react-native-uuid'
import TextField from '../components/TextField'
import GoogleSignInButton from '../components/GoogleSignInButton'
import LoadingSpinner from '../components/LoadingSpinner'
import PictureInput from '../components/PictureInput'
import Button from '../components/Button'
import TextArea from '../components/TextArea'
import LocationSelector from '../components/LocationSelector'
import Screen from '../components/Screen'
import { View, Image, Alert, StyleSheet } from 'react-native'
import { Subhead } from 'react-native-ios-kit'
import { Text, IconButton, Divider, TouchableRipple } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16
  },
  locationSection: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    width: "100%"
  },
  inputsContainer: {
    flex: 1,
    gap: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  thirdText: {
    fontSize: 18,
    color: "#344340",
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
  }
})

const signUpWithPlainAccount = async (
  userInformation,
  multimedia,
  address
) => {
  const payload = {
    ...userInformation
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
  address
) => {
  delete userInformation["email"]
  delete userInformation["password"]

  const payload = {
    ...userInformation,
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
  const handleSelect = (address) => {
    const location = {
      place_name: address.name,
      street_address: address.address_line1,
      city: address.city,
      state: address.state ?? address.province,
      zip_code: address.postcode,
    }

    onSelect(location)
  }

  return (
    <View style={styles.locationSection}>
      <Text style={styles.subtitle}>
        Especifica el domicilio de tu emprendimiento
      </Text>

      <Subhead>
        {
          location !== null ?
          formatLocation(location) :
          null
        }
      </Subhead>

      <AddressInput
        onSelect={handleSelect}
      />
    </View>
  )
}

const MultimediaTile = ({ multimediaItem, onPress }) => {
  const uri = formatBase64String(multimediaItem)

  return (
    <TouchableRipple
      onPress={onPress}
    >
      <Image
        source={{
          uri,
          height: 75,
          width: 75
        }}
      />
    </TouchableRipple>
  )
}

const MultimediaSection = ({ multimedia, setMultimedia }) => {
  const handleAddMultimedia = async () => {
    const newPicture = await selectPictureFromGallery()

    if (newPicture === null) {
      return
    }

    const newMultimedia = [newPicture, ...multimedia]

    setMultimedia(newMultimedia)
  }

  const handleDeleteMultimedia = (multimediaItem) => {
    const newMultimedia = multimedia.filter((i) => i !== multimediaItem)

    setMultimedia(newMultimedia)
  }

  const multimediaTiles = multimedia.map((item) => {
    return (
      <MultimediaTile
        key={uuid.v4()}
        multimediaItem={item}
        onPress={() => handleDeleteMultimedia(item)}
      />
    )
  })

  return (
    <View>
      <Text style={styles.subtitle}>
        Añade imágenes de tu tienda
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
        <IconButton
          icon="plus"
          size={50}
          onPress={handleAddMultimedia}
        />

        {multimediaTiles}
      </View>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const [_, setSession] = useSession()

  const [signingUpWithPlainAccount, setSigninUpWithPlainAccount] = useState(true)
  const [useUrlPicture, setUseUrlPicture] = useState(false)
  const [googleUniqueIdentifier, setGoogleUniqueIdentifier] = useState(null)
  const [picture, setPicture] = useState("")
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
      address,
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
      address,
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
    <Screen style={styles.container}>
      <Text style={styles.title}>
        Registrarse
      </Text>

      <Text style={styles.subtitle}>
        Ingresa los datos de tu emprendimiento
      </Text>

      <PictureInput
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

      <Divider style={{ width: "90%" }} />

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

      <Text style={styles.thirdText}>
        También puedes registrarte con
      </Text>

      <GoogleSignInButton
        text="Registrate con Google"
        onSignIn={fillUpFormWithGoogleData}
      />
    </Screen>
  )
}
