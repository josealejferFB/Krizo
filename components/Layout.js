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
import { TapGestureHandler } from 'react-native-gesture-handler';
import Logo from "../assets/logo.svg"; // Ruta exacta confirmada

export default function Layout({ children, navigation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuPosition = useSharedValue(-300); // Inicialmente oculto

  const menuOptions = [
    { title: 'Inicio', icon: 'home', screen: 'Home' },
    { title: 'Servicios', icon: 'tools', screen: 'Services' },
    { title: 'Mi Perfil', icon: 'account', screen: 'Profile' },
    { title: 'Billetera', icon: 'wallet', screen: 'Wallet' },
    { title: 'Promociones', icon: 'tag', screen: 'Promotions' },
    { title: 'Ajustes', icon: 'cog', screen: 'Settings' },
  ];

  const menuAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: menuPosition.value }],
    };
  });

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    menuPosition.value = withTiming(
      isMenuVisible ? -300 : 0,
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
      <Animated.View style={[styles.menuContainer, menuAnimation]}>
        <Surface style={styles.menuSurface} elevation={5}>
          {menuOptions.map((item, index) => (
            <React.Fragment key={item.screen}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate(item.screen);
                  toggleMenu();
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
              {index < menuOptions.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Surface>
      </Animated.View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
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
    marginLeft: 46,
  },
});
