import Empty from './Empty'
import { View, FlatList } from 'react-native'

const Separator = () => {
  return (
    <View style={{ paddingVertical: 8, backgroundColor: "white" }}>
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
