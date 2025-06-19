import React from 'react';
import { View, StyleSheet } from 'react-native'; // View y StyleSheet de react-native
import { Text, Divider } from 'react-native-paper'; // Text y Divider de react-native-paper
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from "../assets/logo.svg"; 
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient'; // Importa tu componente de gradiente

export default function HomeScreen({ navigation }) {
  const menuOptions = [
    { title: 'Inicio', icon: 'home', screen: 'Home' },
    { title: 'Servicios', icon: 'tools', screen: 'Services' },
    { title: 'Mi Perfil', icon: 'account', screen: 'Profile' },
    { title: 'Billetera', icon: 'wallet', screen: 'Wallet' },
    { title: 'Promociones', icon: 'tag', screen: 'Promotions' },
    { title: 'Ajustes', icon: 'cog', screen: 'Settings' },
  ];

  return (

    <ThemedBackgroundGradient> 
      {/* ENCABEZADO SOLO CON LOGO SVG */}
      <View style={styles.logoContainer}>
        <Logo 
          width={200} 
          height={80} 
          preserveAspectRatio="xMidYMid meet"
        />
      </View>

      {/* MENÚ DE OPCIONES */}
      <View style={styles.menuContainer}>
        {menuOptions.map((item, index) => (
          <React.Fragment key={item.screen}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={26} 
                color="white" 
                onPress={() => navigation.navigate(item.screen)}
              />
              <Text 
                style={styles.menuText}
                onPress={() => navigation.navigate(item.screen)}
              >
                {item.title}
              </Text>
            </View>
            {index < menuOptions.length - 1 && <Divider style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({

  content: {
    flex: 1, 
    padding: 20,

  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
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
    marginLeft: 46, // Alineado con los íconos
  },
});