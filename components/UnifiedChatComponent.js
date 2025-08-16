import React, { useState, useEffect, useRef } from 'react'
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
  Modal,
  Image,
  FlatList,
  Linking,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { Button, Card, Avatar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ImageViewer from 'react-native-image-zoom-viewer'
import { useAuth } from '../context/AuthContext'
import { styles } from './ChatModalStyles'

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:5000/api'
const SERVER_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || 'http://192.168.1.14:5000/'

const UnifiedChatComponent = ({
  sessionId,
  userType,
  partnerName,
  partnerPhone,
  showWorkerFeatures,
  onClose,
  onConfirmService,
  mechanic,
}) => {
  const { token } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollViewRef = useRef()
  const [showGallery, setShowGallery] = useState(false)
  const [showPayPal, setShowPayPal] = useState(false)
  const [showBinance, setShowBinance] = useState(false)
  const [quantity, setQuantity] = useState(1); // Añade esta línea
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentImageTitle, setCurrentImageTitle] = useState('')
  const [products, setProducts] = useState([]) // Estado para almacenar los productos
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productsError, setProductsError] = useState(null)
  const imagesWithStock = products.filter((product) => product.stock > 0)
  const categories = [
    'Todas',
    ...new Set(imagesWithStock.map((product) => product.category)),
  ]
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedImageInfo, setSelectedImageInfo] = useState({
    title: '',
    image: null,
  })
  const [isBuying, setIsBuying] = useState(false)
  const [showPurchaseCard, setShowPurchaseCard] = useState(false)
  const dotAnimation = useRef(new Animated.Value(0)).current

  const filteredProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const imagesForViewer = filteredProducts.map((img) => ({
    url: `${SERVER_URL}${img.imageUri}`, // Asegúrate de que tu API devuelva la URL de la imagen
    props: { source: { uri: `${SERVER_URL}${img.imageUri}` } }, // Cambia esto si la imagen está en un formato diferente
  }))

  useEffect(() => {
	  
	      const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const response = await fetch(`${API_BASE_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProducts(result.data || [])
          }
        } else {
          throw new Error('No se pudieron cargar los productos')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProductsError(error.message)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
	  
    let intervalId
    if (sessionId) {
      setMessages([])
      setIsLoading(true)
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/chat/messages/${sessionId}?sender_type=${userType}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          if (response.ok) {
            const result = await response.json()
            if (result.success && result.data) {
				console.log('result ', result.data)
              const transformedMessages = result.data.map((msg) => ({
                id: msg.id,
                text: msg.message,
                sender: msg.sender_type,
                timestamp: new Date(msg.created_at).toLocaleTimeString(),
                purchaseRequest: msg.purchase_request,
                productDetails: msg.product_details
                  ? JSON.parse(msg.product_details)
                  : null,
                purchaseStatus: msg.purchase_status !== null ? msg.purchase_status : 'pending',
              }))
              setMessages(transformedMessages)
              if (transformedMessages.length > 0) {
                setTimeout(
                  () => scrollViewRef.current?.scrollToEnd({ animated: true }),
                  100
                )
              }
              				console.log('transformedMessages ', transformedMessages)

            }
          }
        } catch (error) {
          console.error('❌ Error cargando mensajes:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchMessages()
      intervalId = setInterval(fetchMessages, 3000)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [sessionId, token])

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !sessionId) return
    try {
      setSending(true)
      const messageData = {
        session_id: sessionId,
        message: newMessage,
        sender_type: userType,
      }
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      })
      if (response.ok) {
        setNewMessage('')
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje')
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  const sendPurchaseRequest = async (product, quantity) => {
  try {
    setIsBuying(true);
    const messageData = {
      session_id: sessionId,
      message: `¡Quiero comprar ${quantity} unidad(es) de ${product.name} por $${product.price * quantity}!`, 
      sender_type: userType,
      purchase_request: true,
      product_details: JSON.stringify({ ...product, quantity }), 
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
      setIsImageViewerVisible(false);
      Alert.alert('Éxito', 'Solicitud de compra enviada.');
      setQuantity(1); // Resetea la cantidad
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

  const handlePurchaseAction = async (messageId, productId, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/purchase/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, product_id: productId }),
      })

      if (response.ok) {
        const updatedMessages = messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, purchaseStatus: action, text: `Solicitud de compra ${action === 'accepted' ? 'aceptada' : 'rechazada'}.` }
            : msg
        )
        setMessages(updatedMessages)
        Alert.alert(
          'Éxito',
          `Solicitud de compra ${action === 'accepted' ? 'aceptada' : 'rechazada'}.`
        )
      } else {
        throw new Error('No se pudo actualizar el estado de la compra.')
      }
    } catch (error) {
      console.error('Error handling purchase action:', error)
      Alert.alert('Error', 'No se pudo procesar la solicitud.')
    }
  }

  const renderPurchaseCard = (message) => {
    const { productDetails, purchaseStatus } = message
    const isKrizoWorker = userType === 'krizoworker'
    const isAccepted = purchaseStatus === 'accepted'
    const isRejected = purchaseStatus === 'rejected'

    return (
      <View
        key={message.id}
        style={[styles.messageContainer, styles.purchaseCardContainer]}
      >
        <Card style={styles.purchaseCard}>
          <Card.Content style={styles.purchaseCardContent}>
			<Image
            source={{ uri: `${SERVER_URL}${productDetails.imageUri}` }}
            style={styles.purchaseImage}
            resizeMode="cover"
          />
            <View style={styles.purchaseCardDetails}>
              <Text style={styles.purchaseCardTitle}>{productDetails.name} marca {productDetails.brand}</Text>
              <Text style={styles.purchaseCardPrice}>
				Cantidad: {productDetails.quantity}
              </Text>
              <Text style={styles.purchaseCardPrice}>
                Precio: ${productDetails.price * productDetails.quantity}
              </Text>
              <Text style={styles.purchaseCardDescription}>
                {productDetails.description}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.purchaseCardActions}>
            {isKrizoWorker ? (
              isAccepted ? (
                <Button disabled>Aceptado</Button>
              ) : isRejected ? (
                <Button disabled>Rechazado</Button>
              ) : (
                <>
                  <Button
                    onPress={() => handlePurchaseAction(message.id, productDetails.id, 'accepted')}
                    mode="contained"
                    style={styles.acceptButton}
                  >
                    Aceptar
                  </Button>
                  <Button
                    onPress={() => handlePurchaseAction(message.id, productDetails.id, 'rejected')}
                    mode="outlined"
                    style={styles.rejectButton}
                  >
                    Rechazar
                  </Button>
                </>
              )
            ) : (
              <Text style={styles.purchaseStatusText}>
                Estado: {purchaseStatus === 'accepted'
                  ? 'Aceptado ✅'
                  : purchaseStatus === 'rejected'
                    ? 'Rechazado ❌'
                    : 'Pendiente... ⏳'}
              </Text>
            )}
          </Card.Actions>
        </Card>
      </View>
    )
  }

  const renderMessage = (message) => {
	 
   if (message.purchaseRequest) {
      return renderPurchaseCard(message)

    } 

    const isMyMessage = message.sender === userType
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isMyMessage ? styles.clientMessage : styles.workerMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.clientBubble : styles.workerBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.clientText : styles.workerText,
            ]}
          >
            {message.text}
          </Text>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
        </View>
      </View>
    )
  }

  const renderImageThumbnail = ({ item, index }) => {
    const isAvailable = item.quantity > 0

    return (
      <TouchableOpacity
        style={styles.galleryImageTouchable}
        onPress={() => {
          setCurrentImageIndex(index)
          setCurrentImageTitle(item.name)
          setIsImageViewerVisible(true)
        }}
        disabled={!isAvailable}
      >
        <Image
          source={{ uri: `${SERVER_URL}${item.imageUri}` }}
          style={[styles.galleryImage, !isAvailable && styles.outOfStockImage]}
          resizeMode="cover"
        />
        {!isAvailable && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Agotado</Text>
          </View>
        )}
        <Text style={styles.productTitleText}>{item.name}</Text>
        <Text style={styles.productPriceText}>${item.price}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {showWorkerFeatures && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              showGallery && styles.actionButtonActive,
            ]}
            onPress={() => {
              setShowGallery(!showGallery)
              setShowPayPal(false)
              setShowBinance(false)
            }}
          >
            <Icon
              name="image-multiple"
              size={24}
              color={showGallery ? '#FC5501' : '#FC5501'}
            />
            <Text
              style={[
                styles.actionButtonText,
                showGallery && { color: '#FC5501' },
              ]}
            >
              Galería
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              showPayPal && styles.actionButtonActive,
            ]}
            onPress={() => {
              setShowPayPal(!showPayPal)
              setShowGallery(false)
              setShowBinance(false)
            }}
          >
            <Icon
              name="credit-card-outline"
              size={24}
              color={showPayPal ? '#FC5501' : '#FC5501'}
            />
            <Text
              style={[
                styles.actionButtonText,
                showPayPal && { color: '#FC5501' },
              ]}
            >
              PayPal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              showBinance && styles.actionButtonActive,
            ]}
            onPress={() => {
              setShowBinance(!showBinance)
              setShowGallery(false)
              setShowPayPal(false)
            }}
          >
            <Icon
              name="bitcoin"
              size={24}
              color={showBinance ? '#FC5501' : '#FC5501'}
            />
            <Text
              style={[
                styles.actionButtonText,
                showPayPal && { color: '#FC5501' },
              ]}
            >
              Binance
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showWorkerFeatures && showGallery && (
        <View style={[styles.galleryContainer, styles.shadowBox]}>
          {loadingProducts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FC5501" />
            </View>
          ) : productsError ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={24} color="#FF0000" />
              <Text style={styles.errorText}>{productsError}</Text>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryBar}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category &&
                          styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderImageThumbnail}
                ListEmptyComponent={
                  <View style={styles.emptyProductContainer}>
                    <Text>No hay productos disponibles</Text>
                  </View>
                }
              />
            </>
          )}
        </View>
      )}

      <Modal
        visible={isImageViewerVisible}
        transparent
        onRequestClose={() => setIsImageViewerVisible(false)}
      >
        <ImageViewer
          imageUrls={filteredProducts.map((p) => ({
            url: `${SERVER_URL}${p.imageUri}`,
          }))}
          index={currentImageIndex}
          onSwipeDown={() => setIsImageViewerVisible(false)}
          enableSwipeDown
          enableImageZoom={true}
          renderHeader={() => (
			  
            <View style={styles.imageViewerHeader}>
                          <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsImageViewerVisible(false)}
              >
                <Icon name="close" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.imageViewerTitle}>
                {filteredProducts[currentImageIndex]?.name}
              </Text>
              <Text style={styles.imageViewerPrice}>
                Precio: ${filteredProducts[currentImageIndex]?.price}
              </Text>

            </View>
          )}
renderFooter={(currentIndex) => (
  <View style={styles.imageViewerFooter}>
    {userType !== 'krizoworker' && (
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(prev => Math.max(1, prev - 1))} // Previene que la cantidad sea menor a 1
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
			  if (quantity < filteredProducts[currentImageIndex]?.quantity) {
                setQuantity(prev => prev + 1);
              } else {
                Alert.alert('Stock máximo alcanzado', `No puedes comprar más de ${filteredProducts[currentImageIndex]?.quantity} unidades.`);
              }
			  }}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    )}

    {userType !== 'krizoworker' && (
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => sendPurchaseRequest(filteredProducts[currentIndex], quantity)} // Pasa la cantidad a la función
        disabled={isBuying}
      >
        {isBuying ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buyButtonText}>Comprar</Text>
        )}
      </TouchableOpacity>
    )}
  </View>
)}
        />
      </Modal>

      {showWorkerFeatures && showPayPal && (
        <View style={[styles.paymentContainer, styles.shadowBox]}>
          <Card style={styles.paymentCard}>
            <Card.Content>
              <Text style={styles.paymentTitle}>Datos de PayPal</Text>
              <Text style={styles.paymentText}>
                Correo: {mechanic?.paypal_email || 'No disponible'}
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}

      {showWorkerFeatures && showBinance && (
        <View style={[styles.paymentContainer, styles.shadowBox]}>
          <Card style={styles.paymentCard}>
            <Card.Content>
              <Text style={styles.paymentTitle}>Datos de Binance</Text>
              <Text style={styles.paymentText}>
                ID de Usuario: {mechanic?.binance_id || 'No disponible'}
              </Text>
              <Text style={styles.paymentText}>
                Wallet: {mechanic?.binance_type || 'No disponible'}
              </Text>
              <Image source={require('../assets/qr.jpg')} style={styles.cardImage} />
            </Card.Content>
          </Card>
        </View>
      )}

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
        ) : messages.length > 0 ? (
          messages.map(renderMessage)
        ) : (
          <View>
            <Icon
              name="chat-outline"
              style={styles.emptyContainer}
              size={48}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No hay mensajes aún.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe tu mensaje..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.sendButtonDisabled,
          ]}
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
    </KeyboardAvoidingView>
  )
}

export default UnifiedChatComponent
