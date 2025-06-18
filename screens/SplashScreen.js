import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import Logo from "../assets/logo.svg"; // Ajusta la ruta del logo

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Navega a la pantalla de Login después de 3 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Usamos 'replace' para que el usuario no pueda volver a la Splash Screen
    }, 5000); // 3000 milisegundos = 3 segundos

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [navigation]); // El efecto se ejecuta cuando 'navigation' cambia (una vez al inicio)

  const animatedLogoStyle = {
    opacity: fadeAnim,
    transform: [{ scale: pulseAnim }],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={animatedLogoStyle}>
        <Logo width={200} height={200} />
      </Animated.View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f25101",
    alignItems: "center",
    justifyContent: "center",
  },
});