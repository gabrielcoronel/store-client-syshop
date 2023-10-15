import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import { View, Image } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Caption1, Footnote } from 'react-native-ios-kit'
import configuration from '../configuration'

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
      <Footnote style={{ width: 100, color: configuration.SECONDARY_COLOR }}>
        {store.name}
      </Footnote>

      <Caption1 style={{ width: 100, color: "silver" }}>
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
          height: 100,
          width: 100
        }}
      />
    </Card>
  )
}
