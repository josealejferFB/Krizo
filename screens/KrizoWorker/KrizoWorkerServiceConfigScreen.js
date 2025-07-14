import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function KrizoWorkerServiceConfigScreen({ navigation }) {
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
          <Text style={styles.title}>Configuración de Servicios</Text>
          <Text style={styles.subtitle}>
            Configura los servicios que ofreces y tu información de trabajo.
          </Text>

          {/* Botón para Perfil de Servicios */}
          <TouchableOpacity 
            style={styles.profileRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('KrizoWorkerServiceProfile')}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="tools" size={28} color="#FC5501" />
            </View>
            <View style={styles.profileTextBox}>
              <Text style={styles.profileText}>Perfil de Servicios</Text>
              <Text style={styles.profileSubText}>Configuración de servicios ofrecidos</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#FC5501" />
          </TouchableOpacity>

          {/* Botón para Métodos de Pago */}
          <TouchableOpacity 
            style={styles.profileRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('KrizoWorkerPaymentMethods')}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="credit-card" size={28} color="#FC5501" />
            </View>
            <View style={styles.profileTextBox}>
              <Text style={styles.profileText}>Métodos de Pago</Text>
              <Text style={styles.profileSubText}>Configura PayPal y Binance Pay</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#FC5501" />
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262525',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD6B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD6B8',
    marginBottom: 4,
  },
  profileSubText: {
    fontSize: 14,
    color: '#FFD6B8',
    opacity: 0.8,
  },
});
