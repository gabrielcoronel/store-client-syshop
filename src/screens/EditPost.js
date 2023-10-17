import { useRoute } from '@react-navigation/native'
import Scroller from '../components/Scroller'
import Padder from '../components/Padder'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
    width: "100%"
  },
})

export default () => {
  const route = useRoute()

  const { postId } = route.params

  return (
    <Scroller>
      <KeyboardAwareScrollView>
        <Padder>
          <View style={styles.container}>
            <Title>
              Edita tu producto {postId}
            </Title>
          </View>
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
