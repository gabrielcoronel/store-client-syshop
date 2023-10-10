import { ScrollView } from 'react-native'

export default ({ children, ...props }) => {
  return (
    <ScrollView
      {...props}
    >
      {children}
    </ScrollView>
  )
}
