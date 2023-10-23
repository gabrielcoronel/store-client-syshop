import axios from 'axios'
import { Fragment, useRef } from 'react'
import InstagramLogin from 'react-native-instagram-login'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import configuration from '../configuration'

const instagramLogoUri =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/640px-Instagram_logo_2022.svg.png"

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

const getAccessData = async (authorizationCode) => {
  const url = "https://api.instagram.com/oauth/access_token"
  const payload = {
    client_id: configuration.INSTAGRAM_APPLICATION_ID,
    client_secret: configuration.INSTAGRAM_APPLICATION_SECRET,
    code: authorizationCode,
    grant_type: "authorization_code",
    redirect_uri: ""
  }
  const response = await axios.post(url, payload)

  if (response.status < 200 || response.status >= 300) {
    Alert.alert(
      "Error de Instagram",
      "No se pudo iniciar sesión en tu cuenta de Instagram"
    )
  }

  const accessData = response.data

  return accessData
}

export default ({ text, onSignIn }) => {
  const instagramLoginRef = useRef()

  const handlePress = () => {
    instagramLoginRef.current.show()
  }

  const handleSuccess = async (authorizationCode) => {
    const accessData = await getAccessData(authorizationCode)

    onSignIn(accessData)
  }

  const handleFailure = () => {
    Alert.alert(
      "Error de Instagram",
      "No se pudo iniciar sesión en tu cuenta de Instagram"
    )
  }

  return (
    <Fragment>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
      >
        <View style={styles.buttonInnerView}>
          <Image source={{uri: instagramLogoUri, width: 25, height: 25 }} />
          <Text style={styles.buttonText}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>

      <InstagramLogin
        ref={instagramLoginRef}
        appId={configuration.INSTAGRAM_APPLICATION_ID}
        appSecret={configuration.INSTAGRAM_APPLICATION_SECRET}
        redirectUrl="www.google.com"
        scopes={["user_profile", "user_media"]}
        onLoginSuccess={handleSuccess}
        onLoginFailure={handleFailure}
      />
    </Fragment>
  )
}
