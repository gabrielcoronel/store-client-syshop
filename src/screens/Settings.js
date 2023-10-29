import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useSession } from '../context'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import Dialog from 'react-native-dialog'
import SecondaryTitle from '../components/SecondaryTitle'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View,  StyleSheet } from 'react-native'
import { List, TouchableRipple, Text, Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    gap: 20
  },
  settingEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10
  }
})

const fetchStore = async (storeId) => {
  const payload = {
    store_id: storeId
  }
  const store = await requestServer(
    "/stores_service/get_store_by_id",
    payload
  )

  return store
}

const deleteStore = async (storeId) => {
  const payload = {
    user_id: storeId
  }
  const _ = await requestServer(
    "/users_service/delete_user",
    payload
  )
}

const SettingEntry = ({ setting, isDangerous, onPress }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <View style={styles.settingEntry}>
        <Text
          variant="bodyMedium"
          style={isDangerous ? { color: "red" } : { color: configuration.SECONDARY_COLOR }}
        >
          {setting}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={isDangerous ? "red" : configuration.SECONDARY_COLOR}
        />
      </View>
    </TouchableRipple>
  )
}

const CloseSessionDialog = ({ isVisible, onDismiss }) => {
  const navigation = useNavigation()
  const [_, setSession] = useSession()

  const handleCloseSession = () => {
    setSession(null)

    onDismiss()

    navigation.navigate("Welcome")
  }

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        ¿Estás seguro?
      </Dialog.Title>

      <Dialog.Description>
        Estás apunto de cerrar sesión
      </Dialog.Description>

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
        color="red"
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleCloseSession}
      />
    </Dialog.Container>
  )
}

const DeleteAccountDialog = ({ isVisible, onDismiss }) => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const handleSuccess = () => {
    onDismiss()

    navigation.navigate("Welcome")
  }

  const handleDeleteAccount = () => {
    deleteStoreMutation.mutate({ storeId: session.data.storeId })

    navigation.navigate("Welcome")
  }

  const deleteStoreMutation = useMutation(
    ({ storeId }) => deleteStore(storeId),
    {
      onSuccess: handleSuccess
    }
  )

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        ¿Estás seguro?
      </Dialog.Title>

      <Dialog.Description>
        No podrás recuperar tu cuenta después de eliminarla
      </Dialog.Description>

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
        color="red"
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleDeleteAccount}
      />
    </Dialog.Container>
  )
}

export default () => {
  const navigation = useNavigation()
  const [session, _] = useSession()

  const [isCloseSessionDialogVisible, setIsCloseSessionDialogVisible] = useState(false)
  const [isDeleteAccountDialogVisible, setIsDeleteAccountDialogVisible] = useState(false)

  const storeQuery = useQuery({
    queryKey: ["storeSettings"],
    queryFn: () => fetchStore(session.data.storeId),
    disabled: session.isLoading
  })

  if (storeQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Padder style={styles.container}>
      <SecondaryTitle>
        Configuración
      </SecondaryTitle>

      <List.Section>
        <SettingEntry
          setting="Tus ventas"
          onPress={() => navigation.navigate("SalesList")}
        />

        <SettingEntry
          setting="Reporte de ventas"
          onPress={() => navigation.navigate("SalesReport")}
        />

        <Divider />

        <SettingEntry
          setting="Editar domicilio"
          onPress={() => navigation.navigate("EditLocation")}
        />

        <SettingEntry
          setting="Hacer un reporte"
          onPress={() => navigation.navigate("CreateReport")}
        />

        <SettingEntry
          setting="Cerrar sesión"
          onPress={() => setIsCloseSessionDialogVisible(true)}
          isDangerous
        />

        <SettingEntry
          setting="Eliminar cuenta"
          onPress={() => setIsDeleteAccountDialogVisible(true)}
          isDangerous
        />
      </List.Section>

      <CloseSessionDialog
        isVisible={isCloseSessionDialogVisible}
        onDismiss={() => setIsCloseSessionDialogVisible(false)}
      />

      <DeleteAccountDialog
        isVisible={isDeleteAccountDialogVisible}
        onDismiss={() => setIsDeleteAccountDialogVisible(false)}
      />
    </Padder>
  )
}
