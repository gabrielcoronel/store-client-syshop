import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native'
import { Chip, Divider } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
    width: "100%"
  },
  generalInformationSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    width: "100%"
  },
  categoriesSection: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "100%"
  },
  categoriesDisplay: {
    gap: 10
  },
  multimediaSection: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "100%"
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

const GeneralInformationSection = ({ form }) => {
  return (
    <View style={styles.generalInformationSection}>
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
    </View>
  )
}

const CategoriesSection = ({ categories, setCategories }) => {
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
      >
        {c}
      </Chip>
    )
  })

  return (
    <View style={styles.categoriesSection}>
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
    </View>
  )
}

const MultimediaSection = ({ multimedia, setMultimedia }) => {
  return (
    <View style={styles.multimediaSection}>
      <Subtitle>
        Añade fotos que describan a tu producto
      </Subtitle>

      <MultimediaAdder
        multimedia={multimedia}
        setMultimedia={setMultimedia}
      />
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

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

  return (
    <Scroller>
      <KeyboardAwareScrollView>
        <Padder>
            <View style={styles.container}>
              <Title>
                Publica tu producto
              </Title>

              <GeneralInformationSection
                form={form}
              />

              <Divider style={{ width: "90%" }} />

              <CategoriesSection
                categories={categories}
                setCategories={setCategories}
              />

              <Divider style={{ width: "90%" }} />

              <MultimediaSection
                multimedia={multimedia}
                setMultimedia={setMultimedia}
              />

              <Divider style={{ width: "90%" }} />

              <Button
                onPress={handleSubmit}
                style={{ width: "70%" }}
              >
                {
                  createPostMutation.isLoading ?
                  <LoadingSpinner /> :
                  "Publicar"
                }
              </Button>
            </View>
        </Padder>
      </KeyboardAwareScrollView>
    </Scroller>
  )
}
