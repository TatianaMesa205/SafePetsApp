import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleEspecialidad({ route, navigation }) {
  // Aceptamos dos formas: { especialidad } o { id }
  const { especialidad: especialidadParam, id: idParam } = route.params || {};
  const [especialidades, setEspecialidades] = useState(especialidadParam || null);
  const [loading, setLoading] = useState(!especialidadParam); // si ya viene, no cargamos

  useEffect(() => {
    if (especialidadParam) {
      setLoading(false);
      return;
    }
    if (!idParam) {
      setLoading(false);
      return;
    }

    const fetchDetalle = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const url = `${API_BASE_URL}/especialidades/${idParam}`;
        console.log("👉 Fetch detalle Especialidades:", url, "token:", !!token);
        const response = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
          },
        });

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { data = text; }

        if (!response.ok) {
          console.error("Detalle especialidad - status:", response.status, data);
        } else {
          const item = Array.isArray(data) ? data[0] : data;
          setEspecialidades(item || null);
        }
      } catch (error) {
        console.error("Error obteniendo especialidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [especialidadParam, idParam]);

  const handleEliminar = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que deseas eliminar esta especialidad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarEspecialidades/${especialidades.id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              if (response.ok) {
                Alert.alert("Éxito", "La especialidad ha sido eliminada");
                navigation.navigate("ListarEspecialidades");
              } else {
                const err = await response.json();
                Alert.alert("Error", err.message || "No se pudo eliminar la especialidad");
              }
            } catch (error) {
              console.error("Error eliminando especialidad:", error);
              Alert.alert("Error", "Ocurrió un problema al eliminar la especialidad");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0097A7" />
        <Text style={{ marginTop: 10, color: "#006064" }}>Cargando especialidad...</Text>
      </View>
    );
  }

  if (!especialidades) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró la especialidad</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de la especialidad</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Nombre de la especialidad: {especialidades.nombre_e}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() =>
          navigation.navigate("EditarEspecialidad", {
            id: especialidades.id,
            especialidadInicial: especialidades.nombre_e,
          })
        }
      >
        <Ionicons name="create-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Editar especialidad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleEliminar}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Eliminar especialidad</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F7FA", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#006064" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  info: { fontSize: 16, marginLeft: 10, color: "#004D40" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0097A7",
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    marginTop: 12,
  },
  editButton: { backgroundColor: "#c2b485ff" },
  deleteButton: { backgroundColor: "#e57373" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 6 },
});
