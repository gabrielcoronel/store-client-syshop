import { useState, Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import StoreTile from '../components/StoreTile'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchInput from '../components/SearchInput'
import VirtualizedView from '../components/VirtualizedView'
import SegmentedControl from '@react-native-community/segmented-control'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet } from 'react-native'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  screenSelector: {
    padding: 8,
    backgroundColor: configuration.BACKGROUND_COLOR
  }
})

const fetchStores = async (searchedName) => {
    const payload = {
        search: searchedName
    }
    const stores = await requestServer(
        "/stores_service/search_stores_by_name",
        payload
    )

    return stores
}

const fetchPosts = async (text, categories, filters) => {
  const payload = {
    searched_text: text,
    categories,
    sorting_property: filters.sortingProperty,
    sorting_schema: filters.sortingSchema,
    minimum_price: filters.minimumPrice,
    maximum_price: filters.maximumPrice
  }

  const posts = await requestServer(
    "/posts_service/search_posts_by_metadata",
    payload
  )

  return posts
}

const fetchMaximumPrice = async () => {
  const maximumPrice = await requestServer(
    "/posts_service/get_maximum_price"
  )

  return maximumPrice
}

const ScreenSelector = ({ value, onChange }) => {
  return (
    <View style={styles.screenSelector}>
      <SegmentedControl
        values={["Publicaciones", "Tiendas"]}
        selectedIndex={value}
        onChange={(event) => onChange(event.nativeEvent.selectedSegmentIndex)}
        backgroundColor={configuration.BACKGROUND_COLOR}
        tintColor={configuration.ACCENT_COLOR_1}
        fontStyle={{ color: "white" }}
        activeFontStyle={{ color: "white" }}
      />
    </View>
  )
}

const StoresList = ({ searchedText }) => {
  const storesQuery = useQuery({
    queryKey: ["storesResults"],
    queryFn: () => fetchStores(searchedText)
  })

  if (storesQuery.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <ScrollView
      data={storesQuery.data}
      keyExtractor={(store) => store.store_id}
      renderItem={({ item }) => <StoreTile store={item} />}
      emptyIcon="basket"
      message="No se encontraron resultados de tiendas"
    />
  )
}

const PostsList = ({ searchedText, categoriesNames }) => {
  const [searchFilters, setSearchFilters] = useState({
    minimumPrice: 0,
    maximumPrice: null,
    sortingPropertyIndex: 0
  })

  const maximumPriceQuery = useQuery({
    queryKey: ["maximumPrice"],
    queryFn: () => fetchMaximumPrice(),
    onSuccess: (maximumPrice) => setSearchFilters({
      ...searchFilters,
      maximumPrice
    })
  })
  const postsQuery = useQuery({
    queryKey: ["postsResults"],
    queryFn: () => fetchPosts(
      searchedText,
      categoriesNames,
      {
        minimumPrice: searchFilters.minimumPrice,
        maximumPrice: searchFilters.maximumPrice,
        sortingProperty: ["price", "sent_datetime"][searchFilters.sortingPropertyIndex],
        sortingSchema: "ascending"
      }
    ),
    enabled: maximumPriceQuery.isSuccess
  })

  if (maximumPriceQuery.isLoading || postsQuery.isFetching) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  return (
    <Fragment>
      <ScrollView
        data={postsQuery.data}
        keyExtractor={(post) => post.post_id}
        renderItem={({ item }) => <PostTile post={item} />}
        emptyIcon="basket"
        emptyMessage="No se encontraron resultados de publicaciones"
      />
    </Fragment>
  )
}

export default () => {
  const route = useRoute()

  const { text, categoriesNames } = route.params

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

  const getCurrentScreen = () => {
    switch (currentScreenIndex) {
      case 1:
        return (
          <StoresList
            searchedText={text}
          />
        )

      case 0:
        return (
          <PostsList
            searchedText={text}
            categoriesNames={categoriesNames}
          />
        )
    }
  }

  return (
    <VirtualizedView>
      <SafeAreaView style={styles.container}>
        <SearchInput
          value={text}
          showCancel={false}
          disabled
        />

        <ScreenSelector
          value={currentScreenIndex}
          onChange={setCurrentScreenIndex}
        />

        <View style={{ flex: 1, padding: 15 }}>
          {getCurrentScreen()}
        </View>
      </SafeAreaView>
    </VirtualizedView>
  )
}
