import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '../context'
import { autocompleteAddress } from '../utilities/geoapify'
import { requestServer } from '../utilities/requests'
import SearchInput from '../components/SearchInput'
import LoadingSpinner from '../components/LoadingSpinner'
import AddressAutocompleteTile from '../components/AddressAutocompleteTile'
import Button from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, StyleSheet, Dimensions } from 'react-native'
import { List } from 'react-native-paper'

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    position: "absolute",
    top: Dimensions.get("screen").height * 0.8,
    justifyContent: "center",
    alignItems: "center"
  }
})

const addLocation = async (geoapifyAddress, customerId) => {
  const location = {
    place_name: geoapifyAddress.name,
    street_address: geoapifyAddress.address_line1,
    city: geoapifyAddress.city,
    state: geoapifyAddress.state ?? geoapifyAddress.province,
    zip_code: geoapifyAddress.postcode,
  }
  const payload = {
    customer_id: customerId,
    ...location
  }
  const _ = await requestServer(
    "/locations_service/add_customer_location",
    payload
  )
}

const AddressAutocompleteInput = ({ selectedAddress, onSelect }) => {
  const [searchedText, setSearchedText] = useState("")

  const handleSearch = () => {
    getAddressesMutation.mutate({ searchedText })
  }

  const getAddressesMutation = useMutation(
    ({ searchedText }) => autocompleteAddress(searchedText)
  )

  if (getAddressesMutation.isLoading) {
    return (
      <LoadingSpinner inScreen />
    )
  }

  const tiles = !getAddressesMutation.data
      ? null
      : (
        getAddressesMutation.data.map((address) => {
          return (
            <AddressAutocompleteTile
              key={address.place_id}
              address={address}
              isSelected={
                (selectedAddress !== null) &&
                (address.place_id === selectedAddress.place_id)
              }
              onSelect={onSelect}
            />
          )
        })
      )

  return (
    <View>
      <SearchInput
        value={searchedText}
        onChangeText={setSearchedText}
        onSubmitEditing={handleSearch}
        placeholder="Ubicación"
      />

      <View>
        <List.Section>
          {tiles}
        </List.Section>
      </View>
    </View>
  )
}

export default () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [session, _] = useSession()

  const [selectedAddress, setSelectedAddress] = useState(null)

  const handleAdd = () => {
    addLocationMutation.mutate({
      selectedAddress,
      customerId: session.data.customerId
    })
  }

  const handleSuccess = (_) => {
    queryClient.refetchQueries({
      queryKey: ["customerLocations"]
    })

    navigation.goBack()
  }

  const addLocationMutation = useMutation(
    ({ selectedAddress, customerId }) => addLocation(selectedAddress, customerId),
    {
      onSuccess: handleSuccess
    }
  )

  return (
    <SafeAreaView style={{ gap: 20 }}>
      <AddressAutocompleteInput
        selectedAddress={selectedAddress}
        onSelect={setSelectedAddress}
      />

      <View
        style={styles.buttonContainer}
      >
        <Button
          style={{ width: "70%" }}
          onPress={handleAdd}
          disabled={
            selectedAddress === null || addLocationMutation.isLoading
          }
        >
          {
            addLocationMutation.isLoading ?
            <LoadingSpinner /> :
            "Añadir domicilio"
          }
        </Button>
      </View>
    </SafeAreaView>
  )
}
