import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import CustomTitle from './components/CustomTitle';
import CustomButton from './components/CustomButton';

// Keep the splash screen visible while fetching resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Form States
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const [guests, setGuests] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const [campsites, setCampsites] = useState(1);
  const [showCampsitePicker, setShowCampsitePicker] = useState(false);

  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts if available
        await Font.loadAsync({
          'CustomFont': require('./assets/fonts/CustomFont.ttf'),
        });
        // Artificial small delay to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  const onCheckInChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowCheckInPicker(false);
    }
    if (selectedDate) {
      setCheckInDate(selectedDate);
    }
  };

  const onCheckOutChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowCheckOutPicker(false);
    }
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleReserve = () => {
    setReservationData({
      checkIn: checkInDate.toLocaleString(),
      checkOut: checkOutDate.toLocaleString(),
      guests,
      campsites,
    });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4' }}
      style={styles.background}
    >
      {/* Color Overlay */}
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          
          <CustomTitle titleText="Pine Valley Campground" />

          {/* Check-In Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-In Date & Time:</Text>
            <Text
              style={styles.pickerToggleText}
              onPress={() => setShowCheckInPicker(true)}
            >
              {checkInDate.toLocaleString()} (Click to change)
            </Text>
            {showCheckInPicker && (
              <DateTimePicker
                value={checkInDate}
                mode="datetime"
                display="default"
                onChange={onCheckInChange}
              />
            )}
            {Platform.OS === 'ios' && showCheckInPicker && (
              <CustomButton title="Confirm Check-In" onPress={() => setShowCheckInPicker(false)} />
            )}
          </View>

          {/* Check-Out Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-Out Date & Time:</Text>
            <Text
              style={styles.pickerToggleText}
              onPress={() => setShowCheckOutPicker(true)}
            >
              {checkOutDate.toLocaleString()} (Click to change)
            </Text>
            {showCheckOutPicker && (
              <DateTimePicker
                value={checkOutDate}
                mode="datetime"
                display="default"
                onChange={onCheckOutChange}
              />
            )}
            {Platform.OS === 'ios' && showCheckOutPicker && (
              <CustomButton title="Confirm Check-Out" onPress={() => setShowCheckOutPicker(false)} />
            )}
          </View>

          {/* Number of Guests Section */}
          <View style={styles.inputGroup}>
            <Text 
              style={styles.label} 
              onPress={() => setShowGuestPicker(!showGuestPicker)}
            >
              Guests: {guests} (Tap to select 1-15)
            </Text>
            {showGuestPicker && (
              <Picker
                selectedValue={guests}
                style={styles.picker}
                dropdownIconColor="#ffffff"
                onValueChange={(itemValue) => {
                  setGuests(itemValue);
                  if (Platform.OS === 'android') setShowGuestPicker(false);
                }}
              >
                {[...Array(15)].map((_, i) => (
                  <Picker.Item key={i + 1} label={`${i + 1} Guest${i > 0 ? 's' : ''}`} value={i + 1} />
                ))}
              </Picker>
            )}
          </View>

          {/* Number of Campsites Section */}
          <View style={styles.inputGroup}>
            <Text 
              style={styles.label} 
              onPress={() => setShowCampsitePicker(!showCampsitePicker)}
            >
              Campsites: {campsites} (Tap to select 1-5)
            </Text>
            {showCampsitePicker && (
              <Picker
                selectedValue={campsites}
                style={styles.picker}
                dropdownIconColor="#ffffff"
                onValueChange={(itemValue) => {
                  setCampsites(itemValue);
                  if (Platform.OS === 'android') setShowCampsitePicker(false);
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Picker.Item key={i + 1} label={`${i + 1} Campsite${i > 0 ? 's' : ''}`} value={i + 1} />
                ))}
              </Picker>
            )}
          </View>

          {/* Reserve Now Button Component */}
          <CustomButton title="Reserve Now" onPress={handleReserve} />

          {/* Reservation Summary Output */}
          {reservationData && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Reservation Confirmed!</Text>
              <Text style={styles.summaryText}>Check-In: {reservationData.checkIn}</Text>
              <Text style={styles.summaryText}>Check-Out: {reservationData.checkOut}</Text>
              <Text style={styles.summaryText}>Guests: {reservationData.guests}</Text>
              <Text style={styles.summaryText}>Campsites: {reservationData.campsites}</Text>
            </View>
          )}

        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)', // Color overlay
  },
  container: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 5,
    fontWeight: '600',
  },
  pickerToggleText: {
    fontSize: 15,
    color: '#a3cef1',
    textDecorationLine: 'underline',
    paddingVertical: 4,
  },
  picker: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#ffffff',
    marginTop: 5,
  },
  summaryContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(45, 106, 79, 0.85)',
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 4,
  },
});