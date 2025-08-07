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
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionId, clientName, serviceType } = route.params;
  const API_BASE_URL =  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api';

  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (sessionId) {
      loadMessages();
      // Polling cada 3 segundos para nuevos mensajes
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}?sender_type=worker`, {
        headers: {
          'Authorization': `Bearer test-token`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessages(result.data);
        }
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

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
          'Authorization': `Bearer test-token`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const newMsg = {
            id: result.data.id,
            text: result.data.message,
            sender: result.data.sender_type,
            timestamp: new Date(result.data.created_at).toLocaleTimeString()
          };
          setMessages(prev => [...prev, newMsg]);
          setNewMessage('');
        }
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
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
    <LinearGradient
      colors={['#FC5501', '#C24100']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{clientName}</Text>
          <Text style={styles.headerSubtitle}>{serviceType}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.chatContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando mensajes...</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.length > 0 ? (
              messages.map(renderMessage)
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="chat-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>
                  No hay mensajes aún. ¡Inicia la conversación!
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Escribe tu respuesta..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Icon 
              name="send" 
              size={24} 
              color={newMessage.trim() && !sending ? 'white' : '#ccc'} 
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  backButton: {
    padding: 5
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14
  },
  placeholder: {
    width: 34
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  messagesContainer: {
    flex: 1,
    padding: 15
  },
  messageContainer: {
    marginBottom: 15
  },
  clientMessage: {
    alignItems: 'flex-start'
  },
  workerMessage: {
    alignItems: 'flex-end'
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
    backgroundColor: 'white'
  },
  workerBubble: {
    backgroundColor: '#FC5501'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20
  },
  clientText: {
    color: '#333'
  },
  workerText: {
    color: 'white'
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
    borderTopColor: '#e0e0e0'
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
    fontSize: 16
  },
  sendButton: {
    backgroundColor: '#FC5501',
    padding: 10,
    borderRadius: 20
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center'
  }
});

export default ChatScreen; 
