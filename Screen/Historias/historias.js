import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Image, View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.92;

export default function HistoriasP() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

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
          throw new Error("El backend devolvió HTML");
        }

        const data = JSON.parse(text);

        const adoptadas = data.filter(
          (m) => m.imagen && m.imagen.trim() !== "" && m.estado === "Adoptado"
        );

        setMascotas(adoptadas);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        Alert.alert("Error", "No se pudieron cargar las mascotas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#C6A27E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🐾 Historias de Adopción</Text>

      <View style={styles.grid}>
        {mascotas.map((mascota, index) => {
          return (
            <Animatable.View
              key={mascota.id}
              animation="fadeInUp"
              duration={500}
              delay={index * 80}
              useNativeDriver
              style={styles.card}
            >
              {/* --- NOMBRE --- */}
              <Text style={styles.nombre}>{mascota.nombre}</Text>

              {/* --- ESPECIE / RAZA / EDAD --- */}
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Especie:</Text>
                  <Text style={styles.value}>{mascota.especie}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Raza:</Text>
                  <Text style={styles.value}>{mascota.raza}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.label}>Edad:</Text>
                  <Text style={styles.value}>{mascota.edad} años</Text>
                </View>
              </View>

              {/* --- IMAGEN --- */}
              {mascota.imagen && (
                <Image
                  source={{ uri: mascota.imagen }}
                  style={styles.imagenConMargen}
                />
              )}

              {/* --- DESCRIPCIÓN --- */}
              <Text style={styles.descripcion}>
                {mascota.descripcion || "Sin descripción disponible."}
              </Text>
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
    paddingHorizontal: 10,
    backgroundColor: "#F6EFE9",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6EFE9",
    paddingTop: 60,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8C6B4F",
    marginBottom: 15,
    textAlign: "center",
  },
  grid: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginBottom: 22,
    paddingBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E6D5C3",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    paddingTop: 15,
  },

  /* --- NOMBRE --- */
  nombre: {
    fontSize: 22,
    fontWeight: "800",
    color: "#6B4E2E",
    textAlign: "center",
    marginBottom: 8,
  },

  /* --- INFO LISTA (Especie, Raza, Edad) --- */
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontWeight: "700",
    color: "#8C6B4F",
    width: 85,
  },
  value: {
    fontWeight: "400",
    color: "#6B4E2E",
  },

  /* --- IMAGEN --- */
  imagenConMargen: {
    width: "90%",
    height: 220,
    borderRadius: 14,
    alignSelf: "center",
    resizeMode: "cover",
    marginBottom: 12,
    marginTop: 6,
  },

  /* --- DESCRIPCIÓN --- */
  descripcion: {
    fontSize: 15,
    color: "#7A674F",
    paddingHorizontal: 18,
    textAlign: "center",
    fontStyle: "italic",
  },
});
