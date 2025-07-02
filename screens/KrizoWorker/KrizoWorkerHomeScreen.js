import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedBackgroundGradient from '../../components/ThemedBackgroundGradient';

export default function KrizoWorkerHomeScreen({ navigation }) {
  return (
    <ThemedBackgroundGradient>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarBox}>
              <Avatar.Icon size={64} icon="account-hard-hat" style={styles.avatar} color="#fff" />
            </View>
            <View style={styles.headerTextBox}>
              <Text style={styles.title}>¡Bienvenido!</Text>
              <Text style={styles.subtitle}>Panel de trabajador</Text>
            </View>
          </View>
          <Text style={styles.description}>
            Gestiona tus servicios, revisa solicitudes y accede a tus herramientas de trabajo.
          </Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionCard, styles.optionCardBlack]}
              onPress={() => navigation.navigate('KrizoWorkerRequests')}
            >
              <View style={[styles.optionIconCircle, styles.optionIconCircleBlack]}>
                <MaterialCommunityIcons name="clipboard-list" size={28} color="#FFD6B8" />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={[styles.optionTitle, styles.optionTitleBlack]}>Solicitudes</Text>
                <Text style={[styles.optionSubtitle, styles.optionSubtitleBlack]}>Ver y gestionar solicitudes de clientes</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD6B8" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, styles.optionCardBlack]}
              onPress={() => navigation.navigate('KrizoWorkerPayments')}
            >
              <View style={[styles.optionIconCircle, styles.optionIconCircleBlack]}>
                <MaterialCommunityIcons name="account-cash" size={28} color="#FFD6B8" />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={[styles.optionTitle, styles.optionTitleBlack]}>Mis pagos</Text>
                <Text style={[styles.optionSubtitle, styles.optionSubtitleBlack]}>Consulta tu historial de pagos</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD6B8" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, styles.optionCardBlack]}
              onPress={() => navigation.navigate('KrizoWorkerProfile')}
            >
              <View style={[styles.optionIconCircle, styles.optionIconCircleBlack]}>
                <MaterialCommunityIcons name="account-settings" size={28} color="#FFD6B8" />
              </View>
              <View style={styles.optionTextBox}>
                <Text style={[styles.optionTitle, styles.optionTitleBlack]}>Perfil</Text>
                <Text style={[styles.optionSubtitle, styles.optionSubtitleBlack]}>Edita tu información personal</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD6B8" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedBackgroundGradient>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 18,
    width: '92%',
    maxWidth: 370,
    alignSelf: 'center',
    marginTop: 38,
    marginBottom: 18,
    elevation: 10,
    shadowColor: '#FC5501',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop: 0,
    justifyContent: 'flex-start',
  },
  avatarBox: {
    marginRight: 16,
    backgroundColor: '#FC5501',
    borderRadius: 32,
    padding: 2,
    elevation: 4,
  },
  avatar: {
    backgroundColor: '#FC5501',
  },
  headerTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 2,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 15,
    color: '#C24100',
    fontStyle: 'italic',
    textAlign: 'left',
    marginBottom: 0,
  },
  description: {
    fontSize: 15,
    color: '#262525',
    textAlign: 'center',
    marginBottom: 22,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5ED',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
    shadowColor: '#FC5501',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  optionCardBlack: {
    backgroundColor: '#262525',
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD6B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIconCircleBlack: {
    backgroundColor: '#FC5501',
  },
  optionTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FC5501',
    marginBottom: 2,
  },
  optionTitleBlack: {
    color: '#FFD6B8',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#C24100',
    fontStyle: 'italic',
  },
  optionSubtitleBlack: {
    color: '#FFD6B8',
  },
});
