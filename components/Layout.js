import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Divider } from 'react-native-paper'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler'; 
import Logo from "../assets/logo.svg"; 

export default function Layout({ children, navigation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuPosition = useSharedValue(-300);

  const menuAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: menuPosition.value }],
    };
  });

  const toggleMenu = () => {
    setIsMenuVisible(prev => {
      menuPosition.value = withTiming(
        prev ? -300 : 0,
        { duration: 300, easing: Easing.inOut(Easing.ease) }
      );
      return !prev;
    });
  };

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (isMenuVisible) {
        toggleMenu();
      }
    });

  const menuOptions = [
    { title: 'Inicio', icon: 'home', screen: 'Home' },
    { title: 'Servicios', icon: 'tools', screen: 'Services' },
    { title: 'Mi Perfil', icon: 'account', screen: 'MyProfile' },
    { title: 'Billetera', icon: 'wallet', screen: 'Wallet' }, // Cambia 'Details' por 'Wallet'
    { title: 'Promociones', icon: 'tag', screen: 'Details' },
    { title: 'Ajustes', icon: 'cog', screen: 'Details' },
    { title: 'Cerrar Sesión', icon: 'logout', action: () => {
        navigation.navigate('Login');
        toggleMenu();
      }
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Fondo degradado fijo */}
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
      {isMenuVisible && (
        <GestureDetector gesture={tapGesture}>
          <View style={styles.overlay} pointerEvents="auto" />
        </GestureDetector>
      )}

      {/* Menú lateral animado */}
      <Animated.View style={[styles.menuContainer, menuAnimation]}>
        <Surface style={styles.menuSurface} elevation={5}>
          <View style={styles.drawerHeader}>
            <Logo width={100} height={100} />
            <Text style={styles.drawerHeaderText}>Menú Krizo</Text>
          </View>
          <Divider style={styles.divider} />
          {menuOptions.map((item, index) => (
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
              {item.title === 'Ajustes' && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Surface>
      </Animated.View>
      {/* Contenido principal */}
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
    backgroundColor: 'transparent',
    zIndex: 80,
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
    backgroundColor: '#C24100', // Se sobreescribe en darkMode
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
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    marginBottom: 5,
  },
  themeToggleText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: 'bold',
  },
});