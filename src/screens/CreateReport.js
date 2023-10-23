import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import TextField from '../components/TextField'
import Title from '../components/Title'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Alert, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    width: "100%"
  }
})

const createReport = async (content, userId) => {
  const payload = {
    user_id: userId,
    content
  }
  const _ = await requestServer(
    "/reports_service/create_report",
    payload
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const [content, setContent] = useState("")

  const handleSubmitReport = () => {
    createReportMutation.mutate({
      content,
      userId: session.data.customerId
    })
  }

  const handleSubmitReportSuccess = () => {
    Alert.alert(
      "Éxito",
      "Tu reporte se ha publicado con éxito"
    )

    navigation.goBack()
  }

  const createReportMutation = useMutation(
    ({ content, userId }) => createReport(content, userId),
    {
      onSuccess: handleSubmitReportSuccess
    }
  )

  return (
    <Scroller style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <Padder style={styles.container}>
          <Title>
            Haz un reporte
          </Title>

          <TextField
            value={content}
            onChangeText={setContent}
            placeholder="Tu reporte"
            style={{ height: 100 }}
            multiline
          />

          <Button
            style={{ width: "70%" }}
            disabled={content.length === 0}
            onPress={handleSubmitReport}
          >
            {
              createReportMutation.isLoading ?
              <LoadingSpinner /> :
              "Enviar"
            }
          </Button>
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
