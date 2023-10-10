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

const changeEmail = async (customerId, email, password) => {
  const payload = {
    user_id: customerId,
    email,
    password
  }
  const _ = await requestServer(
    "/users_service/change_user_email",
    payload
  )
}

const changePassword = async (customerId, oldPassword, newPassword) => {
  const payload = {
    user_id: customerId,
    old_password: oldPassword,
    new_password: newPassword
  }
  const _ = await requestServer(
    "/users_service/change_user_password",
    payload
  )
}

const fetchCustomer = async (customerId) => {
  const payload = {
    customer_id: customerId
  }
  const customer = await requestServer(
    "/customers_service/get_customer_by_id",
    payload
  )

  return customer
}

const deleteCustomer = async (customerId) => {
  const payload = {
    user_id: customerId
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

  const customerQuery = useQuery({
    queryKey: ["customerChangeEmail"],
    queryFn: () => fetchCustomer(session.data.customerId),
    onSuccess: fillFormFields,
    disabled: session.isLoading
  })
  const changeEmailMutation = useMutation(
    ({ email, password }) => changeEmail(session.data.customerId, email, password)
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

  if (isVisible && (customerQuery.isLoading || changeEmailMutation.isLoading)) {
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
    ({ oldPassword, newPassword }) => changePassword(session.data.customerId, oldPassword, newPassword)
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
    deleteCustomerMutation.mutate({ customerId: session.data.customerId })

    navigation.navigate("Welcome")
  }

  const deleteCustomerMutation = useMutation(
    ({ customerId }) => deleteCustomer(customerId),
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

  const customerQuery = useQuery({
    queryKey: ["customerSettings"],
    queryFn: () => fetchCustomer(session.data.customerId),
    disabled: session.isLoading
  })

  if (customerQuery.isLoading) {
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
          title="Publicaciones que te gustan"
          onPress={() => navigation.navigate("LikedPosts")}
        />

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
            customerQuery.data.account_type === "PlainAccount" ?
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
