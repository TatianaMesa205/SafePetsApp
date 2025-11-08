import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../../Src/Config"

export default function DetalleCita({ route, navigation }) {
  const { cita } = route.params

  const handleEliminar = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "Cseguro que deseas eliminar esta cita?",
      [
        { text: "cancelar", style: "cancel" },
        {
          text: "eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token")
              const response = await fetch(`${API_BASE_URL}/eliminarCitas/${cita.id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              })

              if (response.ok) {
                Alert.alert("Exito", "La cita ha sido eliminada")
                navigation.navigate("ListarCitas")
              } else {
                const err = await response.json()
                Alert.alert("error", err.message || "No se pudo eliminar la cita")
              }
            } catch (error) {
              console.error("Error eliminando cita:", error)
              Alert.alert("error", "ocurrió un problema al eliminar la cita")
            }
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌊 Detalle de la cita</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>
            paciente: {cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : "no asignado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>fecha: {cita.fecha}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>hora: {cita.hora}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>
            médico: {cita.medico ? `${cita.medico.nombre_m} ${cita.medico.apellido_m}` : "no asignado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="business-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>
            consultorio: {cita.consultorio ? cita.consultorio.numero : "no asignado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#0097A7" />
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 6 }}>
            <Text style={styles.info}>estado:</Text>
            <View
              style={[
                styles.estadoBadge,
                (cita.estado || "pendiente") === "pendiente"
                  ? { backgroundColor: "#fff4b3" }
                  : (cita.estado || "pendiente") === "confirmada"
                  ? { backgroundColor: "#c6f6d5" }
                  : { backgroundColor: "#feb2b2" },
              ]}
            >
              <Text style={styles.estadoText}>{(cita.estado || "pendiente").toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="document-text-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>motivo: {cita.motivo || "no especificado"}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() => navigation.navigate("EditarCita", { cita })}
      >
        <Ionicons name="create-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Editar cita</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleEliminar}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Eliminar cita</Text>
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
  deleteButton: { backgroundColor: "#e57373" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  estadoBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginLeft: 6,
  },
  estadoText: { fontSize: 12, fontWeight: "bold", color: "#333" },
})
