import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { ThemedInput, ThemedButton } from "../components/ThemedUIElements";
import ThemedBackgroundGradient from "../components/ThemedBackgroundGradient";
import Logo from "../assets/logo.svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <ThemedBackgroundGradient>
      {/* Logo en la parte superior central */}
      <View style={styles.logoContainer}>
        <Logo width={120} height={120} />
      </View>

      <Text style={styles.title}>¡Bienvenido! Inicia Sesión</Text>

      <View style={styles.formCard}>
        <ThemedInput
          label="Usuario"
          value={username}
          onChangeText={setUsername}
          left={<TextInput.Icon icon="account" color="#262525" />}
        />
        <ThemedInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              color="#262525"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <ThemedButton
          onPress={() => {
            console.log("Usuario:", username, "Contraseña:", password);
            navigation.replace("Home");
          }}
          icon="login"
          style={styles.loginButton}
        >
          Ingresar
        </ThemedButton>

        <View style={styles.krizoWorkerButton}>
          <MaterialCommunityIcons
            name="tow-truck"
            size={38}
            color="#FC5501"
            style={styles.krizoWorkerIcon}
          />
          <ThemedButton
            onPress={() => {
              navigation.navigate("KrizoWorkerLogin"); // <-- Cambia esto
            }}
            style={[
              styles.krizoWorkerButtonInner,
              { backgroundColor: "#262525" },
            ]}
            labelStyle={styles.krizoWorkerButtonLabel}
            mode="contained"
            contentStyle={{ height: 70 }}
          >
            Ingresar como KrizoWorker
          </ThemedButton>
        </View>
      </View>

      <ThemedButton
        onPress={() => {
          console.log("Navegando a Registro");
          navigation.navigate("Registration");
        }}
        style={styles.registerButton}
        labelStyle={styles.registerButtonLabel}
        mode="text"
      >
        ¿No tienes cuenta? Regístrate
      </ThemedButton>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
    textShadowColor: "#FC5501",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FC5501",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FC5501",
  },
  krizoWorkerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    width: "100%",
    height: 90,
    backgroundColor: "#262525",
    borderRadius: 16,
    position: "relative",
    paddingBottom: 12,
    borderWidth: 2, // Borde naranja
    borderColor: "#FC5501", // Borde naranja
  },
  krizoWorkerIcon: {
    position: "absolute",
    left: "50%",
    top: 10,
    marginLeft: -19,
    zIndex: 2,
  },
  krizoWorkerButtonInner: {
    flex: 1,
    backgroundColor: "transparent",
    elevation: 0,
    shadowColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginLeft: 0,
  },
  krizoWorkerButtonLabel: {
    color: "#FC5501",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 0,
    marginTop: 24, // Subido un poco más respecto al icono
  },
  registerButton: {
    marginTop: 10,
    alignSelf: "center",
    borderColor: "#FC5501",
    borderWidth: 2,
  },
  registerButtonLabel: {
    color: "#FC5501",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
