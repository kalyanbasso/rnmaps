import { View } from "react-native";
import { useEffect, useRef, useState } from "react";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
} from "expo-location";

import { styles } from "./styles";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [currentPosition, setCurrentPosition] = useState<null | LocationObject>(
    null
  );

  const mapRef = useRef<MapView>(null);

  async function requestPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const newCurrentPosition = await getCurrentPositionAsync();
      setCurrentPosition(newCurrentPosition);
    }
  }

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: 6,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newPosition) => {
        setCurrentPosition(newPosition);
        mapRef.current?.animateCamera({
          center: newPosition.coords,
          pitch: 70,
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {currentPosition && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentPosition.coords.latitude,
              longitude: currentPosition.coords.longitude,
            }}
            title="You are here"
            description="This is your current location"
          />
        </MapView>
      )}
    </View>
  );
}
