import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking
} from 'react-native';
import { Button, Card, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const ChatModal = ({ visible, onClose, mechanic, onConfirmService, userType }) => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState(null);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const scrollViewRef = useRef();
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // Crear sesión de chat cuando se abre
  useEffect(() => {
    if (visible && mechanic && !sessionId) {
      createChatSession();
    }
  }, [visible, mechanic]);

  // Cargar mensajes cuando hay sessionId
  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  // Cargar mensajes cuando el modal se abre
  useEffect(() => {
    if (visible && sessionId) {
      loadMessages();
    }
  }, [visible, sessionId]);

  // Polling automático para nuevos mensajes cuando el modal está visible
  useEffect(() => {
    if (visible && sessionId) {
      const interval = setInterval(loadMessages, 5000); // Polling cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [visible, sessionId]);

  const createChatSession = async () => {
    try {
      console.log('🔄 Buscando sesión de chat existente...');
      
      // Primero buscar si ya existe una sesión activa entre este cliente y trabajador
      const searchResponse = await fetch(`${API_BASE_URL}/chat/sessions/search?client_id=${user.id}&worker_id=${mechanic.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (searchResponse.ok) {
        const searchResult = await searchResponse.json();
        if (searchResult.success && searchResult.data) {
          console.log('✅ Sesión existente encontrada:', searchResult.data.id);
          setSessionId(searchResult.data.id);
          loadMessages();
          return;
        }
      }

      console.log('🔄 Creando nueva sesión de chat...');
      const sessionData = {
        worker_id: mechanic.id,
        client_id: user.id,
        service_type: 'mecanico'
      };

      console.log('📤 Datos de sesión:', sessionData);

      const response = await fetch('${API_BASE_URL}/chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData)
      });

      console.log('📥 Respuesta del servidor:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📥 Datos de respuesta:', result);
        
        if (result.success) {
          console.log('✅ Sesión creada con ID:', result.data.id);
          setSessionId(result.data.id);
          
          // Mensaje inicial del trabajador
          const initialMessage = {
            id: 1,
            text: `Hola, soy ${mechanic?.name || 'el mecánico'}. ¿En qué puedo ayudarte? Cuéntame sobre el problema con tu vehículo.`,
            sender: 'worker',
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages([initialMessage]);
        } else {
          console.error('❌ Error en respuesta:', result.message);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error creando sesión de chat:', error);
    }
  };

  const loadMessages = async () => {
    if (!sessionId) return;

    try {
      // Solo mostrar log cada 10 cargas para evitar spam
      const shouldLog = Math.random() < 0.1; // 10% de probabilidad
      if (shouldLog) {
        console.log('🔄 Cliente cargando mensajes para sesión:', sessionId);
      }
      
      const response = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}?sender_type=${userType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          // Transformar los mensajes del formato del servidor al formato del componente
          const transformedMessages = result.data.map(msg => ({
            id: msg.id,
            text: msg.message,
            sender: msg.sender_type,
            timestamp: new Date(msg.created_at).toLocaleTimeString()
          }));
          
          // Solo mostrar log si hay cambios en el número de mensajes
          if (shouldLog && transformedMessages.length !== messages.length) {
            console.log('🔄 Mensajes transformados cliente:', transformedMessages.length, 'mensajes');
          }
          
          // Reemplazar todos los mensajes en lugar de agregar
          setMessages(transformedMessages);
          
          // Scroll al final después de cargar mensajes
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      } else {
        console.error('❌ Error cargando mensajes:', response.status);
      }
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  };

  const sendMessage = async () => {
    console.log('🔄 Intentando enviar mensaje...');
    console.log('📝 Mensaje:', newMessage);
    console.log('🆔 SessionId:', sessionId);
    console.log('👤 UserType:', userType);
    console.log('⏳ Sending:', sending);

    if (!newMessage.trim()) {
      console.log('❌ Mensaje vacío');
      return;
    }
    
    if (sending) {
      console.log('❌ Ya está enviando');
      return;
    }
    
    if (!sessionId) {
      console.log('❌ No hay sessionId');
      Alert.alert('Error', 'No hay sesión de chat activa');
      return;
    }

    try {
      setSending(true);
      
      const messageData = {
        session_id: sessionId,
        message: newMessage,
        sender_type: userType
      };

      console.log('📤 Enviando datos:', messageData);

      const response = await fetch('${API_BASE_URL}/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });

      console.log('📥 Respuesta del servidor:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📥 Datos de respuesta:', result);
        
        if (result.success) {
          console.log('✅ Mensaje enviado correctamente');
          // Agregar el mensaje a la lista local
          const newMsg = {
            id: result.data.id,
            text: result.data.message,
            sender: result.data.sender_type,
            timestamp: new Date(result.data.created_at).toLocaleTimeString()
          };
          setMessages(prev => [...prev, newMsg]);
          setNewMessage('');
        } else {
          console.error('❌ Error en respuesta:', result.message);
          Alert.alert('Error', result.message || 'No se pudo enviar el mensaje');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', response.status, errorText);
        Alert.alert('Error', 'No se pudo enviar el mensaje');
      }
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  const handlePriceAgreement = async () => {
    if (!priceInput.trim() || !sessionId) {
      Alert.alert('Error', 'Por favor ingresa un precio');
      return;
    }
    
    try {
      // Actualizar sesión con precio acordado
      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agreed_price: priceInput,
          status: 'price_agreed'
        })
      });

      if (response.ok) {
        setAgreedPrice(priceInput);
        setShowPriceInput(false);
        
        // Enviar mensaje de confirmación de precio
        const priceMessage = {
          session_id: sessionId,
          message: `Perfecto, el precio acordado es ${priceInput}. Procedemos con el servicio.`,
          sender_type: 'worker'
        };

        await fetch('${API_BASE_URL}/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(priceMessage)
        });
      }
    } catch (error) {
      console.error('Error acordando precio:', error);
      Alert.alert('Error', 'No se pudo acordar el precio');
    }
  };

  const handleConfirmService = () => {
    if (!agreedPrice) {
      Alert.alert('Error', 'Primero deben acordar un precio antes de proceder');
      return;
    }

    Alert.alert(
      'Confirmar Servicio',
      `¿Estás seguro de que quieres proceder con el servicio por ${agreedPrice}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            onConfirmService(agreedPrice);
            onClose();
          }
        }
      ]
    );
  };

  const renderMessage = (message) => {
    const isClient = message.sender === 'client';
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isClient ? styles.clientMessage : styles.workerMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isClient ? styles.clientBubble : styles.workerBubble
        ]}>
          <Text style={[
            styles.messageText,
            isClient ? styles.clientText : styles.workerText
          ]}>
            {message.text}
          </Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <LinearGradient
          colors={['#FC5501', '#C24100']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.workerInfo}>
              <Avatar.Text size={40} label={mechanic?.name?.charAt(0) || 'M'} style={styles.avatar} />
              <View style={styles.workerDetails}>
                <Text style={styles.workerName}>{mechanic?.name || 'Mecánico'}</Text>
                <Text style={styles.workerStatus}>Mecánico • En línea</Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.refreshButton} onPress={loadMessages}>
                <Icon name="refresh" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.callButton} onPress={() => {
                if (mechanic?.telefono) {
                  Linking.openURL(`tel:${mechanic.telefono}`);
                } else {
                  Alert.alert('Error', 'No hay número de teléfono disponible');
                }
              }}>
                <Icon name="phone" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Contenedor principal del chat */}
        <View style={styles.chatContainer}>
          {/* Área de mensajes */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            keyboardShouldPersistTaps="handled"
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando mensajes...</Text>
              </View>
            ) : (
              messages.map(renderMessage)
            )}
          </ScrollView>

          {/* Área de entrada de texto - SIEMPRE VISIBLE */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Escribe tu mensaje..."
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!newMessage.trim() || sending}
            >
              <Icon 
                name="send" 
                size={24} 
                color={newMessage.trim() && !sending ? 'white' : '#ccc'} 
              />
            </TouchableOpacity>
          </View>

          {/* Botones de acción - SOLO SI ES NECESARIO */}
          {showPriceInput && (
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceInputLabel}>Ingresa el precio acordado:</Text>
              <View style={styles.priceInputRow}>
                <TextInput
                  style={styles.priceInput}
                  value={priceInput}
                  onChangeText={setPriceInput}
                  placeholder="$65"
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={handlePriceAgreement}
                >
                  <Text style={styles.priceButtonText}>Acordar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {agreedPrice && (
            <View style={styles.agreedPriceContainer}>
              <Text style={styles.agreedPriceText}>💰 Precio acordado: {agreedPrice}</Text>
            </View>
          )}

          {agreedPrice && (
            <View style={styles.actionContainer}>
              <Button
                mode="contained"
                onPress={handleConfirmService}
                disabled={!agreedPrice}
                style={[styles.confirmButton, !agreedPrice && styles.confirmButtonDisabled]}
                labelStyle={styles.confirmButtonLabel}
              >
                {agreedPrice ? `Proceder al Pago (${agreedPrice})` : 'Acuerda un precio primero'}
              </Button>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 0
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  workerDetails: {
    marginLeft: 15
  },
  workerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  workerStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14
  },
  callButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  refreshButton: {
    padding: 10,
    marginRight: 10
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: 5
  },
  messageContainer: {
    marginBottom: 15
  },
  clientMessage: {
    alignItems: 'flex-end'
  },
  workerMessage: {
    alignItems: 'flex-start'
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  clientBubble: {
    backgroundColor: '#FC5501'
  },
  workerBubble: {
    backgroundColor: 'white'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20
  },
  clientText: {
    color: 'white'
  },
  workerText: {
    color: '#333'
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    zIndex: 1000,
    elevation: 5
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: 'white'
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#FC5501',
    borderRadius: 20,
    elevation: 2
  },
  actionContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    zIndex: 999
  },
  confirmButton: {
    backgroundColor: '#FC5501',
    borderRadius: 25
  },
  confirmButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc'
  },
  priceInputContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  priceInputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500'
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16
  },
  priceButton: {
    backgroundColor: '#FC5501',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  priceButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  agreedPriceContainer: {
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  agreedPriceText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    fontSize: 16,
    color: '#666'
  }
});

export default ChatModal; 
