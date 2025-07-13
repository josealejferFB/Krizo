import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function KrizoWorkerRequestsScreen({ navigation }) {
  // Números simulados de solicitudes pendientes
  const mechanicRequests = 2;
  const craneRequests = 1;
  const storeRequests = 4;

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón atrás elegante */}
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
          <Text style={styles.title}>Solicitudes</Text>
          <Text style={styles.subtitle}>Aquí verás y gestionarás las solicitudes de los clientes.</Text>

          <TouchableOpacity style={styles.serviceButton} activeOpacity={0.85}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="tools" size={28} color="#FC5501" />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.serviceText}>Mecánico</Text>
              <Text style={styles.serviceSubText}>Solicitudes de asistencia mecánica</Text>
            </View>
            <Badge style={styles.badge}>{mechanicRequests}</Badge>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD6B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceButton} activeOpacity={0.85}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="tow-truck" size={28} color="#FC5501" />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.serviceText}>Grúa</Text>
              <Text style={styles.serviceSubText}>Solicitudes de grúa y remolque</Text>
            </View>
            <Badge style={styles.badge}>{craneRequests}</Badge>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD6B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceButton} activeOpacity={0.85}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="store" size={28} color="#FC5501" />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.serviceText}>Tienda</Text>
              <Text style={styles.serviceSubText}>Pedidos de repuestos y productos</Text>
            </View>
            <Badge style={styles.badge}>{storeRequests}</Badge>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD6B8" />
          </TouchableOpacity>
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
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    width: '100%',
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    position: 'relative',
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
  textBox: {
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
    fontStyle: 'italic',
  },
  badge: {
    backgroundColor: '#FC5501',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    marginLeft: 8,
    marginRight: 4,
    minWidth: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
});
