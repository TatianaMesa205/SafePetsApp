import React, { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, FlatList} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from "react-native-vector-icons/Ionicons"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import API_BASE_URL from "../../Src/Config"

export default function CrearMedico({ navigation }) {
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [idEspecialidad, setIdEspecialidad] = useState("")
  const [especialidadModalVisible, setEspecialidadModalVisible] = useState(false)

  const [nombreM, setNombreM] = useState("")
  const [apellidoM, setApellidoM] = useState("")
  const [edad, setEdad] = useState("")
  const [telefono, setTelefono] = useState("")

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const response = await fetch(`${API_BASE_URL}/listarEspecialidades`, {
          headers: { accept: "application/json", authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setEspecialidades(data)
      } catch (error) {
        console.error("Error cargando especialidades:", error)
        Alert.alert("Error", "No se pudieron cargar las especialidades")
      } finally {
        setLoading(false)
      }
    }
    fetchEspecialidades()
  }, [])

  const handleCrear = async () => {
    if (!idEspecialidad || !nombreM || !apellidoM || !edad || !telefono) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos")
      return
    }

    try {
      const token = await AsyncStorage.getItem("token")
      const role = await AsyncStorage.getItem("role")

      if (!token) {
        Alert.alert("No autenticado", "Debes iniciar sesión para crear médicos")
        navigation.navigate("Login")
        return
      }

      if (role !== "admin") {
        Alert.alert("Permisos insuficientes", "Solo usuarios con rol 'admin' pueden crear médicos")
        return
      }

      const response = await fetch(`${API_BASE_URL}/crearMedicos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_especialidades: idEspecialidad,
          nombre_m: nombreM,
          apellido_m: apellidoM,
          edad,
          telefono,
        }),
      })

      const body = await response.json()
      if (response.ok) {
        Alert.alert("✅ Médico creado correctamente")
        navigation.navigate("ListarMedicos")
      } else {
        Alert.alert("Error", body.message || "No se pudo crear el médico")
      }
    } catch (error) {
      console.error("🚨 Error de conexión:", error)
      Alert.alert("🚨 Error", "Ocurrió un error al conectar con el servidor")
    }
  }

  if (loading) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#9b59b6" />
      <Text style={{ marginTop: 10 }}>Cargando medicos...</Text>
    </View>
  )

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      extraScrollHeight={100}   // mueve más arriba al abrir teclado
      enableOnAndroid={true}
    >
      <View style={styles.card}>
        <Text style={styles.title}>➕ Nuevo Médico</Text>

        {/* Especialidad */}
        <Text style={styles.label}>Especialidad</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setEspecialidadModalVisible(true)}>
          <Text style={styles.selectText}>
            {idEspecialidad
              ? especialidades.find((e) => e.id === idEspecialidad)?.nombre_e
              : "Selecciona una especialidad"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9b59b6" />
        </TouchableOpacity>

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan"
          value={nombreM}
          onChangeText={setNombreM}
        />

        {/* Apellido */}
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pérez"
          value={apellidoM}
          onChangeText={setApellidoM}
        />

        {/* Edad */}
        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 40"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />

        {/* Teléfono */}
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3001234567"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Médico</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de especialidades */}
      <Modal 
        transparent 
        visible={especialidadModalVisible} 
        animationType="fade" 
        onRequestClose={() => setEspecialidadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={especialidades}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setIdEspecialidad(item.id)
                    setEspecialidadModalVisible(false)
                  }}
                >
                  <Text style={styles.optionText}>{item.nombre_e}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f3e9f7",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9b59b6",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#d1b3ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { fontSize: 16, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#d1b3ff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#a564d3",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContainer: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 20, 
    width: "80%" 
  },
  option: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee" 
  },
  optionText: { 
    fontSize: 16, 
    color: "#5e0066" 
  },
})
