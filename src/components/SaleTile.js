import { useNavigation } from '@react-navigation/native'
import { formatDate, formatBase64String } from '../utilities/formatting'
import { View, Image } from 'react-native'
import { Card } from '@ui-kitten/components'
import { Headline, Caption1 } from 'react-native-ios-kit'

export default ({ sale }) => {
  const navigation = useNavigation()

  const navigateToPostView = () => {
    navigation.navigate(
      "PostView",
      {
        postId: sale.post.post_id
      }
    )
  }

  const header = (
    <View>
      <Headline>
        {sale.post.title}
      </Headline>

      <Caption1>
        ₡{sale.post.price * sale.amount} 
        •
        {
          sale.amount === 1 ?
          "Una unidad" :
          `${sale.amount} unidades`
        }
        •
        Comprado el {formatDate(sale.purchase_date)}
      </Caption1>
    </View>
  )

  return (
    <Card
      header={header}
      onPress={navigateToPostView}
    >
        <Image
          source={{
            uri: formatBase64String(sale.post.multimedia[0]),
            height: 100
          }}
        />
    </Card>
  )
}
