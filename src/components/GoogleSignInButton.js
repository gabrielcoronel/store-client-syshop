import axios from 'axios'
import * as Google from 'expo-auth-session/providers/google'
import configuration from "../configuration"
import { useEffect } from 'react'
import { maybeCompleteAuthSession } from "expo-web-browser"
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
  
maybeCompleteAuthSession()

const googleLogoUri
    = "https://cdn-icons-png.flaticon.com/512/2504/2504739.png"

const styles = {
  button: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e9e9f2",
    color: "#757575",
    backgroundColor: "#e6e7e8"
  },
  buttonInnerView: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 500,
  }
}

const getUserInformation = async (accessToken) => {
  const googleUrl = "https://www.googleapis.com/userinfo/v2/me"
  const { data } = await axios.get(googleUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data
}

export default ({ text, onSignIn, ...touchableOpacityProps }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: configuration.GOOGLE_WEB_CLIENT_ID,
    androidClientId: configuration.GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: configuration.GOOGLE_EXPO_CLIENT_ID
    // iosClientId: ""
  })

  useEffect(() => {
    if ((response !== null) && (response.type === "success")) {
      const accessToken = response.authentication.accessToken

      getUserInformation(accessToken)
        .then((userInformation) => onSignIn(userInformation))
        .catch((_) => {
          Alert.alert(
            "Error de Google",
            "No se pudo acceder mediante Google, inténtalo más tarde"
          )
        })
    }
  }, [response])

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync()}
      {...touchableOpacityProps}
    >
      <View style={styles.buttonInnerView}>
        <Image source={{uri: googleLogoUri, width: 25, height: 25}} />

        <Text style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
