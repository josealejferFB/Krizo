import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import ThemedBackgroundGradient from '../components/ThemedBackgroundGradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DepositMethodModal from '../components/DepositMethodModal'; // Importa el modal

export default function WalletScreen({ navigation }) {
  // Simulación de balance
  const balance = 1250.75;
  const [modalVisible, setModalVisible] = useState(false);

  const handleDepositPress = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleSelectMethod = (method) => {
    setModalVisible(false);
    // Aquí puedes navegar o mostrar otro modal según el método
    // Por ejemplo: navigation.navigate('DepositPayPal') o similar
    alert(`Seleccionaste: ${method}`);
  };

  return (
    <ThemedBackgroundGradient>
      <View style={styles.container}>
        {/* Contenedor blanco superior */}
        <View style={styles.topCard}>
          {/* Header naranja */}
          <View style={styles.headerOrangeContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation?.goBack && navigation.goBack()}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="arrow-left-bold-circle"
                  size={38}
                  color="#FC5501"
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <View style={styles.headerTitleBox}>
                <Text style={styles.headerTitle}>Mi Billetera</Text>
                <Text style={styles.headerSubtitle}>Gestión de depósitos y retiros</Text>
              </View>
              <View style={styles.headerRightIcon}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="wallet" size={28} color="#fff" />
                </View>
              </View>
            </View>
          </View>
          {/* Balance vistoso */}
          <View style={styles.balanceContainer}>
            <View style={styles.balanceIconCircle}>
              <MaterialCommunityIcons name="cash-multiple" size={38} color="#fff" />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.balanceLabel}>Balance actual</Text>
              <Text style={styles.balanceAmount}>${balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} activeOpacity={0.7}>
              <MaterialCommunityIcons name="refresh" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenedor blanco inferior: pestaña para depositar dinero */}
        <View style={styles.bottomCard}>
          <Text style={styles.depositTitle}>Depositar dinero</Text>
          <Text style={styles.depositSubtitle}>
            Selecciona cómo deseas añadir fondos a tu billetera
          </Text>
          <TouchableOpacity style={styles.depositButton} onPress={handleDepositPress}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.depositButtonText}>Depositar con pasarela de pago</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.depositButtonAlt}>
            <MaterialCommunityIcons name="cash" size={22} color="#FC5501" style={{ marginRight: 8 }} />
            <Text style={styles.depositButtonTextAlt}>Depositar en Efectivo</Text>
          </TouchableOpacity>
          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#C24100" style={{ marginRight: 6 }} />
            <Text style={styles.warningText}>
              ¡Importante! Para depósitos en efectivo, se te proporcionarán instrucciones para coordinar la entrega. Los fondos se verán reflejados una vez confirmada la recepción.
            </Text>
          </View>
        </View>
        {/* Modal de métodos de depósito */}
        <DepositMethodModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onSelectMethod={handleSelectMethod}
        />
      </View>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  topCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 0,
    width: '90%', // Reducido para mejor visualización en móvil
    maxWidth: 370, // Más acorde a pantallas de teléfono
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    marginBottom: 22,
    overflow: 'hidden',
    minHeight: 270, // Aumenta la altura para dar más aire y espacio al balance
  },
  headerOrangeContainer: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#FC5501',
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FC5501',
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#FFD6B8',
    marginTop: 2,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  headerRightIcon: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 0,
    elevation: 0,
    marginLeft: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C24100',
  },
  balanceContainer: {
    width: '100%', // Antes: '90%'. Ahora ocupa todo el ancho del topCard
    maxWidth: '100%',
    backgroundColor: '#C24100',
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 22, // Más padding interno
    paddingHorizontal: 28,
    marginTop: 0, // Quita el valor negativo para que no se solape
    elevation: 6,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  balanceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FC5501',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFD6B8',
  },
  balanceLabel: {
    color: '#FFD6B8',
    fontSize: 15,
    marginBottom: 2,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 2,
  },
  refreshButton: {
    backgroundColor: '#FC5501',
    borderRadius: 16,
    padding: 6,
    marginLeft: 12,
    elevation: 2,
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    width: '90%', // Igual que topCard
    maxWidth: 370,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    marginBottom: 18,
  },
  depositTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  depositSubtitle: {
    fontSize: 15,
    color: '#262525',
    marginBottom: 18,
    textAlign: 'center',
  },
  depositButton: {
    backgroundColor: '#FC5501',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 12,
    width: '100%',
    flexDirection: 'row',
  },
  depositButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  depositButtonAlt: {
    backgroundColor: '#FFD6B8',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    marginBottom: 18,
    width: '100%',
    flexDirection: 'row',
  },
  depositButtonTextAlt: {
    color: '#FC5501',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5ED',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFD6B8',
  },
  warningText: {
    color: '#C24100',
    fontSize: 13,
    textAlign: 'left',
    flex: 1,
  },
});