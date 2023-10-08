import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import { View, Image } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Caption1 } from 'react-native-ios-kit'

export default ({ store }) => {
  const navigation = useNavigation()

  const navigateToStoreView = () => {
    navigation.navigate(
      "StoreView",
      {
        storeId: store.user_id
      }
    )
  }

  const footer = (
    <View>
      <Caption1>
        {store.name}
      </Caption1>

      <Caption1>
        {store.description}
      </Caption1>
    </View>
  )

  return (
    <Card
      footer={footer}
      onPress={navigateToStoreView}
    >
      <Image
        source={{
          uri: formatBase64String(store.picture),
          height: 100
        }}
      />
    </Card>
  )
}
