import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';

export default function KrizoWorkerServiceConfigScreen({ navigation }) {
  // Estados simulados para switches (puedes conectar con backend en el futuro)
  const [mechanicEnabled, setMechanicEnabled] = React.useState(true);
  const [craneEnabled, setCraneEnabled] = React.useState(false);
  const [storeEnabled, setStoreEnabled] = React.useState(true);

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón volver elegante */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIconCircle}>
            <MaterialCommunityIcons name="arrow-left" size={26} color="#FC5501" />
          </View>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Configurar servicios</Text>
          <Text style={styles.subtitle}>
            Aquí podrás activar o desactivar los servicios que ofreces como trabajador.
          </Text>

          {/* Botón para Mecánico */}
          <View style={styles.serviceRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="tools" size={28} color="#FC5501" />
            </View>
            <View style={styles.serviceTextBox}>
              <Text
                style={[
                  styles.statusText,
                  mechanicEnabled ? styles.statusActive : styles.statusInactive,
                ]}
              >
                {mechanicEnabled ? 'Activo' : 'Desactivado'}
              </Text>
              <Text style={styles.serviceText}>Mecánico</Text>
              <Text style={styles.serviceSubText}>Ofrece asistencia mecánica</Text>
            </View>
            <Switch
              value={mechanicEnabled}
              onValueChange={setMechanicEnabled}
              thumbColor={mechanicEnabled ? "#FC5501" : "#FFD6B8"}
              trackColor={{ false: "#FFD6B8", true: "#FC5501" }}
            />
            <TouchableOpacity style={styles.configButton} activeOpacity={0.7}>
              <MaterialCommunityIcons name="cog" size={24} color="#FC5501" />
            </TouchableOpacity>
          </View>

          {/* Botón para Grúa */}
          <View style={styles.serviceRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="tow-truck" size={28} color="#FC5501" />
            </View>
            <View style={styles.serviceTextBox}>
              <Text
                style={[
                  styles.statusText,
                  craneEnabled ? styles.statusActive : styles.statusInactive,
                ]}
              >
                {craneEnabled ? 'Activo' : 'Desactivado'}
              </Text>
              <Text style={styles.serviceText}>Grúa</Text>
              <Text style={styles.serviceSubText}>Ofrece servicios de grúa y remolque</Text>
            </View>
            <Switch
              value={craneEnabled}
              onValueChange={setCraneEnabled}
              thumbColor={craneEnabled ? "#FC5501" : "#FFD6B8"}
              trackColor={{ false: "#FFD6B8", true: "#FC5501" }}
            />
            <TouchableOpacity style={styles.configButton} activeOpacity={0.7}>
              <MaterialCommunityIcons name="cog" size={24} color="#FC5501" />
            </TouchableOpacity>
          </View>

          {/* Botón para Tienda */}
          <View style={styles.serviceRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="store" size={28} color="#FC5501" />
            </View>
            <View style={styles.serviceTextBox}>
              <Text
                style={[
                  styles.statusText,
                  storeEnabled ? styles.statusActive : styles.statusInactive,
                ]}
              >
                {storeEnabled ? 'Activo' : 'Desactivado'}
              </Text>
              <Text style={styles.serviceText}>Tienda</Text>
              <Text style={styles.serviceSubText}>Vende repuestos y productos</Text>
            </View>
            <Switch
              value={storeEnabled}
              onValueChange={setStoreEnabled}
              thumbColor={storeEnabled ? "#FC5501" : "#FFD6B8"}
              trackColor={{ false: "#FFD6B8", true: "#FC5501" }}
            />
            <TouchableOpacity style={styles.configButton} activeOpacity={0.7}>
              <MaterialCommunityIcons name="cog" size={24} color="#FC5501" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 36,
    paddingHorizontal: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FC5501',
  },
  backIconCircle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 6,
    padding: 2,
  },
  backButtonText: {
    color: '#FC5501',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 18,
    width: '92%',
    maxWidth: 370,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 6,
    marginTop: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#C24100',
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 18,
    width: '100%',
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD6B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFD6B8',
    marginBottom: 2,
  },
  serviceSubText: {
    fontSize: 13,
    color: '#FFD6B8',
    opacity: 0.8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 2,
  },
  statusActive: {
    color: '#1BC100',
  },
  statusInactive: {
    color: '#FF3D00',
  },
  configButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOpacity: 0.10,
    shadowRadius: 2,
  },
  removeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3D00',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 18,
    width: '100%',
    elevation: 3,
    shadowColor: '#FC5501',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  removeAllText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});