import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';
import WithdrawMethodModal from '../../components/WithdrawMethodModal'; // Importa el componente

export default function KrizoWorkerPaymentsScreen() {
  // Simulación de datos
  const availableBalance = 1850.75;
  const mechanicEarnings = 900.25;
  const craneEarnings = 650.50;
  const shopEarnings = 300.00;
  const totalEarnings = mechanicEarnings + craneEarnings + shopEarnings;

  // Estadísticas (porcentaje de cada servicio)
  const mechanicPercent = mechanicEarnings / totalEarnings;
  const cranePercent = craneEarnings / totalEarnings;
  const shopPercent = shopEarnings / totalEarnings;

  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

  // Maneja la selección del método de retiro
  const handleWithdrawSelect = (data) => {
    setWithdrawModalVisible(false);
    // Aquí puedes manejar la lógica de retiro según el método y los datos recibidos
    // Por ejemplo: alert(JSON.stringify(data));
  };

  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.walletCard}>
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="wallet" size={32} color="#fff" />
            </View>
            <Text style={styles.title}>Mi Billetera</Text>
          </View>
          <Text style={styles.balanceLabel}>Saldo disponible para retiro</Text>
          <Text style={styles.balanceAmount}>${availableBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setWithdrawModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="cash-minus" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.withdrawButtonText}>Retirar saldo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.sectionTitle}>Tus ganancias</Text>
          <View style={styles.earningRow}>
            <MaterialCommunityIcons name="tools" size={26} color="#FC5501" style={styles.earningIcon} />
            <Text style={styles.earningLabel}>Mecánica</Text>
            <Text style={styles.earningAmount}>${mechanicEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.earningRow}>
            <MaterialCommunityIcons name="tow-truck" size={26} color="#FC5501" style={styles.earningIcon} />
            <Text style={styles.earningLabel}>Grúa</Text>
            <Text style={styles.earningAmount}>${craneEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.earningRow}>
            <MaterialCommunityIcons name="store" size={26} color="#FC5501" style={styles.earningIcon} />
            <Text style={styles.earningLabel}>Tienda</Text>
            <Text style={styles.earningAmount}>${shopEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Estadísticas de ingresos</Text>
          <Text style={styles.statsLabel}>Mecánica</Text>
          <ProgressBar progress={mechanicPercent} color="#FC5501" style={styles.progressBar} />
          <Text style={styles.statsLabel}>Grúa</Text>
          <ProgressBar progress={cranePercent} color="#C24100" style={styles.progressBar} />
          <Text style={styles.statsLabel}>Tienda</Text>
          <ProgressBar progress={shopPercent} color="#FFD6B8" style={styles.progressBar} />
        </View>
        
        <WithdrawMethodModal
          visible={withdrawModalVisible}
          onClose={() => setWithdrawModalVisible(false)}
          onSelect={handleWithdrawSelect}
        />

        {/* Aquí puedes agregar más secciones o lógica adicional */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#262525',
    textAlign: 'center',
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '96%',        // Cambiado de '92%' a '96%'
    maxWidth: 370,
    marginBottom: 24,
    elevation: 4,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    backgroundColor: '#FC5501',
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: '#FC5501',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '96%',        // Cambiado de '92%' a '96%'
    maxWidth: 370,
    marginBottom: 24,
    elevation: 4,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262525',
    marginBottom: 16,
  },
  earningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  earningIcon: {
    marginRight: 12,
  },
  earningLabel: {
    fontSize: 16,
    color: '#262525',
    flex: 1,
  },
  earningAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FC5501',
    textAlign: 'right',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '96%',        // Cambiado de '92%' a '96%'
    maxWidth: 370,
    marginBottom: 24,
    elevation: 4,
    alignSelf: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
});
