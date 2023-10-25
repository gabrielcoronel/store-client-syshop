import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { requestServer } from '../utilities/requests'
import { makeNotEmptyChecker } from '../utilities/validators'
import uuid from 'react-native-uuid'
import Scroller from '../components/Scroller'
import Padder from '../components/Padder'
import ScrollView from '../components/ScrollView'
import TextField from '../components/TextField'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import VividIconButton from '../components/VividIconButton'
import Button from '../components/Button'
import MultimediaAdder from '../components/MultimediaAdder'
import LoadingSpinner from '../components/LoadingSpinner'
import Stepper, { useStepper } from '../components/Stepper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  View,
  Alert,
  StyleSheet,
  ScrollView as ReactNativeScrollView
} from 'react-native'
import { Chip } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "100%"
  },
  section: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  categoriesDisplay: {
    padding: 10,
    gap: 10
  }
})

const fetchPost = async (postId) => {
  const payload = {
    post_id: postId
  }
  const post = await requestServer(
    "/posts_service/get_post_by_id",
    payload
  )

  return post
}

const updatePost = async (postId, fields, categories, multimedia) => {
  const payload = {
    post_id: postId,
    ...fields,
    categories,
    multimedia
  }
  const _ = await requestServer(
    "/posts_service/update_post",
    payload
  )
}

const GeneralInformationSection = ({ form, onNext }) => {
  return (
    <View style={styles.section}>
      <Subtitle>
        Edita los datos de tu producto
      </Subtitle>

      <TextField
        value={form.getField("title")}
        onChangeText={form.setField("title")}
        error={form.getError("title")}
        placeholder="Título"
      />

      <TextField
        value={form.getField("description")}
        onChangeText={form.setField("description")}
        error={form.getError("description")}
        placeholder="Descripción"
        multiline
      />
    
      <TextField
        value={form.getField("price")}
        onChangeText={form.setField("price")}
        error={form.getError("price")}
        placeholder="Precio"
        keyboardType="numeric"
      />

      <TextField
        value={form.getField("amount")}
        onChangeText={form.setField("amount")}
        error={form.getError("amount")}
        placeholder="Cantidad de unidades"
        keyboardType="numeric"
      />

      <Button
        onPress={onNext}
        style={{ width: "70%" }}
      >
        Siguiente
      </Button>
    </View>
  )
}

const CategoriesSection = ({ categories, setCategories, onNext }) => {
  const [currentCategory, setCurrentCategory] = useState("")

  const handleAddCategory = () => {
    const newCategories = [currentCategory, ...categories]

    setCategories(newCategories)
    setCurrentCategory("")
  }

  const handleDeleteCategory = (category) => {
    const newCategories = categories.filter((c) => c !== category)

    setCategories(newCategories)
  }

  const categoriesChips = categories.map((c) => {
    return (
      <Chip
        key={uuid.v4()}
        icon="pound"
        closeIcon="close"
        onClose={() => handleDeleteCategory(c)}
        style={{ backgroundColor: configuration.ACCENT_COLOR_1 }}
        textStyle={{ color: "white" }}
      >
        {c}
      </Chip>
    )
  })

  return (
    <View style={styles.section}>
      <Subtitle>
        Edita las categorías de tu producto
      </Subtitle>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          rowGap: 15
        }}
      >
        <TextField
          value={currentCategory}
          onChangeText={setCurrentCategory}
          placeholder="Categoría"
        />

        <VividIconButton
          icon="plus"
          onPress={handleAddCategory}
        />
      </View>

      <ReactNativeScrollView
        horizontal
        contentContainerStyle={styles.categoriesDisplay}
      >
        {categoriesChips}
      </ReactNativeScrollView>

      <Button
        onPress={onNext}
        style={{ width: "70%" }}
      >
        Siguiente
      </Button>
    </View>
  )
}

const MultimediaSection = ({ multimedia, setMultimedia, onNext, isLoading }) => {
  return (
    <View style={styles.section}>
      <Subtitle>
        Edita las fotos del producto
      </Subtitle>

      <MultimediaAdder
        multimedia={multimedia}
        setMultimedia={setMultimedia}
      />

      <Button
        onPress={onNext}
        disabled={isLoading}
        style={{ width: "70%" }}
      >
        {
          isLoading ?
          <LoadingSpinner /> :
          "Actualizar"
        }
      </Button>
    </View>
  )
}

export default () => {
  const route = useRoute()
  const navigation = useNavigation()
  const queryClient = useQueryClient()

  const { postId } = route.params

  const stepper = useStepper(3)
  const [categories, setCategories] = useState([])
  const [multimedia, setMultimedia] = useState([])

  const handleSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["createdPosts"]
    })

    Alert.alert(
      "Éxito",
      "Información actualizada con éxito"
    )

    navigation.navigate("Home")
  }

  const fillFormFields = (data) => {
    form.setField("title")(data.title)
    form.setField("description")(data.description)
    form.setField("amount")(data.amount.toString())
    form.setField("price")(data.price.toString())

    setCategories(_ => data.categories)
    setMultimedia(_ => data.multimedia)
  }

  const handleUpdate = () => {
    if (!form.validate()) {
      Alert.alert(
        "Información incompleta",
        "Ingresa información necesaria para actualizar los datos"
      )

      stepper.setPosition(0)

      return
    }

    updatePostMutation.mutate({
      postId,
      fields: form.fields,
      categories,
      multimedia
    })
  }

  const form = useForm(
    {
      title: null,
      description: null,
      amount: null,
      price: null
    },
    {
      title: makeNotEmptyChecker("Título vacío"),
      description: () => null,
      amount: (value) => value <= 0 ? "Cantidad de unidades inválida" : null,
      price: (value) => value <= 300 ? "El precio tiene que ser mayor a ₡300" : null
    }
  )
  const postQuery = useQuery({
    queryKey: ["postToEdit"],
    queryFn: () => fetchPost(postId),
    onSuccess: fillFormFields
  })
  const updatePostMutation = useMutation(
    ({ postId, fields, categories, multimedia }) => updatePost(
      postId, fields, categories, multimedia
    ),
    {
      onSuccess: handleSuccess
    }
  )

  if (postQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const getCurrentSection = () => {
    switch (stepper.position) {
      case 0:
        return (
          <GeneralInformationSection
            form={form}
            onNext={stepper.setNextPosition}
          />
        )

      case 1:
        return (
          <CategoriesSection
            categories={categories}
            setCategories={setCategories}
            onNext={stepper.setNextPosition}
          />
        )

      case 2:
        return (
          <MultimediaSection
            multimedia={multimedia}
            setMultimedia={setMultimedia}
            onNext={handleUpdate}
            isLoading={updatePostMutation.isLoading}
          />
        )
    }
  }

  return (
    <Scroller>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <Padder>
          <View style={styles.container}>
            <Title>
              Edita tu publicación
            </Title>

            <Stepper
              labels={["Información", "Categorías", "Imágenes"]}
              stepCount={3}
              currentPosition={stepper.position}
              onPress={stepper.setPosition}
            />

            {getCurrentSection()}
          </View>
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
