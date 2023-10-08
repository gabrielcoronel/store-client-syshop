import { withTheme } from 'react-native-ios-kit'
import { TouchableRipple, List } from 'react-native-paper'

const AddressAutocompleteTile = ({ isSelected, address, onSelect, theme }) => {
  return (
    <TouchableRipple
      onPress={() => onSelect(address)}
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
        key={address.place_id}
        title={address.formatted}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </TouchableRipple>
  )
}

export default withTheme(AddressAutocompleteTile)
