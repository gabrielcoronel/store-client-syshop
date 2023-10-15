import { formatDate, formatBase64String } from '../utilities/formatting'
import { List, Avatar } from 'react-native-paper'
import configuration from '../configuration'

export default ({ comment }) => {
  return (
    <List.Item
      titleStyle={{
        color: configuration.SECONDARY_COLOR
      }}
      title={`${comment.user_name} (${formatDate(comment.publication_date)})`}
      description={comment.text}
      left={(props) => <Avatar.Image {...props} source={{ uri: formatBase64String(comment.user_picture)}} />}
      titleNumberOfLines={3}
    />
  )
}
