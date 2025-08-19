import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


export const styles = StyleSheet.create({
	imageViewerHeader: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20, 
    flexDirection: 'column', 
    zIndex: 100,
    justifyContent: 'space-between'
  },
  imageViewerFooter: {
  position: 'relative', // Asegúrate de que la posición sea correcta
  left: width * 0.39,
  height: height * 0.2, // Dale una altura fija
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Color de fondo para que sea visible
  },
    imageViewerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Permite que el texto ocupe el espacio restante
    textAlign: 'center',
    zIndex: 0,
  },
    imageViewerPrice: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Permite que el texto ocupe el espacio restante
    textAlign: 'center',
    zIndex: 0
  },
	categoryBar: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 8,

    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#FC5501',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',

  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
	
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FC5501',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FC5501',
    marginTop: 5,
  },
  emptyContainer: {
	  marginLeft: 'auto',
	  marginRight: 'auto',	  
	  
  },
  emptyText: {
	  textAlign: 'center',
  },
  paymentContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  paymentCard: {
    elevation: 2,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paymentText: {
    fontSize: 16,
    color: '#555',
  },
  shadowBox: {
          // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  // Sombra para Android
    elevation: 5,
    zIndex: 999,
  },
  galleryContainer: {
    height: 220,
    backgroundColor: '#f5f5f5',
  },
  galleryImage: {
    width: width * 0.4, // Imágenes más pequeñas
    height: '60%',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  galleryImageTouchable: {
    marginRight: 10,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FC5501'
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
    fontWeight: 'bold',
	width: 150,
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
    maxWidth: '50%',
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
  },
  productTitleText: {
  textAlign: 'center' 
  },
  productPriceText: {
  textAlign: 'center' 
  },
  buyButton: {
  position: 'relative',
  backgroundColor: '#FC5501',
  padding: 4,
  borderRadius: 20,
  alignItems: 'center',
  marginVertical: 10,
  marginRight: 8,
  },
  buyButtonText: {
    color: 'white',
  },
  purchaseCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    alignItems: 'center'
  },
  purchaseImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10
  },
  purchaseTextContainer: {
    flexDirection: 'row',
  },
  purchaseText: {
    fontSize: 16
  },
  dotsText: {
    fontSize: 16,
    width: 30
  },
  purchaseOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5
  },
  confirmButton: {
    backgroundColor: '#4CD964',
    padding: 8,
    borderRadius: 5
  },
  buttonText: {
    color: 'white'
  },
  // En tu ChatModalStyles.js
quantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 10,
},
quantityButton: {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 15,
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
},
quantityButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
},
quantityText: {
  color: 'white',
  fontSize: 18,
  marginHorizontal: 10,
},
purchaseCardContainer: {
	width: '70%',
	}
});
