import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text, Linking, Alert, SafeAreaView } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import UnifiedChatComponent from '../components/UnifiedChatComponent';
import { useAuth } from '../context/AuthContext';
import { styles } from '../components/ChatModalStyles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

const ChatModal = ({ visible, onClose, mechanic, onConfirmService }) => {
  const { token, user } = useAuth();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (visible && mechanic && !sessionId) {
      createChatSession();
    }
  }, [visible, mechanic, sessionId]);

  const createChatSession = async () => {
    try {
      const searchResponse = await fetch(`${API_BASE_URL}/chat/sessions/search?client_id=${user.id}&worker_id=${mechanic.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (searchResponse.ok) {
        const searchResult = await searchResponse.json();
        if (searchResult.success && searchResult.data) {
          setSessionId(searchResult.data.id);
          return;
        }
      }
      const sessionData = { worker_id: mechanic.id, client_id: user.id, service_type: 'mecanico' };
      const response = await fetch(`${API_BASE_URL}/chat/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(sessionData)
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSessionId(result.data.id);
        }
      }
    } catch (error) {
      console.error('❌ Error creando sesión de chat:', error);
    }
  };

 return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <LinearGradient colors={['#FC5501', '#C24100']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}><Icon name="close" size={24} color="white" /></TouchableOpacity>
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
          userType="client"
          showWorkerFeatures={true}
          onClose={onClose}
          mechanic={mechanic}
        />
      </View>
    </Modal>
  );
};

export default ChatModal;
