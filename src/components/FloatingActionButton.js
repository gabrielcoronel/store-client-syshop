import { FAB } from 'react-native-paper'
import configuration from '../configuration'

export default ({ style, ...fabProps }) => {
  return (
    <FAB
      {...fabProps}
      customSize={45}
      color={configuration.ACCENT_COLOR_1}
      style={{
        ...style,
        backgroundColor: configuration.BACKGROUND_COLOR
      }}
    />
  )
}
