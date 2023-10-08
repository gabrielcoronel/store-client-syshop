import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { autocompleteAddress } from '../utilities/geoapify'
import TextField from './TextField'
import LoadingSpinner from './LoadingSpinner'
import AddressAutocompleteTile from './AddressAutocompleteTile'
import { View, FlatList } from 'react-native'

const addressToLocation = (address) => {
  const location = {
    place_name: address.name,
    street_address: address.address_line1,
    city: address.city,
    state: address.state ?? address.province,
    zip_code: address.postcode,
  }

  return location
}

export default ({ onSelect }) => {
  const [searchedText, setSearchedText] = useState("")

  const handleUpdateSearch = (newSearchedText) => {
    setSearchedText(_ => newSearchedText)

    getAddressesMutation.mutate({
      searchedText
    })
  }

  const handleSelect = (address) => {
    const location = addressToLocation(address)

    onSelect(location)
  }

  const getAddressesMutation = useMutation(
    ({ searchedText }) => autocompleteAddress(searchedText)
  )

  return (
    <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
      <TextField
        value={searchedText}
        onChangeText={handleUpdateSearch}
        placeholder="Dirección"
      />

      <View style={{ height: 250, width: "100%" }}>
        {
          getAddressesMutation.isLoading ?
          <LoadingSpinner inScreen /> :
          (
            <View style={{ borderWidth: 1, borderColor: "black" }}>
              <FlatList
                data={getAddressesMutation.data}
                keyExtractor={(address) => address.place_id}
                renderItem={({ item }) => {
                  return (
                    <AddressAutocompleteTile
                      address={item}
                      onSelect={handleSelect}
                    /> 
                  )
                }}
              />
            </View>
          )
        }
      </View>
    </View>
  )
}
