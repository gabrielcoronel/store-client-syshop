import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button'
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black'
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
    width: "100%",
    gap: 20,
    paddingHorizontal: 20
  },
});

export default () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>¡Empieza a vender!</Text>
        <Text style={styles.subtitle}>
          ¡Inicia sesión o regístrate para vender los árticulos de tu emprendimiento en cuestión de minutos!
        </Text>
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
