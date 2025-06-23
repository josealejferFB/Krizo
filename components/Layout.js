import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Surface, Text, Divider } from 'react-native-paper'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';

// ¡IMPORTANTE! Importa GestureHandlerRootView, Gesture y GestureDetector
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler'; 

// Asegúrate de que esta ruta sea correcta y que el SVG esté configurado en metro.config.js
import Logo from "../assets/logo.svg"; 

export default function Layout({ children, navigation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuPosition = useSharedValue(-300); // Posición inicial del menú (oculto a la izquierda)

  // Estilo animado para el menú lateral
  const menuAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: menuPosition.value }],
    };
  });

  // Función para abrir y cerrar el menú
  const toggleMenu = () => {
    setIsMenuVisible(prev => {
      menuPosition.value = withTiming(
        prev ? -300 : 0,
        { duration: 300, easing: Easing.inOut(Easing.ease) }
      );
      return !prev;
    });
  };
  // Define el gesto de tap para cerrar el menú al tocar fuera
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (isMenuVisible) {
        toggleMenu();
      }
    });
  // Ahora define el array de opciones del menú
  const menuOptions = [
    { title: 'Inicio', icon: 'home', screen: 'Home' },
    { title: 'Servicios', icon: 'tools', screen: 'Services' },
    { title: 'Mi Perfil', icon: 'account', screen: 'Details' },
    { title: 'Billetera', icon: 'wallet', screen: 'Details' },
    { title: 'Promociones', icon: 'tag', screen: 'Details' },
    { title: 'Ajustes', icon: 'cog', screen: 'Details' },
    { title: 'Cerrar Sesión', icon: 'logout', action: () => {
        navigation.navigate('Login');
        toggleMenu();
      }
    },
  ];

  return (
    // GestureHandlerRootView DEBE envolver todo el contenido que usa gestos
    <GestureHandlerRootView style={{ flex: 1 }}> 
      {/* Gradiente de fondo que cubre toda la pantalla */}
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Botón de hamburguesa para abrir el menú */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={toggleMenu}
      >
        <MaterialCommunityIcons name="menu" size={32} color="white" />
      </TouchableOpacity>

      {/* Logo pequeño y centrado arriba */}
      <View style={styles.krizoTopLabel}>
        <Logo width={36} height={36} />
      </View>
      
      {/* Overlay para detectar taps fuera del menú y cerrarlo */}
      {/* Solo se renderiza si el menú está visible */}
      {isMenuVisible && (
        <GestureDetector gesture={tapGesture}>
          <View style={styles.overlay} pointerEvents="auto" />
        </GestureDetector>
      )}
      {/* Menú lateral animado */}
      <Animated.View style={[styles.menuContainer, menuAnimation]}>
        <Surface style={styles.menuSurface} elevation={5}>
          {/* Encabezado del menú con el logo */}
          <View style={styles.drawerHeader}>
            <Logo width={100} height={100} />
            <Text style={styles.drawerHeaderText}>Menú Krizo</Text>
          </View>
          <Divider style={styles.divider} />
          {/* Renderizado de las opciones del menú */}
          {menuOptions.map((item, index) => (
            // IMPORTANTE: Usamos el 'index' como key para asegurar unicidad
            <React.Fragment key={index}> 
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  if (item.action) {
                    item.action(); 
                  } else {
                    navigation.navigate(item.screen); 
                    toggleMenu(); 
                  }
                }}
              >
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={26} 
                  color="white" 
                />
                <Text style={styles.menuText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
              {/* Agrega un divisor después de "Ajustes" */}
              {item.title === 'Ajustes' && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Surface>
      </Animated.View>
      {/* Contenido principal de la pantalla, que son los 'children' pasados al Layout */}
      <View style={styles.content}>
        {children} 
      </View>
    </GestureHandlerRootView> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100, 
  },
  krizoTopLabel: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  krizoTopText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    opacity: 0.7,
    letterSpacing: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // Puedes cambiar a 'rgba(0,0,0,0.5)' para un efecto de sombra al abrir el menú
    zIndex: 80, // Debe ser menor que el zIndex del menú (90)
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300, 
    height: '100%',
    zIndex: 90, 
  },
  menuSurface: {
    flex: 1,
    backgroundColor: '#C24100', 
    padding: 20,
    paddingTop: 80, 
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  content: {
    flex: 1,
    // Este paddingTop es importante para que el contenido no se superponga con el botón del menú
    paddingTop: 80, 
    paddingHorizontal: 20, 
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '500',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    height: 1,
    marginVertical: 10,
    marginLeft: 46, 
  },
});