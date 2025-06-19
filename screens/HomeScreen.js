import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from "../assets/logo.svg"; // Ruta exacta confirmada

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
    <View style={styles.container}>
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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