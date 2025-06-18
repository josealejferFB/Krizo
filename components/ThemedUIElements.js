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
  const defaultButtonColors = {
    backgroundColor: '#FC5501',
    color: '#FFFFFF',
  };

  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={icon}
      style={[
        { width: '100%', paddingVertical: 8, marginTop: 20 },
        { backgroundColor: defaultButtonColors.backgroundColor },
        style,
      ]}
      labelStyle={[
        { fontSize: 18, color: defaultButtonColors.color },
        labelStyle,
      ]}
      {...rest}
    >
      {children}
    </Button>
  );
};