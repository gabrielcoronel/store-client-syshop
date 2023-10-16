import { useNavigation } from '@react-navigation/native'
import { formatBase64String } from '../utilities/formatting'
import { View, StyleSheet } from 'react-native'
import { Text, TouchableRipple, Avatar } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainCardView: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "silver",
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 12,
    marginRight: 12,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "white",
    borderColor: configuration.SECONDARY_COLOR,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const formatLastMessage = (message) => {
  const contentType = message.content_type

  switch (contentType) {
    case "text":
      return message.content

    case "image":
      return "Imagen"
  }
}

export default ({ chat }) => {
  const navigation = useNavigation()

  const navigateToChat = () => {
    navigation.navigate("Chat", {
      chat
    })
  }

  return (
    <TouchableRipple
      onPress={navigateToChat}
    >
      <View style={styles.mainCardView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.subCardView}>
            <Avatar.Image
              source={{ uri: formatBase64String(chat.user.picture) }}
              size={50}
            />
          </View>

          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 14,
                color: configuration.ACCENT_COLOR_1,
                fontWeight: "bold"
              }}
            >
              {chat.user.name}
            </Text>

            <View
              style={{
                marginTop: 4,
                borderWidth: 0,
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "silver",
                  fontSize: 12,
                }}
              >
                {formatLastMessage(chat.last_message)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableRipple>
  )
}
