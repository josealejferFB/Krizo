import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text, Linking, Alert, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import UnifiedChatComponent from '../components/UnifiedChatComponent';
import { useAuth } from '../context/AuthContext';
import { styles } from '../components/ChatModalStyles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://192.168.1.14:5000/'

const ChatModal = ({ 
	visible, 
	onClose, 
	mechanic, 
	productToBuy, 
	onSendPurchaseRequest, 
	onConfirmService,
	onCancelPurchase,
	userType }) => {
  const { token, user } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [isBuying, setIsBuying] = useState(false); 

  useEffect(() => {
    if (visible && mechanic && !sessionId) {
      createChatSession();
    }
  }, [visible, mechanic, sessionId]);

const sendPurchaseRequest = async () => {
    if (!productToBuy || !sessionId) {
      Alert.alert('Error', 'Información de producto o sesión incompleta.');
      return;
    }

    try {
      setIsBuying(true);
      const messageData = {
        session_id: sessionId,
        message: `¡Quiero comprar ${productToBuy.selectedQuantity} unidad(es) de ${productToBuy.name} por $${productToBuy.price * productToBuy.selectedQuantity}!`,
        sender_type: userType,
        purchase_request: true,
        product_details: JSON.stringify({ ...productToBuy, quantity: productToBuy.selectedQuantity }),
      };

      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Solicitud de compra enviada. Ahora ve al chat para continuar.');
        onClose(); // Cierra el modal después de enviar
      } else {
        Alert.alert('Error', 'No se pudo enviar la solicitud de compra.');
      }
    } catch (error) {
      console.error('Error sending purchase request:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud de compra.');
    } finally {
      setIsBuying(false);
    }
  };


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
        {productToBuy && (
    <View style={styles.initialPurchaseContainer}>
    <TouchableOpacity
                    style={styles.closePurchaseButton}
                    onPress={onCancelPurchase}
                >
                    <Icon name="close-circle" size={24} color="#FC5501" />
                </TouchableOpacity>

        <Text style={styles.initialPurchaseText}>
            ¿Quieres enviar una solicitud de compra para este producto?
        </Text>
        <View style={styles.initialPurchaseDetails}>
            <Image
                source={{ uri: `${SERVER_URL}${productToBuy.imageUri}` }}
                style={styles.initialPurchaseImage}
            />
            <View style={styles.initialPurchaseInfo}>
                <Text style={styles.initialPurchaseTitle}>{productToBuy.name}</Text>
                <Text style={styles.initialPurchasePrice}>
                    Cantidad: {productToBuy.selectedQuantity}
                </Text>
                <Text style={styles.initialPurchasePrice}>
                    Precio total: ${productToBuy.price * productToBuy.selectedQuantity}
                </Text>
            </View>
        </View>
        <Button
            mode="contained"
            onPress={() => sendPurchaseRequest(productToBuy, productToBuy.selectedQuantity)}
            style={styles.initialPurchaseButton}
            disabled={isBuying}
        >
            {isBuying ? <ActivityIndicator color="white" /> : 'Enviar Solicitud de Compra'}
        </Button>
    </View>
)}
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
