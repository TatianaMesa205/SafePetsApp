import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleConsultorio({ route, navigation }) {
  // Aceptamos dos formas: { consultorio } o { id }
  const { consultorio: consultorioParam, id: idParam } = route.params || {};
  const [consultorio, setConsultorio] = useState(consultorioParam || null);
  const [loading, setLoading] = useState(!consultorioParam); // si ya viene, no cargamos

  useEffect(() => {
    // si ya vino el consultorio por params, no hacemos fetch
    if (consultorioParam) {
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
        // Ajusta la ruta según tu backend real. Aquí uso una ruta GET típica:
        const url = `${API_BASE_URL}/consultorios/${idParam}`;
        console.log("👉 Fetch detalle consultorio:", url, "token:", !!token);
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
          console.error("Detalle consultorio - status:", response.status, data);
        } else {
          // Si backend devuelve array con 1 elemento: tomar el primero
          const item = Array.isArray(data) ? data[0] : data;
          setConsultorio(item || null);
        }
      } catch (error) {
        console.error("Error obteniendo consultorio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [consultorioParam, idParam]);

  const handleEliminar = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que deseas eliminar este consultorio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarConsultorios/${consultorio.id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              if (response.ok) {
                Alert.alert("Éxito", "El consultorio ha sido eliminado");
                navigation.navigate("ListarConsultorios");
              } else {
                const err = await response.json();
                Alert.alert("Error", err.message || "No se pudo eliminar el consultorio");
              }
            } catch (error) {
              console.error("Error eliminando consultorio:", error);
              Alert.alert("Error", "Ocurrió un problema al eliminar el consultorio");
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
        <Text style={{ marginTop: 10, color: "#006064" }}>Cargando consultorio...</Text>
      </View>
    );
  }

  if (!consultorio) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró el consultorio</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del consultorio</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Número del consultorio: {consultorio.numero}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="business-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Ubicación: {consultorio.ubicacion || "No asignado"}</Text>
        </View>
      </View>

      {/* Enviamos los parámetros que Editar espera (id, numeroInicial, ubicacionInicial) */}
      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() =>
          navigation.navigate("EditarConsultorio", {
            id: consultorio.id,
            numeroInicial: consultorio.numero,
            ubicacionInicial: consultorio.ubicacion,
          })
        }
      >
        <Ionicons name="create-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Editar consultorio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleEliminar}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Eliminar consultorio</Text>
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
