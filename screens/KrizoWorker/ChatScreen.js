import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import UnifiedChatComponent from '../../components/UnifiedChatComponent';
import { styles } from '../../components/ChatModalStyles';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
 const { sessionId, partnerName, partnerPhone } = route.params;
  const { user } = useAuth(); // Asumiendo que obtienes el user del contexto de autenticación

  // Adaptamos los nombres del modal a la pantalla
  const mechanic = {
    name: partnerName,
    telefono: partnerPhone,
    paypal_email: route.params?.paypal_email || null, 
  };

  return (
    <View style={styles.modalContainer}>
      <LinearGradient colors={['#FC5501', '#C24100']} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}><Icon name="arrow-left" size={24} color="white" /></TouchableOpacity>
            <View style={styles.workerInfo}>
              <Avatar.Text size={40} label={mechanic?.name?.charAt(0) || 'M'} style={styles.avatar} />
              <View style={styles.workerDetails}>
                <Text style={styles.workerName}>{mechanic?.name || 'Mecánico'}</Text>
                <Text style={styles.workerStatus}>Mecánico • En línea</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.callButton} onPress={() => {
                if (mechanic?.telefono) { Linking.openURL(`tel:${mechanic.telefono}`); } else { Alert.alert('Error', 'No hay número de teléfono disponible'); }
              }}><Icon name="phone" size={20} color="white" /></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <UnifiedChatComponent
        sessionId={sessionId}
        userType="krizoworker"
        onClose={() => navigation.goBack()}
      />
    </View>
  );
};

export default ChatScreen;
