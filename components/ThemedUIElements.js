import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper'; // 'useTheme' ya no es necesario aquí

// --- Componente ThemedInput ---
export const ThemedInput = ({ label, value, onChangeText, secureTextEntry, style, ...rest }) => {
  const defaultInputStyle = {
    width: '100%',
    marginBottom: 15,
    // Puedes añadir estilos fijos adicionales aquí si todos tus inputs los comparten
    // Por ejemplo:
    // backgroundColor: '#FFFFFF',
    // borderRadius: 8,
    // paddingHorizontal: 10,
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined" // Puedes cambiar a "flat" si lo prefieres para todos los inputs
      style={[defaultInputStyle, style]} // Combina estilos por defecto con los que se pasen por prop
      // Si deseas un color de borde o texto primario específico para Paper en los inputs,
      // puedes establecerlo aquí directamente, sin depender del tema global de Paper.
      // Ejemplo:
      // theme={{ colors: { primary: '#FC5501', text: '#333333', placeholder: '#999999' } }}
      {...rest} // Pasa cualquier otra prop (como left/right icons, keyboardType)
    />
  );
};

// --- Componente ThemedButton ---
export const ThemedButton = ({ children, onPress, mode = "contained", icon, style, labelStyle, ...rest }) => {
  const defaultButtonColors = {
    backgroundColor: '#FC5501', // Color de fondo fijo para el botón (naranja/rojo de tu degradado)
    color: '#FFFFFF',           // Color de texto fijo para el botón (blanco para contraste)
  };

  return (
    <Button
      mode={mode} // El modo puede ser 'text', 'outlined' o 'contained'
      onPress={onPress}
      icon={icon} // Permite pasar un nombre de ícono
      style={[
        { width: '100%', paddingVertical: 8, marginTop: 20 }, // Estilos comunes de tamaño y espaciado
        { backgroundColor: defaultButtonColors.backgroundColor }, // Aplica el color de fondo fijo
        style, // Permite que estilos pasados anulen los predeterminados
      ]}
      labelStyle={[
        { fontSize: 18, color: defaultButtonColors.color }, // Aplica el color de texto fijo
        labelStyle, // Permite que estilos de etiqueta pasados anulen los predeterminados
      ]}
      {...rest} // Pasa cualquier otra prop (como disabled, loading)
    >
      {children}
    </Button>
  );
};