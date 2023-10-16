import Empty from './Empty'
import { View, FlatList } from 'react-native'
import { Divider } from 'react-native-paper'
import configuration from '../configuration'

const Separator = () => {
  return (
    <View style={{ paddingVertical: 8 }}>
      <Divider style={{ color: configuration.ACCENT_COLOR_1 }}/>
    </View>
  )
}

export default ({ data, emptyMessage, emptyIcon, ...flatListProps }) => {
  return (
    <FlatList
      data={data}
      {...flatListProps}
      ItemSeparatorComponent={<Separator />}
      ListEmptyComponent={<Empty icon={emptyIcon} message={emptyMessage} />}
    />
  )
}
