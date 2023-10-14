import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { requestServer } from '../utilities/requests'
import { selectPictureFromGallery } from '../utilities/camera'
import SearchInput from './SearchInput'
import LoadingSpinner from './LoadingSpinner'
import { View, StyleSheet, Dimensions } from 'react-native'
import { TableView, RowItem } from 'react-native-ios-kit'
import { IconButton, Chip } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white"
  },
  selectedCategoriesList: {
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    gap: 4,
    padding: 10,
    width: "100%"
  }
})

const fetchCategories = async (text) => {
  if (text === "") {
    return []
  }

  const payload = {
    search: text,
    start: 0,
    amount: 3
  }
  const categoriesNames = await requestServer(
    "/categories_service/search_categories_by_name",
    payload
  )

  return categoriesNames
}

const SelectedCategoriesList = ({ categoriesNames, onDelete }) => {
  if (categoriesNames.length === 0) {
    return null
  }

  const chips = categoriesNames
    .map((categoryName) => {
      return (
        <Chip
          key={categoryName}
          onClose={() => onDelete(categoryName)}
          icon="pound"
          closeIcon="close"
        >
          {categoryName}
        </Chip>
      )
    })

  return (
    <View style={styles.selectedCategoriesList}>
      {chips}
    </View>
  )
}

const RecommendedCategoriesList = ({ categoriesNames, onToggle }) => {
  const items = categoriesNames
      .map((categoryName) => {
        return (
          <RowItem
            key={categoryName}
            title={categoryName}
            onPress={() => onToggle(categoryName)}
          />
        )
      })

  return (
    <TableView header="Categorías">
      {items}
    </TableView>
  )
}

export default ({ onSearchSubmit, onPictureTaken, ...searchInputProps }) => {
  const [text, setText] = useState("")
  const [categoriesNames, setCategoriesNames] = useState([])
  const categoriesQuery = useQuery({
    queryKey: ["foundCategories"],
    queryFn: () => fetchCategories(text)
  })

  const toggleCategoryName = (categoryName) => {
    if (categoriesNames.includes(categoryName)) {
      const newCategoriesNames = categoriesNames
        .filter((c) =>  c !== categoryName)

      setCategoriesNames(newCategoriesNames)
    } else {
      const newCategoriesNames = [...categoriesNames, categoryName]

      setCategoriesNames(newCategoriesNames)
    }

    setText("")
  }

  const handleSearchUpdate = async (newText) => {
    setText(newText)

    await categoriesQuery.refetch()
  }

  const handleTakePicture = async () => {
    const picture = await selectPictureFromGallery()

    if (picture === null) {
      return
    }

    onPictureTaken(picture)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <SearchInput
            placeholder="Buscar..."
            value={text}
            onChangeText={handleSearchUpdate}
            onSubmitEditing={() => onSearchSubmit(text, categoriesNames)}
            {...searchInputProps}
          />
        </View>

        <IconButton
          icon="camera"
          onPress={handleTakePicture}
        /> 
      </View>

      <View>
        <SelectedCategoriesList
          categoriesNames={categoriesNames}
          onDelete={toggleCategoryName}
        />
      </View>
      
      {
        text !== "" ?
        (
          categoriesQuery.isLoading ?
          <LoadingSpinner /> :
          <RecommendedCategoriesList
            categoriesNames={categoriesQuery.data}
            onToggle={toggleCategoryName}
          />
        ) :
        null
      }
    </View>
  )
}
