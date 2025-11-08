import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, FlatList, Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import Ionicons from "react-native-vector-icons/Ionicons"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import API_BASE_URL from "../../Src/Config"

export default function EditarCita({ route, navigation }) {
  const { cita } = route.params

  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [consultorios, setConsultorios] = useState([])
  const [loading, setLoading] = useState(true)

  const [idPaciente, setIdPaciente] = useState(cita.id_pacientes)
  const [idMedico, setIdMedico] = useState(cita.id_medicos)
  const [idConsultorio, setIdConsultorio] = useState(cita.id_consultorios)
  const [fecha, setFecha] = useState(cita.fecha)
  const [hora, setHora] = useState(cita.hora)
  const [motivo, setMotivo] = useState(cita.motivo || "")
  const [estado, setEstado] = useState(cita.estado || "pendiente")

  const [modalPacienteVisible, setModalPacienteVisible] = useState(false)
  const [modalMedicoVisible, setModalMedicoVisible] = useState(false)
  const [modalConsultorioVisible, setModalConsultorioVisible] = useState(false)
  const [modalEstadoVisible, setModalEstadoVisible] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const estadosOpciones = ["pendiente", "confirmada", "cancelada"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const [pacRes, medRes, conRes] = await Promise.all([
          fetch(`${API_BASE_URL}/listarPacientes`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/listarMedicos`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/listarConsultorios`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
        ])
        setPacientes(await pacRes.json())
        setMedicos(await medRes.json())
        setConsultorios(await conRes.json())
      } catch (e) {
        console.error("Error cargando datos:", e)
        Alert.alert("Error cargando pacientes, médicos o consultorios")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleEditar = async () => {
    if (!idPaciente || !idMedico || !idConsultorio || !fecha || !hora || !estado) {
      Alert.alert("⚠️ Completa todos los campos")
      return
    }
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/actualizarCitas/${cita.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_pacientes: idPaciente, id_medicos: idMedico, id_consultorios: idConsultorio, fecha, hora, estado, motivo }),
      })
      const body = await response.json()
      if (response.ok) {
        Alert.alert("✅ Cita editada correctamente")
        navigation.navigate("ListarCitas")
      } else {
        Alert.alert("Error", body.message || "Error editando cita")
      }
    } catch (e) {
      console.error(e)
      Alert.alert("Error de conexión")
    }
  }

  // ✅ Fecha corregida igual que en CrearCita
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      // Evitar que se seleccione una fecha anterior al día actual
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)

      if (selectedDate < hoy) {
        Alert.alert("⚠️ No puedes seleccionar una fecha anterior al día actual.")
        return
      }

      // ✅ Corregir desfase (evitar que reste un día por zona horaria)
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
      const day = String(selectedDate.getDate()).padStart(2, "0")
      const fechaFormateada = `${year}-${month}-${day}`

      setFecha(fechaFormateada)
    }
  }

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a67c52" />
        <Text style={{ marginTop: 10, color: "#444" }}>Cargando...</Text>
      </View>
    )

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Editar Cita</Text>

        {/* Paciente */}
        <Text style={styles.label}>Paciente</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalPacienteVisible(true)}>
          <Text style={styles.selectText}>
            {idPaciente ? pacientes.find(p => p.id === idPaciente)?.nombre : "Selecciona Paciente"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#a67c52" />
        </TouchableOpacity>

        {/* Médico */}
        <Text style={styles.label}>Médico</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalMedicoVisible(true)}>
          <Text style={styles.selectText}>
            {idMedico ? medicos.find(m => m.id === idMedico)?.nombre_m + " " + medicos.find(m => m.id === idMedico)?.apellido_m : "Selecciona Médico"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#a67c52" />
        </TouchableOpacity>

        {/* Consultorio */}
        <Text style={styles.label}>Consultorio</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalConsultorioVisible(true)}>
          <Text style={styles.selectText}>
            {idConsultorio ? "Consultorio " + consultorios.find(c => c.id === idConsultorio)?.numero : "Selecciona Consultorio"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#a67c52" />
        </TouchableOpacity>

        {/* Fecha */}
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fecha ? "#5c4033" : "#aaa" }}>{fecha || "Selecciona Fecha"}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fecha ? new Date(fecha) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        {/* Hora */}
        <Text style={styles.label}>Hora</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM"
          placeholderTextColor="#b0b0b0"
          value={hora}
          onChangeText={setHora}
        />

        {/* Motivo */}
        <Text style={styles.label}>Motivo</Text>
        <TextInput
          style={styles.input}
          placeholder="Motivo de la cita"
          placeholderTextColor="#b0b0b0"
          value={motivo}
          onChangeText={setMotivo}
        />

        {/* Estado */}
        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalEstadoVisible(true)}>
          <Text style={styles.selectText}>{estado}</Text>
          <Ionicons name="chevron-down" size={18} color="#a67c52" />
        </TouchableOpacity>

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={handleEditar}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <Modal transparent visible={modalPacienteVisible} animationType="fade" onRequestClose={() => setModalPacienteVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={pacientes}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { setIdPaciente(item.id); setModalPacienteVisible(false) }}>
                  <Text style={styles.optionText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalMedicoVisible} animationType="fade" onRequestClose={() => setModalMedicoVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={medicos}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { setIdMedico(item.id); setModalMedicoVisible(false) }}>
                  <Text style={styles.optionText}>{item.nombre_m} {item.apellido_m}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalConsultorioVisible} animationType="fade" onRequestClose={() => setModalConsultorioVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={consultorios}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { setIdConsultorio(item.id); setModalConsultorioVisible(false) }}>
                  <Text style={styles.optionText}>Consultorio {item.numero}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={modalEstadoVisible} animationType="fade" onRequestClose={() => setModalEstadoVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={estadosOpciones}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => { setEstado(item); setModalEstadoVisible(false) }}>
                  <Text style={styles.optionText}>{item}</Text>
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
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f0e6",
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
    color: "#a67c52",
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
    borderColor: "#d4b483",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { fontSize: 15, color: "#5c4033" },
  input: {
    borderWidth: 1,
    borderColor: "#d4b483",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#a67c52",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f0e6"
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 20, width: "80%" },
  option: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  optionText: { fontSize: 16, color: "#5c4033" },
})
