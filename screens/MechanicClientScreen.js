import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Text, Card, Button, Avatar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MechanicServiceRN = () => {
  const navigation = useNavigation();
  const mechanics = [
    {
      id: 1,
      name: 'Juan Pérez',
      specialty: 'Identificación de fallas',
      rating: 3,
      price: '100Bs/hora',
      featured: false,
    },
    {
      id: 2,
      name: 'Luis Gomez',
      specialty: 'Reparación de motores',
      rating: 4,
      price: '200Bs/hora',
      featured: false,
    },
    {
      id: 3,
      name: 'Carlos Luis',
      specialty: 'Reparación de sistemas',
      rating: 5,
      price: '300Bs/hora',
      featured: true,
      experience: 'más de 2 meses',
    },
  ];

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}> {/* CORRECTED: Added wrapping View */}
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

  return (
    <LinearGradient // CORRECTED: Wrapped everything in LinearGradient
        colors={['#FC5501', '#C24100']}
      style={styles.container}
    >
    <View style={styles.headerOrangeContainer}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Icon
                  name="arrow-left-bold-circle"
                  size={38}
                  color="#FC5501"
                  style={styles.backIcon}
                />
              </TouchableOpacity>
            </View>

                <View style={styles.headerTitleBox}>
                              <Text style={styles.appBarTitle}>Mecánico a Domicilio</Text>
                </View>
              <Icon style={{ marginLeft: 30 }} name="tools" size={24} color="white" />
            </View>
      <ScrollView contentContainerStyle={styles.mechanicsList}>
        {mechanics.map((mechanic) => (
          <Card key={mechanic.id} style={styles.mechanicCard}>
            <View style={styles.cardContent}>
              <Avatar.Icon size={60} icon="account" style={styles.avatar} color="white" />
              <View style={styles.mechanicInfo}>
                <View style={styles.nameAndFeatured}>
                  <Text style={styles.mechanicName}>{mechanic.name}</Text>
                  {mechanic.featured && (
                    <Chip style={styles.featuredChip} textStyle={styles.featuredChipText}>
                      Destacado
                    </Chip>
                  )}
                </View>
                <Text style={styles.mechanicSpecialty}>{mechanic.specialty}</Text>
                <View style={styles.ratingAndPrice}>
                  {renderStars(mechanic.rating)}
                  <Text style={styles.mechanicPrice}>{mechanic.price}</Text>
                </View>
                {mechanic.experience && (
                  <Text style={styles.mechanicExperience}>{mechanic.experience}</Text>
                )}
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => console.log(`Solicitar a ${mechanic.name}`)}
              style={styles.requestButton}
              labelStyle={styles.requestButtonLabel}
            >
              Solicitar
            </Button>
          </Card>
        ))}
      </ScrollView>
    </LinearGradient> // Close LinearGradient
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color removed here as LinearGradient handles it
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
  },
backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    elevation: 3,
    borderWidth: 2,
    top: 5,
    position: 'absolute',
    borderColor: '#FC5501',
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 19,
  },
  appBarTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  appBarTitleWrapper: {
    alignSelf: 'center',
    marginLeft: -40,
  },
  appBarTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 30,
  },
  mechanicsList: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  mechanicCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  mechanicInfo: {
    flex: 1,
  },
  nameAndFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  featuredChip: {
    backgroundColor: '#ffd700',
    height: 30,
  },
  featuredChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mechanicExperience: {
    fontSize: 12,
    color: '#888',
  },
  requestButton: {
    backgroundColor: '#FC5501',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  requestButtonLabel: {
    color: 'white',
    fontSize: 16,
  },
});

export default MechanicServiceRN;
