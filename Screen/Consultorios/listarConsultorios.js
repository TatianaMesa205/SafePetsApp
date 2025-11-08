import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarConsultorios({ navigation }) {
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultorios = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // 🔑 recuperar token si tu endpoint está protegido
        const response = await fetch(`${API_BASE_URL}/listarConsultorios`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setConsultorios(data);
        } else {
          console.error("Error en la respuesta:", data);
        }
      } catch (error) {
        console.error("Error obteniendo consultorios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultorios();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#706180ff" />
        <Text style={{ marginTop: 10, color: "#706180ff" }}>Cargando consultorios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Lista de Consultorios</Text>

      <FlatList
        data={consultorios}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalleConsultorio", { consultorio: item })}
          >
            <View style={styles.cardContent}>
              <Ionicons name="business-outline" size={28} color="#b2a3c0ff" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.ubicacion}>{item.ubicacion}</Text>
                <Text style={styles.numero}>Consultorio {item.numero}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#706180ff" />
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
  ubicacion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#776985ff",
  },
  numero: {
    fontSize: 14,
    color: "#675285ff",
  },
});
