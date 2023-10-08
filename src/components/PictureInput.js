import { TouchableRipple, Avatar } from 'react-native-paper'
import { formatBase64String } from '../utilities/formatting'
import { selectPictureFromGallery } from '../utilities/camera'

export default ({ picture, onChangePicture, useUrl, ...avatarProps }) => {
  const handleChangePicture = async () => {
    const newPicture = await selectPictureFromGallery()

    if (newPicture === null) {
      return
    }

    onChangePicture(newPicture)
  }

  const source = useUrl ? picture : formatBase64String(picture)

  return (
    <TouchableRipple
      onPress={handleChangePicture}
    >
      <Avatar.Image
        source={{ uri: source }}
        {...avatarProps}
      />
    </TouchableRipple>
  )
}
