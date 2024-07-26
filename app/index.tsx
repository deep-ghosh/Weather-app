import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Device from 'expo-device';

interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    temp_f: number;
    feelslike_f: number;
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    wind_dir: string;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const Index: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const fetchWeatherData = async (location: Location.LocationObject) => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=878a747ded634212868132512242607&q=${location.coords.latitude},${location.coords.longitude}&aqi=no`);
      const data = await response.json();
      setWeatherData(data);

      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode) {
        const city = reverseGeocode.city || reverseGeocode.region || 'Unknown location';
        setWeatherData(prevData => prevData ? {
          ...prevData,
          location: {
            ...prevData.location,
            name: city,
          },
        } : null);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to fetch weather data');
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, this will not work on Snack in an Android Emulator. Try it on your device!');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeatherData(location);
    })();
  }, []);

  const nextPage = () => {
    router.push('/forcast');
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (weatherData) {
    text = `Weather Forecast for ${weatherData.location.name}`;
  } else {
    text = 'Loading location...';
  }

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/free-vector/sky-background-video-conferencing_23-2148623068.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {weatherData ? (
            <>
              <Image
                source={{ uri: `http:${weatherData.current.condition.icon}` }}
                style={styles.icon}
              />
              <Text style={styles.header}>{text}</Text>
              <View style={styles.forecastContainer}>
                <Text style={styles.info}>Condition: {weatherData.current.condition.text}</Text>
                <View style={styles.infoContainer}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/material-outlined/24/temperature.png' }}
                    style={styles.iconSmall}
                  />
                  <Text style={styles.infoText}>Temperature: {weatherData.current.temp_c}°C</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/material-outlined/24/humidity.png' }}
                    style={styles.iconSmall}
                  />
                  <Text style={styles.infoText}>Humidity: {weatherData.current.humidity}%</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Image
                    source={require('@/assets/images/pressure.png')}
                    style={styles.iconSmall}
                  />
                  <Text style={styles.infoText}>Pressure: {weatherData.current.pressure_mb} mb</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Image
                    source={{ uri: 'https://img.icons8.com/material-outlined/24/wind.png' }}
                    style={styles.iconSmall}
                  />
                  <Text style={styles.infoText}>Wind: {weatherData.current.wind_kph} kph, {weatherData.current.wind_dir}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Image 
                source={{ uri: 'https://static.vecteezy.com/system/resources/previews/012/066/499/original/sunny-and-rainy-day-weather-forecast-icon-meteorological-sign-3d-render-png.png' }}
                style={styles.weatherImage}
              />
              <Text style={styles.loadingText}>Loading...</Text>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={nextPage}>
            <Text style={styles.buttonText}>See Full Forecast</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Index;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  weatherImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  forecastContainer: {
    backgroundColor: 'rgba(149, 230, 235, 0.895)', // Light background with more transparency
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'flex-start',
    width: '100%',
    elevation: 5, // Adds shadow for better visibility
  },
  info: {
    fontSize: 18,
    textAlign: 'center',
    color: '#444',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#444',
    marginLeft: 10,
  },
  icon: {
    width: 160,
    aspectRatio: 1,
    marginBottom: 20,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
  button: {
    backgroundColor:"#3e91ef" ,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});
