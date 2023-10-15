import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRoute } from '@react-navigation/native'
import { requestServer } from '../utilities/requests'
import ScrollView from '../components/ScrollView'
import PostTile from '../components/PostTile'
import StoreTile from '../components/StoreTile'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchInput from '../components/SearchInput'
import Slider from '../components/Slider'
import Empty from '../components/Empty'
import Padder from '../components/Padder'
import VirtualizedView from '../components/VirtualizedView'
import SecondaryTitle from '../components/SecondaryTitle'
import SegmentedControl from '@react-native-community/segmented-control'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    View,
    StyleSheet,
    ScrollView as ReactNativeScrollView
} from 'react-native'
import { Caption1 } from 'react-native-ios-kit'
import { Chip, Divider } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
    },
    content: {
      backgroundColor: "white",
      justifyContent: "flex-start",
      gap: 15
    },
    horizontalScrollView: {
        backgroundColor: "white",
        gap: 10
    },
    postsResultsContainer: {
      flex: 1,
      gap: 15
    },
    postsResultsFilters: {
      gap: 15,
      padding: 5
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

const PriceRangeSlider = ({
  limitPrice,
  minimumPrice,
  maximumPrice,
  onChangePriceRange
}) => {
  return (
    <View>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
          ₡0
        </Caption1>

        <Caption1 style={{ color: configuration.ACCENT_COLOR_1 }}>
          ₡{limitPrice}
        </Caption1>
      </View>

      <Slider
        minimumValue={0}
        maximumValue={limitPrice}
        selectedMinimumValue={minimumPrice}
        selectedMaximumValue={maximumPrice}
        onChange={onChangePriceRange}
        step={100}
      />
    </View>
  )
}

const PostsResultsFilters = ({ limitPrice, filters, onChangeFilters }) => {
    const {
        minimumPrice,
        maximumPrice,
        sortingPropertyIndex
    } = filters

    const handleSelectSortingPropertyIndex = (event) => {
      const newIndex = event.nativeEvent.selectedSegmentIndex

      onChangeFilters({
        ...filters,
        sortingPropertyIndex: newIndex
      })
    }

    const handleChangePriceRange = ([newMinimumPrice, newMaximumPrice]) => {
      onChangeFilters({
        ...filters,
        minimumPrice: newMinimumPrice,
        maximumPrice: newMaximumPrice
      })
    }

    return (
      <View style={styles.postsResultsFilters}>
        <SegmentedControl
          values={["precio", "fecha de publicación"]}
          selectedIndex={sortingPropertyIndex}
          onChange={handleSelectSortingPropertyIndex}
        />

        <View style={{ gap: 12 }}>
          {
            sortingPropertyIndex === 0 ?
            <PriceRangeSlider
              limitPrice={limitPrice}
              minimumPrice={minimumPrice}
              maximumPrice={maximumPrice}
              onChangePriceRange={handleChangePriceRange}
            /> :
            null
          }
        </View>
      </View>
    )
}

const SearchedCategoriesScrollView = ({ categoriesNames }) => {
    if (categoriesNames.length === 0) {
      return null
    }

    const categoriesNamesChips = categoriesNames.map((categoryName) => {
        return (
            <Chip
                icon="pound"
                key={categoryName}
            >
              {categoryName}
            </Chip>
        )
    })

    return (
        <ReactNativeScrollView
            horizontal
            contentContainerStyle={styles.horizontalScrollView}
        >
            {categoriesNamesChips}
        </ReactNativeScrollView>
    )
}

const StoresResultsScrollView = ({ searchedText }) => {
    const storesQuery = useQuery({
      queryKey: ["storesResults"],
      queryFn: () => fetchStores(searchedText)
    })

    if (storesQuery.isLoading) {
        return (
            <LoadingSpinner inScreen />
        )
    }

    if (storesQuery.data.length === 0) {
      return (
        <Empty
          icon="basket"
          message="No se encontraron resultados de tiendas"
        />
      )
    }

    const storesTiles = storesQuery.data.map((store) => {
        return (
            <StoreTile
                key={store.user_id}
                store={store}
            />
        )
    })

    return (
        <ReactNativeScrollView
            horizontal
            contentContainerStyle={styles.horizontalScrollView}
        >
            {storesTiles}
        </ReactNativeScrollView>
    )
}

const PostsResults = ({ searchedText, categoriesNames }) => {
    const [searchFilters, setSearchFilters] = useState({
        minimumPrice: 0,
        maximumPrice: null,
        sortingPropertyIndex: 0
    })

    const handleChangeFilters = (newSearchFilters) => {
        setSearchFilters(_ => newSearchFilters)

        postsQuery.refetch()
    }

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

    if (maximumPriceQuery.isLoading) {
        return (
          <LoadingSpinner inScreen />
        )
    }

    return (
        <View style={styles.postsResultsContainer}>
            <PostsResultsFilters
                limitPrice={maximumPriceQuery.data}
                filters={searchFilters}
                onChangeFilters={handleChangeFilters}
            />

            <Divider />

            <View style={{ flex: 1 }}>
              {
                  postsQuery.isFetching ?
                  <LoadingSpinner inScreen /> :
                  <ScrollView
                      data={postsQuery.data}
                      keyExtractor={(post) => post.post_id}
                      renderItem={({ item }) => <PostTile post={item} />}
                      emptyIcon="basket"
                      emptyMessage="No se encontraron resultados de publicaciones"
                  />
              }
            </View>
        </View>
    )
}

export default () => {
    const route = useRoute()

    const { text, categoriesNames } = route.params

    return (
      <VirtualizedView>
        <SafeAreaView style={styles.container}>
          <SearchInput
            value={text}
            showCancel={false}
            disabled
          />

          <Padder style={styles.content}>
            <SearchedCategoriesScrollView
                categoriesNames={categoriesNames}
            />

            <SecondaryTitle>
                Tiendas
            </SecondaryTitle>

            <StoresResultsScrollView
                searchedText={text}
            />

            <Divider />

            <SecondaryTitle>
                Publicaciones
            </SecondaryTitle>

            <PostsResults
                searchedText={text}
                categoriesNames={categoriesNames}
            />
          </Padder>
        </SafeAreaView>
      </VirtualizedView>
    )
}
