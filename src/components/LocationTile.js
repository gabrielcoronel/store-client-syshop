import { withTheme } from 'react-native-ios-kit'
import { TouchableRipple, List } from "react-native-paper"

const formatLocationSubtitle = (location) => {
  const formatted
    = `${location.street_address}, ${location.city}, ${location.state}`

  return formatted
}

const LocationTile = ({ location, isSelected, onPress, theme }) => {
  return (
    <TouchableRipple
      onPress={onPress}
    >
      <List.Item
        style={
          isSelected ?
          {
            backgroundColor: theme.primaryColor,
          } :
          null
        }
        titleStyle={
          isSelected ?
          {
            color: "white"
          } :
          null
        }
        descriptionStyle={
          isSelected ?
          {
            color: "white"
          } :
          null
        }
        title={location.place_name}
        description={formatLocationSubtitle(location)}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}

export default withTheme(LocationTile)
