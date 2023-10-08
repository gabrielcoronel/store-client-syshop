import { formatDate, formatBase64String } from '../utilities/formatting'
import { RowItem } from 'react-native-ios-kit'

export default ({ comment }) => {
  return (
    <RowItem
      title={`${comment.user_name} (${formatDate(comment.publication_date)})`}
      subtitle={comment.text}
      icon={{ uri: formatBase64String(comment.user_picture) }} 
    />
  )
}
