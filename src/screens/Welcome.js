import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Image, Text, StyleSheet } from 'react-native'
import Button from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context'
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
  title: {
    fontSize: 35,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 40,
    textAlign: 'center'
  },
  buttonsContainer: {
    margin: 20,
    width: "100%",
    gap: 20,
    paddingHorizontal: 20
  },
});

export default () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={SyShopLogo}
        style={{ width: 200, height: 200 }}
      />

      <Text style={styles.title}>
        ¡Empieza a vender!
      </Text>

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
