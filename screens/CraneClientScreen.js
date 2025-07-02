import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CraneClientScreen = () => {
  const navigation = useNavigation();
  const mechanics = [
    {
      id: 1,
      name: 'Manuel Sanchez',
      specialty: 'Grúas de plataforma (o camillas)',
      rating: 4,
      price: '500Bs por km',
      featured: false,
      image: 'https://placehold.co/150x100/A0A0A0/FFFFFF?text=Plataforma',
    },
    {
      id: 2,
      name: 'Alejandro Martin',
      specialty: 'Grúas con pluma o brazo articulado',
      rating: 3,
      price: '500Bs por km',
      featured: false,
      image: 'https://placehold.co/150x100/A0A0A0/FFFFFF?text=Pluma',
    },
    {
      id: 3,
      name: 'Carlos López',
      specialty: 'Grúas con gancho o remolque',
      rating: 5,
      price: '500Bs por km',
      featured: true,
      image: 'https://placehold.co/150x100/A0A0A0/FFFFFF?text=Gancho',
    },
  ];

  const renderStars = (rating) => (
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

  const handleRequestService = (mechanic) => {
    // navigation.navigate('ServiceRequestScreen', { mechanicData: mechanic });
    console.log(`Solicitar a ${mechanic.name}`);
  };

  return (
    <LinearGradient colors={['#FC5501', '#C24100']} style={styles.container}>
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
          <View style={styles.headerTitleBox}>
            <Text style={styles.appBarTitle}>Servicio de Grúa</Text>
            <Icon name="tow-truck" size={24} color="white" style={{ marginLeft: 8 }} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mechanicsList}>
        {mechanics.map((mechanic) => (
          <Card key={mechanic.id} style={styles.mechanicCard}>
            {/* Destacado arriba a la derecha de la tarjeta */}
            {mechanic.featured && (
              <View style={styles.featuredChipContainer}>
                <Chip style={styles.featuredChip} textStyle={styles.featuredChipText}>
                  Destacado
                </Chip>
              </View>
            )}
            <View style={styles.cardContent}>
              <View style={styles.mechanicAvatarContainer}>
                <Avatar.Icon size={60} icon="truck" style={styles.avatar} color="white" />
              </View>
              <View style={styles.mechanicInfo}>
                <Text style={styles.mechanicName}>{mechanic.name}</Text>
                <Text style={styles.mechanicSpecialty}>{mechanic.specialty}</Text>
                <Image
                  source={{ uri: mechanic.image || 'https://placehold.co/120x80/FC5501/FFFFFF?text=Grúa' }}
                  style={styles.mechanicImage}
                />
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
    borderRadius: 22,
    overflow: 'hidden',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    maxWidth: 370,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 10,
    borderWidth: 2,
    top: 0,
    position: 'relative',
    borderColor: '#FC5501',
    marginRight: 10,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 0,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mechanicsList: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  mechanicCard: {
    width: '92%',
    maxWidth: 370,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  mechanicAvatarContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#FC5501',
    marginBottom: 5,
  },
  mechanicInfo: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mechanicName: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 2,
    color: '#222',
  },
  mechanicSpecialty: {
    fontSize: 13,
    color: '#666',
    textAlign: 'left',
    marginBottom: 5,
  },
  mechanicImage: {
    width: 120,
    height: 80,
    borderRadius: 5,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  ratingAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  mechanicPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicExperience: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  requestButton: {
    backgroundColor: '#FC5501',
    borderRadius: 20,
    width: '96%',
    alignSelf: 'center',
    paddingVertical: 7,
    marginTop: 5,
  },
  requestButtonLabel: {
    color: 'white',
    fontSize: 16,
  },
  featuredChipContainer: {
    position: 'absolute',
    top: -14,
    right: -14,
    zIndex: 20,
    elevation: 10,
  },
  featuredChip: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  featuredChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CraneClientScreen;
