import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export const ThemedInput = ({ label, value, onChangeText, secureTextEntry, style, ...rest }) => {
  const defaultInputStyle = {
    width: 300,
    height: 55,
    marginBottom: 15,
    textAlign: 'center',
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
  const pressedBackgroundColor = '#3a3a3a'; 
  const textColor = '#FFFFFF';

  const buttonTheme = {
    colors: {
      primary: baseBackgroundColor, // Color base para el botón contenido
      onPrimary: textColor, // Color del texto del botón

    },
    roundness: 20, // Border radius de 20 para el tema del botón
  };

  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={icon}
      theme={buttonTheme} 
      buttonColor={baseBackgroundColor} // Aseguramos el color de fondo base
     
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