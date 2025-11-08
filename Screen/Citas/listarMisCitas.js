import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import API_BASE_URL from "../../Src/Config"

export default function ListarMisCitas({ navigation }) {

  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [idPaciente, setIdPaciente] = useState(null)

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = await AsyncStorage.getItem("token")

        if (!token) {
          setLoading(false)
          Alert.alert("sesión requerida", "⚠️ debes iniciar sesión para ver tus citas")
          return
        }

        const response = await fetch(`${API_BASE_URL}/listarMisCitas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const data = await response.json()
        if (response.ok && data.success) {
          setCitas(data.data ?? [])
          setIdPaciente(data.paciente_id) // 👈 guardamos el id para crear cita después
        } else {
          Alert.alert("Registro requerido", "⚠️ Debes completar el formulario para poder crear una cita")
        }
      } catch (error) {
        console.error("Error obteniendo citas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCitas()
  }, [])

  const handleDateChange = (event, date) => {
    setShowDatePicker(false)
    if (date) {
      const isoDate = date.toISOString().split("T")[0]
      setSelectedDate(isoDate)
    }
  }

  const handleCrearCita = () => {
    if (!idPaciente) {
      Alert.alert("Recuerda", "⚠️ Debes completar primero el formulario para crear una cita.")
      return
    }
    navigation.navigate("CrearCitaP", { idPaciente }) // 👈 aquí lo pasas
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#706180ff" />
        <Text style={{ marginTop: 10, color: "#706180ff" }}>Cargando mis citas...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Mis citas</Text>

      {citas.length === 0 ? (
        <Text style={styles.warningText}>⚠️ No tienes citas pendientes</Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("DetalleCitaP", { cita: item })}
            >
            <View style={styles.cardContent}>
              <Ionicons name="calendar-outline" size={28} color="#b2a3c0ff" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.date}>
                  {item.fecha} - {item.hora}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.doctor}>
                    👨‍⚕️ {item.medico?.nombre_m} {item.medico?.apellido_m}
                  </Text>
                  <View
                    style={[
                      styles.estadoBadge,
                      item.estado === "pendiente"
                        ? { backgroundColor: "#fff4b3" } // amarillo claro
                        : item.estado === "confirmada"
                        ? { backgroundColor: "#c6f6d5" } // verde claro
                        : { backgroundColor: "#feb2b2" }, // rojo claro
                    ]}
                  >
                    <Text style={styles.estadoText}>{item.estado.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </View>

              <Ionicons name="chevron-forward-outline" size={24} color="#706180ff" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* botón crear cita */}
      <TouchableOpacity style={styles.addButton} onPress={handleCrearCita}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Crear cita</Text>
      </TouchableOpacity>

      {/* botón registrarme como paciente */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#7c64a9" }]}
        onPress={() => {
          if (idPaciente) {
            Alert.alert("Ya registrado", "✅ Ya estás registrado como paciente, no es necesario hacerlo de nuevo")
          } else {
            navigation.navigate("CrearPacienteP")
          }
        }}
      >
        <Ionicons name="person-add-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Completar formulario</Text>
      </TouchableOpacity>


      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f0ff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#9b83b4ff", marginBottom: 15, textAlign: "center" },
  list: { paddingBottom: 20 },
  warningText: { fontSize: 16, color: "#a14", textAlign: "center", marginVertical: 20 },
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
  cardContent: { flexDirection: "row", alignItems: "center" },
  date: { fontSize: 16, fontWeight: "600", color: "#776985ff" },
  doctor: { fontSize: 14, color: "#675285ff" },
  addButton: {
    backgroundColor: "#9b8bb1ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  estadoBadge: {
  paddingVertical: 2,
  paddingHorizontal: 8,
  borderRadius: 15,
  marginLeft: 8,
},
estadoText: {
  fontSize: 12,
  fontWeight: "bold",
  color: "#333",
},

})
