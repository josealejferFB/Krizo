import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOrangeContainer: {
    width: '100%',
    marginBottom: 18,
    borderRadius: 22,
    overflow: 'hidden',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 3,
    borderWidth: 2,
    position: 'absolute',
    borderColor: '#FC5501',
    left: 0,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2,
  },
  buyButton: {
    backgroundColor: '#FC5501', // Orange color for the buy button
    borderRadius: 8, // Slightly less rounded than the 'Solicitar' button
    width: '100%', // Make it full width within the card
    marginTop: 5, // Small space above the button
    paddingVertical: 2, // Adjust vertical padding for the button
  },
  buyButtonLabel: {
    color: 'white',
    fontSize: 12, // Smaller font size to fit
    fontWeight: 'bold',
  },
  appBarTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center', // Center content horizontally
  },
  manageProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FC5501', // Orange color
    textAlign: 'left', // Aligned to the left as in the image
    width: '100%', // Take full width
    marginBottom: 15,
  },
  searchBar: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchBarInput: {
    minHeight: 0, // Override default minHeight for smaller searchbar
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items evenly
    width: '100%',
  },
  productCard: {
    width: '48%', // Approx half width for two columns
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff', // White background for product cards
    padding: 10,
  },
  productCardContent: {
    alignItems: 'center', // Center image and details
    marginBottom: 10,
  },
  productImage: {
    width: '100%', // Image takes full width of card
    height: 160, // Fixed height for consistency
    borderRadius: 5,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center', // Center product name and quantity
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FC5501', // Orange for price
    textAlign: 'center',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5, // Small horizontal padding
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 10,
    marginLeft: 5,
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FC5501',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  availableChip: {
    backgroundColor: '#4CAF50',
    height: 30,
  },
  availableChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameAndFeatured: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
  },
  shopAvatar: {
    backgroundColor: '#FC5501',
    marginBottom: 10,
  },
  shopLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
  },
  shopAvailability: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    backgroundColor: '#FC5501',
    borderRadius: 30,
    padding: 10,
    zIndex: 999,
  },
    selectedImagePreview: {
    width: 150,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 20,
    alignSelf: 'center',
  },
    deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
