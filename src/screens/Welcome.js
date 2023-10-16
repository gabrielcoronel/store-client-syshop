import { useNavigation } from '@react-navigation/native'
import Button from '../components/Button'
import Title from '../components/Title'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Image, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import configuration from '../configuration'
import SyShopLogo from '../../assets/syshop-logo.png'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: configuration.BACKGROUND_COLOR
  },
  informationEntry: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  buttonsContainer: {
    margin: 20,
    width: "100%",
    gap: 20,
    paddingHorizontal: 20
  },
});

const InformationEntry = ({ icon, text }) => {
  return (
    <View style={styles.informationEntry}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={configuration.ACCENT_COLOR_1}
      />

      <Text variant="bodySmall" style={{ color: "white" }}>
        {text}
      </Text>
    </View>
  )
}

export default () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={SyShopLogo}
        style={{ width: 200, height: 200 }}
      />

      <Title>
        ¡Empieza a vender!
      </Title>

      <View style={{ gap: 8, alignItems: "flex-start", padding: 20 }}>
        <InformationEntry
          icon="store"
          text="Coloca tu emprendimiento en línea"
        />

        <InformationEntry
          icon="bullhorn-variant"
          text="Conecta con tu público meta"
        />

        <InformationEntry
          icon="clipboard-check"
          text="Gestiona pagos y entregas fácilmente"
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          onPress={() => navigation.navigate('SignIn')}
        >
          Iniciar sesión
        </Button>

        <Button
          onPress={() => navigation.navigate("SignUp")}
        >
          Registrarse 
        </Button>
      </View>
    </SafeAreaView>
  );
};
