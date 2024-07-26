import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ImageBackground, Image, ScrollView } from "react-native";
import { useRouter } from 'expo-router';

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

interface WeatherData {
  forecast: {
    forecastday: ForecastDay[];
  };
}

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=878a747ded634212868132512242607&q=kolkata&days=7&aqi=no`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to fetch weather data');
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const nextPage = () => {
    router.push('/');
  };

  return (
    <ImageBackground 
      source={{ uri: "https://img.freepik.com/free-vector/sky-background-video-conferencing_23-2148639325.jpg" }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>7-Day Weather Forecast</Text>
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : weatherData ? (
          weatherData.forecast.forecastday.map((day, index) => (
            <View key={index} style={styles.forecastContainer}>
              <Text style={styles.date}>{formatDate(day.date)}</Text>
              <Image source={{ uri: `http:${day.day.condition.icon}` }} style={styles.icon} />
              <Text style={styles.condition}>{day.day.condition.text}</Text>
              <Text style={styles.temp}>Max: {day.day.maxtemp_c}°C</Text>
              <Text style={styles.temp}>Min: {day.day.mintemp_c}°C</Text>
            </View>
          ))
        ) : (
          <Text style={styles.loading}>Loading...</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={nextPage}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  error: {
    fontSize: 18,
    color: '#d14a4a',
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    fontSize: 18,
    color: '#1e3c72',
    marginBottom: 20,
    textAlign: 'center',
  },
  forecastContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  condition: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  temp: {
    fontSize: 16,
    color: '#1e3c72',
  },
  button: {
    backgroundColor: '#1e3c72',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});
