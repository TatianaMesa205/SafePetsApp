import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarEspecialidades({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // si tu endpoint está protegido
        const response = await fetch(`${API_BASE_URL}/listarEspecialidades`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setEspecialidades(data);
        } else {
          console.error("Error en la respuesta:", data);
        }
      } catch (error) {
        console.error("Error obteniendo especialidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEspecialidades();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#706180ff" />
        <Text style={{ marginTop: 10, color: "#706180ff" }}>
          Cargando especialidades...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Lista de Especialidades</Text>

      <FlatList
        data={especialidades}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetalleEspecialidad", { especialidad: item })
            }
          >
            <View style={styles.cardContent}>
              <Ionicons
                name="medkit-outline"
                size={28}
                color="#b2a3c0ff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.nombreE}>{item.nombre_e}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#706180ff"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f0ff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#706180ff",
    marginBottom: 15,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  nombreE: {
    fontSize: 16,
    fontWeight: "600",
    color: "#776985ff",
  },
});
