import axios from 'axios'
import configuration from "../configuration"

const formatQueryString = (text) => {
  const queryParameters = new URLSearchParams()

  queryParameters.append("apiKey", configuration.GEOAPIFY_API_KEY)
  queryParameters.append("text", text)
  queryParameters.append("lang", "es")
  queryParameters.append("filter", "countrycode:cr")
  queryParameters.append("format", "json")

  const queryString = queryParameters.toString()

  return queryString
}

export const autocompleteAddress = async (text) => {
  const geoapifyUrl = "https://api.geoapify.com/v1/geocode/autocomplete?"

  if (text === "") {
    return null
  }

  const queryString = formatQueryString(text)

  const { data } = await axios.get(geoapifyUrl + queryString)
  const { results } = data

  const filteredResults = results.filter((address) => {
    return (address.name && address.address_line1 && address.city && (address.state || address.province) && address.postcode && address.lat && address.lon)
  })

  return filteredResults
}
