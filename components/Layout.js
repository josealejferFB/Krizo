import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Divider } from 'react-native-paper'; // Importa Surface y Text de Paper
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler'; // Asegúrate de que gesture-handler esté bien instalado
import Logo from "../assets/logo.svg"; // Ruta exacta confirmada y configuración SVG en metro.config.js

export default function Layout({ children, navigation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuPosition = useSharedValue(-300); // Inicialmente oculto (izquierda)

  const menuOptions = [
    { title: 'Inicio', icon: 'home', screen: 'Home' },
    { title: 'Servicios', icon: 'tools', screen: 'Services' },
    { title: 'Mi Perfil', icon: 'account', screen: 'Details' }, // Usamos 'Details' como ruta genérica
    { title: 'Billetera', icon: 'wallet', screen: 'Details' },
    { title: 'Promociones', icon: 'tag', screen: 'Details' },
    { title: 'Ajustes', icon: 'cog', screen: 'Details' },
    { title: 'Cerrar Sesión', icon: 'logout', action: () => {
        // Al cerrar sesión, navega a la pantalla de Login
        navigation.navigate('Login'); // Navega a la ruta 'Login' definida en App.js
        toggleMenu(); // Cierra el menú después de la acción
      }
    },
  ];

  const menuAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: menuPosition.value }],
    };
  });

  const toggleMenu = () => {
    setIsMenuVisible(prev => !prev); // Usa la función de actualización de estado
    menuPosition.value = withTiming(
      isMenuVisible ? -300 : 0, // Si está visible, oculta; si no, muestra
      { duration: 300, easing: Easing.inOut(Easing.ease) }
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Botón de hamburguesa */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={toggleMenu}
      >
        <MaterialCommunityIcons name="menu" size={32} color="white" />
      </TouchableOpacity>

      {/* Menú lateral animado */}
      {/* TapGestureHandler envuelve el menú para cerrar al tocar fuera */}
      <TapGestureHandler onActivated={toggleMenu} enabled={isMenuVisible}>
        <Animated.View style={[styles.menuContainer, menuAnimation]}>
          <Surface style={styles.menuSurface} elevation={5}>
            {/* Header del menú con Logo */}
            <View style={styles.drawerHeader}>
              <Logo width={100} height={100} />
              <Text style={styles.drawerHeaderText}>Menú de Usuario</Text>
            </View>
            <Divider style={styles.divider} />

            {menuOptions.map((item, index) => (
              <React.Fragment key={item.screen || item.title}> {/* Key más robusta */}
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => {
                    if (item.action) {
                      item.action(); // Ejecuta la acción si existe (ej. Cerrar Sesión)
                    } else {
                      navigation.navigate(item.screen); // Navega a la pantalla
                      toggleMenu(); // Cierra el menú después de navegar
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
                {/* Añadir un divisor después de "Ajustes" para agrupar "Cerrar Sesión" */}
                {item.title === 'Ajustes' && <Divider style={styles.divider} />}
              </React.Fragment>
            ))}
          </Surface>
        </Animated.View>
      </TapGestureHandler>

      {/* Contenido principal de la pantalla, pasado como children */}
      <View style={styles.content}>
        {children} {/* Aquí se renderiza el contenido de la pantalla real */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // No background color here, as LinearGradient will cover it
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100, // Asegura que el botón esté por encima del contenido
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300, // Ancho del menú
    height: '100%',
    zIndex: 90, // Por debajo del botón, pero por encima del contenido
  },
  menuSurface: {
    flex: 1,
    backgroundColor: '#C24100', // Color del fondo del menú
    padding: 20,
    paddingTop: 80, // Espacio para la barra de estado y el logo/título
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
    // Esto es importante para que el contenido de la pantalla no se superponga con el botón de menú
    paddingTop: 80, // Ajusta esto según la posición de tu botón o si añades una barra superior
    paddingHorizontal: 20, // Padding lateral para el contenido
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
    marginLeft: 46, // Alinea el divisor con el texto del menú
  },
});