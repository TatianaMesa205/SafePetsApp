import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Image, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44; // Dos tarjetas por fila

export default function ListarMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No se encontró el token. Inicia sesión nuevamente.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/listarMascotas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const text = await response.text();
        if (text.startsWith("<")) {
          throw new Error("El backend devolvió HTML. Revisa autenticación o CORS.");
        }

        const data = JSON.parse(text);
        setMascotas(data);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        Alert.alert("Error", "No se pudieron cargar las mascotas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  const handlePress = (mascota, ref) => {
    if (ref) {
      ref.pulse(300).then(() => navigation.navigate("DetalleMascotaP", { mascota }));
    } else {
      navigation.navigate("DetalleMascotaP", { mascota });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#C6A27E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🐾 Mascotas disponibles</Text>
      <View style={styles.grid}>
        {mascotas.map((mascota, index) => {
          let cardRef = null;

          return (
            <Animatable.View
              key={mascota.id}
              animation="fadeInUp"
              duration={550}
              delay={index * 80}
              useNativeDriver
              style={styles.cardWrapper}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePress(mascota, cardRef)}
              >
                <Animatable.View
                  ref={(ref) => (cardRef = ref)}
                  style={styles.card}
                >
                  {mascota.imagen ? (
                    <Image source={{ uri: mascota.imagen }} style={styles.image} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>Sin imagen</Text>
                    </View>
                  )}

                  <View style={styles.info}>
                    <Text numberOfLines={1} style={styles.nombre}>
                      {mascota.nombre}
                    </Text>
                    <Text style={styles.text} numberOfLines={1}>
                      {mascota.especie} • {mascota.sexo ?? "N/A"}
                    </Text>
                    <Text style={styles.edad}>{mascota.edad} años</Text>
                  </View>
                </Animatable.View>
              </TouchableOpacity>
            </Animatable.View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    backgroundColor: "#F6EFE9",
    alignItems: "center",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6EFE9",
    paddingTop: 60,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8C6B4F",
    marginBottom: 12,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8DCC8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#EDE1D1",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#9C8A74",
    fontSize: 13,
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
  nombre: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B4E2E",
    marginBottom: 4,
    width: "100%",
  },
  text: {
    fontSize: 13,
    color: "#8C6B4F",
    marginBottom: 2,
    width: "100%",
  },
  edad: {
    fontSize: 12,
    color: "#A88764",
  },
});
