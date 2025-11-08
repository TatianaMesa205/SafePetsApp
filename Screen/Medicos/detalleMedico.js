import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../../Src/Config"

export default function DetalleMedico({ route, navigation }) {
  const { medico: medicoParam, id: idParam } = route.params || {}
  const [medico, setMedico] = useState(medicoParam || null)
  const [loading, setLoading] = useState(!medicoParam)

  const handleEliminar = async () => {
  Alert.alert(
    "Confirmar eliminación",
    "¿Seguro que deseas eliminar este medico?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/eliminarMedicos/${medico.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });

            if (response.ok) {
              Alert.alert("Éxito", "El medico ha sido eliminado");
              navigation.navigate("ListarMedicos");
            } else {
              const err = await response.json();
              Alert.alert("Error", err.message || "No se pudo eliminar el medico");
            }
          } catch (error) {
            console.error("Error eliminando medico:", error);
            Alert.alert("Error", "Ocurrió un problema al eliminar el medico");
          }
        },
      },
    ]
  );
};


  useEffect(() => {
    if (medicoParam) {
      setLoading(false)
      return
    }
    if (!idParam) {
      setLoading(false)
      return
    }

    const fetchDetalle = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const url = `${API_BASE_URL}/medicos/${idParam}`
        console.log("👉 fetch detalle medico:", url, "token:", !!token)
        const response = await fetch(url, {
          headers: {
            authorization: token ? `bearer ${token}` : "",
            accept: "application/json",
          },
        })

        const text = await response.text()
        let data
        try { data = JSON.parse(text) } catch (e) { data = text }

        if (!response.ok) {
          console.error("Detalle medico - status:", response.status, data)
        } else {
          const item = Array.isArray(data) ? data[0] : data
          setMedico(item || null)
        }
      } catch (error) {
        console.error("error obteniendo medico:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetalle()
  }, [medicoParam, idParam])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0097A7" />
        <Text style={{ marginTop: 10, color: "#006064" }}>Cargando médico...</Text>
      </View>
    )
  }

  if (!medico) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró el médico</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del médico</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Nombre: {medico.nombre_m} {medico.apellido_m}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="medical-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>
            Especialidad: {medico.especialidades?.nombre_e || "sin especialidad"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="hourglass-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Edad: {medico.edad}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Teléfono: {medico.telefono}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() => navigation.navigate("EditarMedico", { medico })}
      >
        <Ionicons name="create-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Editar médico</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleEliminar}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Eliminar medico</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  )
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
  buttonText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  deleteButton: { backgroundColor: "#e57373" },

})
