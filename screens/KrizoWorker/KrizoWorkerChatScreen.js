import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';

const KrizoWorkerChatScreen = ({ navigation, route }) => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const scrollViewRef = useRef();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';
const SERVER_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || 'http://192.168.1.14:5000/'
  
  useEffect(() => {
    if (route.params?.sessionId) {
      setSessionId(route.params.sessionId);
      setClientInfo(route.params.clientInfo);
      loadMessages();
    }
  }, [route.params]);

  useEffect(() => {
    if (sessionId) {
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}?sender_type=worker`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setMessages(result.data);
        }
      }
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId || sending) {
      return;
    }

    try {
      setSending(true);
      const messageData = {
        session_id: sessionId,
        message: newMessage,
        sender_type: 'worker'
      };

      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessages(prev => [...prev, result.data]);
          setNewMessage('');
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } else {
          Alert.alert('Error', result.message || 'No se pudo enviar el mensaje.');
        }
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje.');
      }
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje.');
    } finally {
      setSending(false);
    }
  };

const handlePurchaseAction = async (message, action) => {
  try {
    const productDetails = typeof message.product_details === 'string'
      ? JSON.parse(message.product_details)
      : message.product_details;

console.log(productDetails)

    const requestBody = {
      action: action, 
    };

console.log(requestBody)

    const response = await fetch(`${API_BASE_URL}/chat/purchase/${message.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

console.log(response.ok)

    if (response.ok) {
      const updatedMessages = messages.map(msg =>
        msg.id === message.id
          ? { ...msg, purchase_status: action }
          : msg
      );
      setMessages(updatedMessages);
      Alert.alert("Éxito", `Solicitud de compra ${action === 'accepted' ? 'aceptada' : 'rechazada'}.`);
    } else {
      const errorResult = await response.json();
console.log(errorResult.message)
      Alert.alert("Error", `No se pudo procesar la solicitud: ${errorResult.message}`);
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    Alert.alert("Error", "No se pudo procesar la solicitud.");
  }
};


const renderMessage = (message) => {
  const isWorker = message.sender_type === 'worker';

  if (message.purchase_request) {
	  
    const productDetails = typeof message.product_details === 'string'
      ? JSON.parse(message.product_details)
      : message.product_details;

    const isAccepted = message.purchase_status === 'accepted';
    const isRejected = message.purchase_status === 'rejected';
    const cardColor = isAccepted ? styles.acceptedCard : (isRejected ? styles.rejectedCard : styles.clientCard);
    const statusText = isAccepted ? 'Aceptada' : (isRejected ? 'Rechazada' : 'Pendiente');

    return (
      <View key={message.id} style={[styles.messageContainer, styles.clientMessage]}>
        <Card style={[styles.purchaseCard, cardColor]}>
          <Card.Content>
            <View style={styles.purchaseHeader}>
              <Icon name="cart-plus" size={24} color="#FC5501" />
              <Text style={styles.purchaseTitle}>Solicitud de Compra</Text>
            </View>
			<Image
            source={{ uri: `${SERVER_URL}${productDetails.imageUri}` }}
            style={styles.purchaseImage}
            resizeMode="cover"
          />
            <Text style={styles.productName}>{productDetails.name}</Text>
            <Text style={styles.productInfo}>Marca: {productDetails.brand}</Text>
            <Text style={styles.productInfo}>Cantidad: {productDetails.quantity}</Text>
            <Text style={styles.productInfo}>Precio unitario: ${productDetails.price.toFixed(2)}</Text>
            <Text style={styles.productInfo}>Total: ${(productDetails.price * productDetails.quantity).toFixed(2)}</Text>
            
  <View style={styles.buttonContainer}>
    <Button 
      mode="contained" 
      onPress={() => handlePurchaseAction(message, 'accepted')} 
      style={[styles.actionButton, styles.acceptButton]}
    >
      Aceptar
    </Button>
    <Button 
      mode="outlined" 
      onPress={() => handlePurchaseAction(message, 'rejected')} 
      style={[styles.actionButton, styles.rejectButton]}
      labelStyle={{ color: '#F44336' }}
    >
      Rechazar
    </Button>
  </View>

          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View key={message.id} style={[
      styles.messageContainer,
      isWorker ? styles.workerMessage : styles.clientMessage
    ]}>
      <View style={[
        styles.messageBubble,
        isWorker ? styles.workerBubble : styles.clientBubble
      ]}>
        <Text style={[
          styles.messageText,
          isWorker ? styles.workerText : styles.clientText
        ]}>
          {message.message}
        </Text>
        <Text style={styles.timestamp}>{new Date(message.created_at).toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FC5501" />
      <LinearGradient
        colors={['#FC5501', '#C24100']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Avatar.Text 
            size={40} 
            label={clientInfo?.firstName?.charAt(0) || 'C'} 
            style={styles.avatar}
          />
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>
              {clientInfo?.firstName} {clientInfo?.lastName}
            </Text>
            <Text style={styles.clientType}>Cliente</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="chat-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay mensajes aún</Text>
              <Text style={styles.emptySubtext}>Inicia la conversación</Text>
            </View>
          ) : (
            messages.map(renderMessage)
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Icon 
              name={sending ? "loading" : "send"} 
              size={20} 
              color={newMessage.trim() ? "white" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: { marginRight: 16, padding: 4 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { backgroundColor: 'rgba(255,255,255,0.2)' },
  clientInfo: { marginLeft: 15 },
  clientName: { color: 'white', fontSize: 16, fontWeight: 'bold', width: 150},
  clientType: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  chatContainer: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4 },
  messageContainer: { marginBottom: 12 },
  clientMessage: { alignItems: 'flex-start' },
  workerMessage: { alignItems: 'flex-end' },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clientBubble: { backgroundColor: '#e3f2fd', borderBottomLeftRadius: 4 },
  workerBubble: { backgroundColor: '#FC5501', borderBottomRightRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 20 },
  clientText: { color: '#333' },
  workerText: { color: 'white' },
  timestamp: { fontSize: 11, color: '#999', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#FC5501',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#e0e0e0' },
  purchaseCard: {
    maxWidth: '80%',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  workerCard: { backgroundColor: '#FF8A5C' },
  clientCard: { backgroundColor: '#FFCCBC' },
  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FC5501',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  productInfo: {
    fontSize: 14,
    color: '#666',
  },
  purchaseCard: {
    maxWidth: '80%',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  acceptedCard: { backgroundColor: '#DFFFD6' },
  rejectedCard: { backgroundColor: '#FFCCCB' },
  clientCard: { backgroundColor: '#FFCCBC' },
  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FC5501',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  productInfo: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
    purchaseImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10
  },
});

export default KrizoWorkerChatScreen;
