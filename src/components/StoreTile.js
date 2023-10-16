import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Image, StyleSheet } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Headline, Caption1, Subhead } from 'react-native-ios-kit'
import configuration from '../configuration'

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: configuration.SECONDARY_COLOR
  }
})

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

  const header = (
    <View>
      <Headline style={{ color: configuration.SECONDARY_COLOR }}>
        {store.name}
      </Headline>
    </View>
  )

  return (
    <Card
      header={header}
      onPress={navigateToStoreView}
      style={styles.card}
    >
      <Image
        source={{
          uri: formatBase64String(store.picture),
          height: 100
        }}
      />

      <Subhead>
        {store.description}
      </Subhead>

      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
          <MaterialCommunityIcons
            name='account'
            color={configuration.ACCENT_COLOR_1}
            size={24}
          />

          <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
            {store.follower_count}
          </Caption1>
      </View>
    </Card>
  )
}
