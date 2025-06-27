import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'; // Import Image for truck images
import { Appbar, Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Or any other icon library you prefer

const CraneServiceRN = () => { 
  const navigation = useNavigation();
  const mechanics = [
    {
      id: 1,
      name: 'Manuel Sanchez',
      specialty: 'Grúas de plataforma (o camillas)',
      rating: 4, // Adjusted rating based on image
      price: '500Bs por km',
      featured: false,
      image: 'https://placehold.co/150x100/A0A0A0/FFFFFF?text=Plataforma', // Placeholder image URL
    },
    {
      id: 2,
      name: 'Alejandro Martin',
      specialty: 'Grúas con pluma o brazo articulado',
      rating: 3, // Adjusted rating based on image
      price: '500Bs por km',
      featured: false,
      image: 'https://placehold.co/150x100/A0A0A0/FFFFFF?text=Pluma', // Placeholder image URL
    },
    {
      id: 3,
      name: 'Carlos López',
      specialty: 'Grúas con gancho o remolque',
      rating: 5,
      price: '500Bs por km',
      featured: true,
      image: 'https://placehold.co/150x100/A0A0A0/FFFFFF?text=Gancho', // Placeholder image URL
    },
  ];

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={i < rating ? 'star' : 'star-outline'}
            size={20}
            color={i < rating ? 'gold' : '#ccc'}
          />
        ))}
      </View>
    );
  };

  const handleRequestService = (mechanic) => {
    // Implement your navigation logic here, e.g.:
    // navigation.navigate('ServiceRequestScreen', { mechanicData: mechanic });
    console.log(`Solicitar a ${mechanic.name}`);
  };

  return (
    <LinearGradient
        colors={['#FC5501', '#C24100']}
      style={styles.container}
    >
      <View style={styles.headerOrangeContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <View style={styles.backIcon}>
              <Icon name="arrow-left-bold-circle" size={38} color="#FC5501" />
            </View>
          </TouchableOpacity>

          <View style={styles.appBarTitleContent}>
            <Text style={styles.appBarTitle}>Servicio de Grúa </Text>
            <Icon name="tow-truck" size={24} color="white" /> {/* Changed icon to truck-trailer */}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mechanicsList}>
        {mechanics.map((mechanic) => (
          <Card key={mechanic.id} style={styles.mechanicCard}>
            <View style={styles.cardContent}>
              <View style={styles.mechanicAvatarContainer}>
                <Avatar.Icon size={60} icon="account" style={styles.avatar} color="white" />
                {mechanic.featured && (
                  <Chip style={styles.featuredChip} textStyle={styles.featuredChipText}>
                    Destacado
                  </Chip>
                )}
              </View>
              <View style={styles.mechanicInfo}>
                <Text style={styles.mechanicName}>{mechanic.name}</Text>
                <Text style={styles.mechanicSpecialty}>{mechanic.specialty}</Text>
                {mechanic.image && (
                  <Image source={{ uri: mechanic.image }} style={styles.mechanicImage} />
                )}
                <View style={styles.ratingAndPrice}>
                  {renderStars(mechanic.rating)}
                  <Text style={styles.mechanicPrice}>{mechanic.price}</Text>
                </View>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => handleRequestService(mechanic)}
              style={styles.requestButton}
              labelStyle={styles.requestButtonLabel}
            >
              Solicitar
            </Button>
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOrangeContainer: {
    width: '100%',
    marginBottom: 18,
    borderRadius: 22, // Apply border radius to the gradient container itself
    overflow: 'hidden', // Crucial for borderRadius to work with children
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    // We'll manage the background with the LinearGradient directly
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative', // To position the back button absolutely
    justifyContent: 'center', // To center the title within the row
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 10,
    borderWidth: 2,
    top: 15, // Adjusted to match your image
    position: 'absolute',
    borderColor: '#FC5501',
    left: 0, // Position at the left
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2, // Added padding to center the icon better
  },
  appBarTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allow it to take up space and center
    marginRight: 40, // Counteract the back button's presence for centering
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    // Removed marginLeft: 30 as it interferes with centering now
  },
  mechanicsList: {
    paddingHorizontal: 20, // Keep horizontal padding
    paddingBottom: 20, // Add bottom padding for scrollview
    alignItems: 'center',
    width: '100%', // Ensure it takes full width for centering cards
  },
  mechanicCard: {
    width: '48%', // Approx half width for two columns
    marginHorizontal: '1%', // Space between cards
    marginBottom: 40,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#f0f0f0', // Light gray background for cards
    padding: 10, // Adjust padding inside card
    alignItems: 'center', // Center content within card
  },
  cardContent: {
    flexDirection: 'column', // Changed to column for vertical layout
    alignItems: 'center', // Center items horizontally within card
    marginBottom: 10, // Space before button
  },
  mechanicAvatarContainer: {
    position: 'relative',
    marginBottom: 5,
    alignItems: 'center', // Center avatar and chip
  },
  avatar: {
    backgroundColor: '#ccc',
    marginBottom: 5, // Space below avatar
  },
  mechanicInfo: {
    alignItems: 'center', // Center text info
    marginBottom: 10, // Space between info and image/stars
  },
  mechanicName: {
    fontSize: 16, // Smaller font for name in two-column layout
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  mechanicSpecialty: {
    fontSize: 12, // Smaller font for specialty
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  mechanicImage: {
    width: 120, // Fixed width for images
    height: 80, // Fixed height for images
    borderRadius: 5,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  ratingAndPrice: {
    flexDirection: 'column', // Changed to column to stack stars and price
    alignItems: 'center', // Center them
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5, // Space between stars and price
  },
  mechanicPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicExperience: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 5, // Add some space above
  },
  requestButton: {
    backgroundColor: '#FC5501',
    borderRadius: 20,
    width: '90%', // Make button fit card better
    alignSelf: 'center', // Center the button
    paddingVertical: 5, // Adjust padding for smaller button
  },
  requestButtonLabel: {
    color: 'white',
    fontSize: 14, // Smaller font for button label
  },
  featuredChip: {
    backgroundColor: '#ffd700',
    position: 'absolute', // Position chip absolutely
    top: -35, // Adjust vertical position
    right: -17, // Adjust horizontal position
    paddingHorizontal: 5,
    height: 30,
    justifyContent: 'center',
  },
  featuredChipText: {
    fontSize: 10, // Smaller font for chip
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CraneServiceRN;
