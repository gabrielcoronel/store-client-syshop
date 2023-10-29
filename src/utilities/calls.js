import { default as startPhoneCall } from 'react-native-phone-call'
import { Alert } from 'react-native'

const doCall = async (phoneNumber) => {
  try {
    await startPhoneCall({
      number: phoneNumber,
      prompt: true,
      skipCanOpen: true
    })
  } catch (error) {
    Alert.alert(
      "No se pudo realizar la llamada",
      "Inténtalo más tarde"
    )
  }
}

export const call = async (phoneNumber) => {
  Alert.alert(
    "Llamada con costo adicional",
    "Estás apunto de realizar una llamada externa a SyShop mediante tu servicio de telefonía, esto podría incluir un costo adicional",
    [
      {
        text: "Cancelar",
        onPress: null,
        style: "cancel"
      },
      {
        text: "Llamar",
        onPress: async () => await doCall(phoneNumber)
      }
    ]
  )
}
