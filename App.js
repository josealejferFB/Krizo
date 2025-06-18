import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white", fontSize: 40 }}>¡Hola, Esto es Krizo!</Text>
      <Text>Hola</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f25101",
    alignItems: "center",
    justifyContent: "center",
  },
});
