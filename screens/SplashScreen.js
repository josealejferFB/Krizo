import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; // ¡Importa LinearGradient!
import Logo from "../assets/logo.svg";

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

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const animatedLogoStyle = {
    opacity: fadeAnim,
    transform: [{ scale: pulseAnim }],
  };

  return (
    <View style={styles.container}>
      {/* El componente LinearGradient ocupa todo el fondo */}
      <LinearGradient
        colors={['#FC5501', '#C24100']} // De FC5501 a C24100
        start={{ x: 0, y: 1 }}           // Abajo a la izquierda (x=0, y=1)
        end={{ x: 1, y: 0 }}             // Arriba a la derecha (x=1, y=0)
        style={StyleSheet.absoluteFillObject} // Hace que ocupe todo el View padre
      />

      {/* Contenido de la pantalla encima del degradado */}

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
    alignItems: "center",
    justifyContent: "center",
    // Ya no necesitamos backgroundColor aquí porque LinearGradient lo cubre
  },
});