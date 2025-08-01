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
  Linking,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Button, Card, Avatar, FAB } from 'react-native-paper';
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
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  // Obtener información de la sesión de chat desde la navegación
  useEffect(() => {
    if (route.params?.sessionId) {
      setSessionId(route.params.sessionId);
      setClientInfo(route.params.clientInfo);
      loadMessages();
    }
  }, [route.params]);

  // Polling para nuevos mensajes - reducido a 5 segundos para evitar logs en bucle
  useEffect(() => {
    if (sessionId) {
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;

    try {
      // Solo mostrar log cada 10 cargas para evitar spam
      const shouldLog = Math.random() < 0.1; // 10% de probabilidad
      if (shouldLog) {
        console.log('🔄 KrizoWorker cargando mensajes para sesión:', sessionId);
      }
      
      const response = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}?sender_type=worker`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (shouldLog) {
        console.log('📥 Respuesta de carga de mensajes:', response.status);
      }
      
      if (response.ok) {
        const result = await response.json();
        
        if (shouldLog) {
          console.log('📥 Datos de mensajes recibidos:', result);
        }
        
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
            console.log('🔄 Mensajes transformados KrizoWorker:', transformedMessages.length, 'mensajes');
          }
          
          setMessages(transformedMessages);
        }
      } else {
        console.error('❌ Error cargando mensajes:', response.status);
      }
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId || sending) {
      console.log('❌ No se puede enviar mensaje:', { 
        message: newMessage.trim(), 
        sessionId, 
        sending 
      });
      return;
    }

    try {
      setSending(true);
      console.log('🔄 KrizoWorker enviando mensaje:', newMessage);
      console.log('🆔 SessionId:', sessionId);
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
      
      const messageData = {
        session_id: sessionId,
        message: newMessage,
        sender_type: 'worker'
      };

      console.log('📤 Datos del mensaje:', messageData);

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
          console.log('✅ Mensaje enviado correctamente por KrizoWorker');
          // Agregar el mensaje a la lista local
          const newMsg = {
            id: result.data.id,
            text: result.data.message,
            sender: result.data.sender_type,
            timestamp: new Date(result.data.created_at).toLocaleTimeString()
          };
          setMessages(prev => [...prev, newMsg]);
          setNewMessage('');
          
          // Scroll al final
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } else {
          console.error('❌ Error en respuesta del servidor:', result.message);
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

  const renderMessage = (message) => {
    const isWorker = message.sender === 'worker';
    
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
            {message.text}
          </Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  clientInfo: {
    marginLeft: 12,
  },
  clientName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clientType: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  messageContainer: {
    marginBottom: 12,
  },
  clientMessage: {
    alignItems: 'flex-start',
  },
  workerMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clientBubble: {
    backgroundColor: '#e3f2fd',
    borderBottomLeftRadius: 4,
  },
  workerBubble: {
    backgroundColor: '#FC5501',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  clientText: {
    color: '#333',
  },
  workerText: {
    color: 'white',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
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
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
});

export default KrizoWorkerChatScreen; 
