import { SearchBar } from 'react-native-elements'

export default ({ ...searchBarProps }) => {
  return (
    <SearchBar
      platform="ios"
      showCancel
      lightTheme
      {...searchBarProps}
    />
  )
}
