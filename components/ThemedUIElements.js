import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

const { width: viewportWidth } = Dimensions.get('window');

export const ThemedInput = ({ label, value, onChangeText, secureTextEntry, style, ...rest }) => {
  const defaultInputStyle = {
    width: 300,
    height: 55,
    marginBottom: 15,
    textAlign: 'left',
    borderRadius: 12,
    backgroundColor: '#F5F2F0',
  };

  const inputTheme = {
    colors: {
      placeholder: '#877063',
      text: '#262525',
      primary: '#262525',
      onSurfaceVariant: '#262525',
      onSurface: '#262525',
    },
    roundness: 12,
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined"
      style={[defaultInputStyle, style]}
      theme={inputTheme}
      outlineColor="#262525"
      activeOutlineColor="#262525"
      outlineStyle={{ borderWidth: 2 }}
      {...rest}
    />
  );
};

export const ThemedButton = ({ children, onPress, mode = "contained", icon, style, labelStyle, ...rest }) => {
  const baseBackgroundColor = '#262525';
  const textColor = '#FFFFFF';

  const buttonTheme = {
    colors: {
      primary: baseBackgroundColor,
      onPrimary: textColor,
    },
    roundness: 20,
  };

  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={icon}
      theme={buttonTheme}
      buttonColor={baseBackgroundColor}
      contentStyle={{ height: 55 }}
      style={[
        { width: 300, marginTop: 20, borderRadius: 20 },
        style,
      ]}
      labelStyle={[
        { fontSize: 18, color: textColor },
        labelStyle,
      ]}
      {...rest}
    >
      {children}
    </Button>
  );
};

export const themedStyles = StyleSheet.create({
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 18,
    width: '100%', // Antes probablemente era 90% o 92%
    maxWidth: 480, // Puedes aumentar este valor si quieres más ancho en tablets
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 32,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  logoutButton: {
    position: 'absolute',
    top: '10%',
    right: 16, // Antes: 32. Ahora más a la derecha
    zIndex: 999,
    backgroundColor: '#FC5501',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 0,
    width: '100%',
    maxWidth: 520,
    marginBottom: 30,
    elevation: 0,
    shadowColor: 'transparent',
    marginRight: 48,
  },
  headerIcon: {
    marginRight: 18,
    backgroundColor: '#262525', // Fondo oscuro para el icono de usuario
    borderRadius: 30,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#877063',
  },
  sectionTitleContainer: {
    width: '95%',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501',
    marginLeft: 8,
    marginBottom: 6,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginBottom: 18,
  },
  serviceCard: {
    backgroundColor: '#262525', // Cambiado a color oscuro
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para contraste
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 13,
    color: '#FFD6B8', // Texto más claro para contraste
    textAlign: 'center',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262525', // Cambiado a color oscuro
    borderRadius: 20,
    padding: 18,
    width: '95%',
    maxWidth: 420,
    marginTop: 10,
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para contraste
  },
  vehicleTextSmall: {
    fontSize: 13,
    color: '#FFD6B8', // Texto más claro para contraste
    marginTop: 2,
  },
  carouselSection: {
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
  },
  carouselWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  carousel: {
    flexGrow: 0,
    width: viewportWidth * 0.88,
    height: (viewportWidth * 0.88) / 1.1, // Más alto (relación 1.1)
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  carouselCard: {
    backgroundColor: '#FC5501',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '80%', // Aumenta el alto de la imagen
    resizeMode: 'contain', // Cambia a 'contain' para que no se corte
  },
  carouselCardContent: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  carouselCardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para contraste
    marginBottom: 6,
    textAlign: 'center',
  },
  carouselCardDescription: {
    fontSize: 14,
    color: '#FFD6B8', // Texto más claro para contraste
    textAlign: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
