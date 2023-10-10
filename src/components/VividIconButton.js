import { IconButton } from 'react-native-paper'

export default ({ icon, ...iconButtonProps }) => {
  return (
    <IconButton
      mode="contained"
      icon={icon}
      {...iconButtonProps}
    />
  )
}
