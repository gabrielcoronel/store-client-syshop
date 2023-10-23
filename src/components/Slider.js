import { Slider as ImportedSlider } from '@miblanchard/react-native-slider'
import { StyleSheet } from 'react-native'
import configuration from '../configuration'

const styles = StyleSheet.create({
  thumb: {
    backgroundColor: "white",
    shadowColor: "silver",
    shadowOffset: { width: -1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 8
  }
})

export default ({
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

      thumbStyle={styles.thumb}
      trackStyle={{ backgroundColor: configuration.ACCENT_COLOR_1 }}
    />
  )
}
