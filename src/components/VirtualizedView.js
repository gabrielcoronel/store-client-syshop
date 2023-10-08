import { Fragment } from 'react'
import { FlatList } from 'react-native'

export default ({ children })  => {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <Fragment>
          {children}
        </Fragment>
      )}
    />
  )
}
