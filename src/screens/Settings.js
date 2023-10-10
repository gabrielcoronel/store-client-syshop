import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { checkEmail, makeNotEmptyChecker } from '../utilities/validators'
import { requestServer } from '../utilities/requests'
import LoadingSpinner from '../components/LoadingSpinner'
import Padder from '../components/Padder'
import Dialog from 'react-native-dialog'
import { View } from 'react-native'
import { RowItem, TableView } from 'react-native-ios-kit'
import { Text } from 'react-native-paper'

const changeEmail = async (storeId, email, password) => {
  const payload = {
    user_id: storeId,
    email,
    password
  }
  const _ = await requestServer(
    "/users_service/change_user_email",
    payload
  )
}

const changePassword = async (storeId, oldPassword, newPassword) => {
  const payload = {
    user_id: storeId,
    old_password: oldPassword,
    new_password: newPassword
  }
  const _ = await requestServer(
    "/users_service/change_user_password",
    payload
  )
}

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

const ChangeEmailDialog = ({ isVisible, onDismiss }) => {
  const [session, _] = useSession()

  const fillFormFields = (data) => {
    form.setField("email")(data.email)
  }

  const handleSubmit = () => {
    changeEmailMutation.mutate(form.fields)
  }

  const storeQuery = useQuery({
    queryKey: ["storeChangeEmail"],
    queryFn: () => fetchStore(session.data.storeId),
    onSuccess: fillFormFields,
    disabled: session.isLoading
  })
  const changeEmailMutation = useMutation(
    ({ email, password }) => changeEmail(session.data.storeId, email, password)
  )
  const form = useForm(
    {
      email: "",
      password: ""
    },
    {
      email: checkEmail,
      password: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  if (changeEmailMutation.isSuccess) {
    onDismiss()
  }

  if (isVisible && (storeQuery.isLoading || changeEmailMutation.isLoading)) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        Cambia tu correo de electrónico
      </Dialog.Title>

      <Dialog.Input
        value={form.getField("email")}
        onChange={form.setField("email")}
        placeholder="Nuevo correo electrónico"
      />

      <Dialog.Input
        value={form.getField("password")}
        onChange={form.setField("password")}
        placeholder="Contraseña"
        secureTextEntry
      />

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleSubmit}
      />
    </Dialog.Container>
  )
}

const ChangePasswordDialog = ({ isVisible, onDismiss }) => {
  const [session, _] = useSession()

  const handleSubmit = () => {
    changePasswordMutation.mutate(form.fields)
  }

  const changePasswordMutation = useMutation(
    ({ oldPassword, newPassword }) => changePassword(session.data.storeId, oldPassword, newPassword)
  )
  const form = useForm(
    {
      oldPassword: "",
      newPassword: ""
    },
    {
      oldPassword: makeNotEmptyChecker("Contraseña vacía"),
      newPassword: makeNotEmptyChecker("Contraseña vacía")
    }
  )

  if (changePasswordMutation.isSuccess) {
    onDismiss()
  }

  if (isVisible && changePasswordMutation.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Dialog.Container visible={isVisible} onBackdropPress={onDismiss}>
      <Dialog.Title>
        Cambia tu contraseña
      </Dialog.Title>

      <Dialog.Input
        value={form.getField("newPassword")}
        onChange={form.setField("newPassword")}
        placeholder="Nueva contraseña"
        secureTextEntry
      />

      <Dialog.Input
        value={form.getField("oldPassword")}
        onChange={form.setField("oldPassword")}
        placeholder="Vieja contraseña"
        secureTextEntry
      />

      <Dialog.Button
        label="Cancelar"
        onPress={onDismiss}
      />

      <Dialog.Button
        label="Confirmar"
        onPress={handleSubmit}
      />
    </Dialog.Container>
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

  const [isChangeEmailDialogVisible, setIsChangeEmailDialogVisible] = useState(false)
  const [isChangePasswordDialogVisible, setIsChangePasswordDialogVisible] = useState(false)
  const [isCloseSessionDialogVisible, setIsCloseSessionDialogVisible] = useState(false)
  const [isDeleteAccountDialogVisible, setIsDeleteAccountDialogVisible] = useState(false)

  navigation.addListener("beforeRemove", (event) => {
    event.preventDefault()
  })

  const navigateToEditLocation = () => {
    navigation.navigate("EditLocation")
  }

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
    <Padder>
      <Text variant="titleLarge">
        Configuración
      </Text>

      <TableView header="Historial">
        <RowItem
          title="Tus ventas"
          onPress={() => navigation.navigate("SalesList")}
        />
      </TableView>

      <TableView header="Cuenta">
        <RowItem
          title="Editar domicilio"
          onPress={navigateToEditLocation}
        />

        <View>
          {
            storeQuery.data.account_type === "PlainAccount" ?
            (
              <View>
                <RowItem
                  title="Cambiar correo electrónico"
                  onPress={() => setIsChangeEmailDialogVisible(true)}
                />

                <RowItem
                  title="Cambiar contraseña"
                  onPress={() => setIsChangePasswordDialogVisible(true)}
                />
              </View>
            ) :
            null
          }
        </View>

        <RowItem
          title="Cerrar sesión"
          onPress={() => setIsCloseSessionDialogVisible(true)}
        />

        <RowItem
          title="Eliminar cuenta"
          onPress={() => setIsDeleteAccountDialogVisible(true)}
        />
      </TableView>

      <ChangeEmailDialog
        isVisible={isChangeEmailDialogVisible}
        onDismiss={() => setIsChangeEmailDialogVisible(false)}
      />

      <ChangePasswordDialog
        isVisible={isChangePasswordDialogVisible}
        onDismiss={() => setIsChangePasswordDialogVisible(false)}
      />

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
