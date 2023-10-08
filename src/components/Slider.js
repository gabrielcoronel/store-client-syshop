import { Slider as ImportedSlider } from '@miblanchard/react-native-slider'
import { withTheme } from 'react-native-ios-kit'

const Slider = ({
  minimumValue,
  maximumValue,
  selectedMinimumValue,
  selectedMaximumValue,
  onChange,
  theme,
  ...sliderProps
}) => {
  return (
    <ImportedSlider
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      value={[selectedMinimumValue, selectedMaximumValue]}
      onValueChange={onChange}
      {...sliderProps}

      thumbStyle={{ backgroundColor: "white" }}
      trackStyle={{ backgroundColor: theme.primaryColor }}
    />
  )
}

export default withTheme(Slider)
