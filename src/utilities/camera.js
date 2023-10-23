import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

export const selectPictureFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.canceled) {
      return null
    }

    const picture = result.assets[0].base64

    return picture
}

export const takePictureFromCameraRoll = async () => {
    const result = await ImagePicker.launchCameraAsync({
        base64: true
    })

    if (result.canceled) {
      Alert.alert(
        "Cancelaste al tomar la fotografía"
      )

      return null
    }

    const picture = result.assets[0].base64

    return picture
}
