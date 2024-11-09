import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, ActivityIndicator, Text } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../context/GlobalProvider";
import { useRouter } from "expo-router"; 
import MapView, { Marker } from 'react-native-maps';

const Home = () => {
  const router = useRouter();
  const { isLogged, logout, loading: authLoading } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (!authLoading && !isLogged) {
      router.replace("/signIn");
    }
  }, [authLoading, isLogged]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (authLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const centerCoordinates = {
    latitude: 37.7876,
    longitude: -122.4166,
  };

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: "Selected Location",
      description: `Latitude: ${coordinate.latitude}, Longitude: ${coordinate.longitude}`,
    });
  };

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: centerCoordinates.latitude,
              longitude: centerCoordinates.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={handleMapPress}
          >
            {data.map((location, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
                description={location.description}
                onPress={() => handleMarkerPress(location)}
              />
            ))}
          </MapView>

          {selectedLocation && (
            <View style={styles.detailsContainer}>
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.detailsTitle}>{selectedLocation.name}</Text>
                  <Text style={styles.detailsDescription}>{selectedLocation.description}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detailsDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
});

export default Home;
