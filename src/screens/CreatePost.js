import axios from 'axios'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useForm } from '../utilities/hooks'
import { useSession } from '../context'
import { makeNotEmptyChecker } from '../utilities/validators'
import { requestServer } from '../utilities/requests'
import uuid from 'react-native-uuid'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/Button'
import TextField from '../components/TextField'
import MultimediaAdder from '../components/MultimediaAdder'
import VividIconButton from '../components/VividIconButton'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'
import Padder from '../components/Padder'
import Scroller from '../components/Scroller'
import InstagramSignInButton from '../components/InstagramSignInButton'
import Stepper, { useStepper } from '../components/Stepper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, ScrollView, Alert, StyleSheet } from 'react-native'
import { Chip, Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
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
    gap: 10
  }
})

const createPost = async (
  storeId,
  categories,
  multimedia,
  generalInformation
) => {
  const payload = {
    store_id: storeId,
    categories,
    multimedia,
    ...generalInformation
  }
  const _ = await requestServer(
    "/posts_service/create_post",
    payload
  )
}

const GeneralInformationSection = ({ form, onNext }) => {
  const navigation = useNavigation()

  const navigateToChooseInstagramPosts = (instagramAccessData) => {
    navigation.navigate(
      "ChooseInstagramPosts",
      {
        instagramAccessData
      }
    )
  }

  return (
    <View style={styles.section}>
      <Subtitle>
        Ingresa los datos de tu producto
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

      <Divider style={{ width: "90%", color: configuration.ACCENT_COLOR_1 }} />

      <Subtitle>
        También puedes registrarte con
      </Subtitle>

      <InstagramSignInButton
        text="Publica un producto de Instagram"
        onSignIn={navigateToChooseInstagramPosts}
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
        style={{ backgroundColor: configuration.BACKGROUND_COLOR }}
        textStyle={{ color: "white" }}
      >
        {c}
      </Chip>
    )
  })

  return (
    <View style={styles.section}>
      <Subtitle>
        Añade categorías a tu producto
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

      <ScrollView
        horizontal
        contentContainerStyle={styles.categoriesDisplay}
      >
        {categoriesChips}
      </ScrollView>

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
        Añade fotos que describan a tu producto
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
          "Publicar"
        }
      </Button>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const route = useRoute()
  const [session, _] = useSession()

  const instagramPost = route.params?.instagramPost

  const stepper = useStepper(3)
  const [categories, setCategories] = useState([])
  const [multimedia, setMultimedia] = useState([])

  const handleCreatePostSuccess = () => {
    Alert.alert(
      "Éxito",
      "Tu publicación se ha realizado con éxito"
    )

    queryClient.refetchQueries({
      queryKey: ["createdPosts"]
    })

    navigation.goBack()
  }

  const fillUpFormWithInstagramData = async () => {
    for (url of instagramPost.picturesUrls) {
      const response = await axios.get(url, {
        responseType: "arraybuffer"
      })

      const picture = Buffer.from(response.data, "binary").toString("base64")
      const newMultimedia = [picture, ...multimedia]

      setMultimedia(_ => newMultimedia)
      form.setField("description")(instagramPost.description)
    }

    Alert.alert(
      "Éxito",
      "Algunos datos de tu producto fueron cargados exitosamente desde Instagram"
    )
  }

  const handleSubmit = () => {
    if (!form.validate()) {
      return
    }

    createPostMutation.mutate({
      storeId: session.data.storeId,
      categories,
      multimedia,
      generalInformation: {
        ...form.fields,
        amount: Number(form.fields.amount),
        price: Number(form.fields.price)
      }
    })
  }

  const form = useForm(
    {
      title: "",
      description: "",
      amount: "1",
      price: "301"
    },
    {
      title: makeNotEmptyChecker("Título vacío"),
      description: () => null,
      amount: (value) => value <= 0 ? "Cantidad de unidades inválida" : null,
      price: (value) => value <= 300 ? "El precio tiene que ser mayor a ₡300" : null
    }
  )
  const createPostMutation = useMutation(
    ({
      storeId,
      categories,
      multimedia,
      generalInformation
    }) => createPost(
      storeId,
      categories,
      multimedia,
      generalInformation
    ),
    {
      onSuccess: handleCreatePostSuccess
    }
  )

  if (instagramPost !== undefined) {
    fillUpFormWithInstagramData()
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
            onNext={handleSubmit}
            isLoading={createPostMutation.isLoading}
          />
        )
    }
  }

  return (
    <Scroller>
      <KeyboardAwareScrollView>
        <Padder>
            <View style={styles.container}>
              <Title>
                Publica un producto
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
