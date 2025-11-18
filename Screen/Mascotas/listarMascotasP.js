import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Image, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.44;

export default function ListarMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos"); // 🔥 NUEVO

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
          throw new Error("El backend devolvió HTML");
        }

        const data = JSON.parse(text);

        // Filtrar válidas
        const mascotasValidas = data.filter(
          (m) => m.imagen && m.imagen.trim() !== "" && m.estado !== "Adoptado"
        );

        setMascotas(mascotasValidas);
        setMascotasFiltradas(mascotasValidas); // Inicial
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
        Alert.alert("Error", "No se pudieron cargar las mascotas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  // 🔥 Función para filtrar por especie
  const aplicarFiltro = (tipo) => {
    setFiltro(tipo);

    if (tipo === "Todos") {
      setMascotasFiltradas(mascotas);
    } else {
      setMascotasFiltradas(mascotas.filter((m) => m.especie === tipo));
    }
  };

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

      {/* FILTROS */}
      <View style={styles.filtrosRow}>
        {["Todos", "Perro", "Gato"].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.filtroBtn,
              filtro === tipo && styles.filtroBtnActivo
            ]}
            onPress={() => aplicarFiltro(tipo)}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtro === tipo && styles.filtroTextoActivo
              ]}
            >
              {tipo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <View style={styles.grid}>
        {mascotasFiltradas.map((mascota, index) => {
          let cardRef = null;

          let estadoColor = "#BDBDBD";
          if (mascota.estado === "Disponible") estadoColor = "#4CAF50";
          if (mascota.estado === "En Tratamiento") estadoColor = "#FFA726";

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
                <Animatable.View ref={(ref) => (cardRef = ref)} style={styles.card}>
                  {mascota.imagen && (
                    <Image
                      source={{ uri: mascota.imagen }}
                      style={styles.image}
                      onError={() => (mascota.imagen = null)}
                    />
                  )}

                  <View style={styles.info}>
                    <View style={styles.estadoRow}>
                      <Text numberOfLines={1} style={styles.nombre}>
                        {mascota.nombre}
                      </Text>
                      <View style={[styles.estadoBadge, { backgroundColor: estadoColor }]}>
                        <Text style={styles.estadoTexto}>{mascota.estado}</Text>
                      </View>
                    </View>

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

  /* 🔥 ESTILOS FILTROS */
  filtrosRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 18,
    marginTop: 5,
  },
  filtroBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7B8A3",
    backgroundColor: "#FFF",
  },
  filtroBtnActivo: {
    backgroundColor: "#C6A27E",
    borderColor: "#C6A27E",
  },
  filtroTexto: {
    color: "#8C6B4F",
    fontWeight: "600",
  },
  filtroTextoActivo: {
    color: "white",
  },

  /* TARJETAS */
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
  info: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  estadoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  estadoBadge: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 75,
    alignItems: "center",
  },
  estadoTexto: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  nombre: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B4E2E",
    marginBottom: 4,
    flexShrink: 1,
  },
  text: {
    fontSize: 13,
    color: "#8C6B4F",
    marginBottom: 2,
  },
  edad: {
    fontSize: 12,
    color: "#A88764",
  },
});
