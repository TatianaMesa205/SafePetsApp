import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, FlatList, Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import Ionicons from "react-native-vector-icons/Ionicons"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import API_BASE_URL from "../../Src/Config"

export default function CrearCita({ navigation }) {
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [consultorios, setConsultorios] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)

  const [idPaciente, setIdPaciente] = useState("")
  const [idMedico, setIdMedico] = useState("")
  const [idConsultorio, setIdConsultorio] = useState("")
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [motivo, setMotivo] = useState("")
  const [estado, setEstado] = useState("pendiente")
  const [showtimepicker, setshowtimepicker] = useState(false);

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
        const [pacRes, medRes, conRes, espRes] = await Promise.all([
          fetch(`${API_BASE_URL}/listarPacientes`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/listarMedicos`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/listarConsultorios`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/listarEspecialidades`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
        ])

        setPacientes(await pacRes.json())
        setMedicos(await medRes.json())

        setEspecialidades(await espRes.json());

        setConsultorios(await conRes.json())
      } catch (e) {
        console.error("Error cargando datos:", e)
        Alert.alert("Error", "No se pudieron cargar pacientes, médicos o consultorios")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCrear = async () => {
    if (!idPaciente || !idMedico || !idConsultorio || !fecha || !hora || !estado) {
      Alert.alert("⚠️ Completa todos los campos")
      return
    }

    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/crearCitas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_pacientes: idPaciente,
          id_medicos: idMedico,
          id_consultorios: idConsultorio,
          fecha,
          hora,
          estado,
          motivo,
        }),
      })

      const body = await response.json()
      if (response.ok) {
        Alert.alert("✅ Cita creada correctamente")
        navigation.navigate("ListarCitas")
      } else {
        Alert.alert("Error", body.message || "Error creando cita")
      }
    } catch (e) {
      console.error(e)
      Alert.alert("Error", "Error de conexión")
    }
  }

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

  const handletimechange = (event, selectedtime) => {
    setshowtimepicker(false)
    if (selectedtime) {
      const hh = String(selectedtime.getHours()).padStart(2, "0")
      const mm = String(selectedtime.getMinutes()).padStart(2, "0")
      setHora(`${hh}:${mm}`)
    }
  }

  const getEspecialidad = (idEsp) => {
    const esp = especialidades.find((e) => String(e.id) === String(idEsp));
    return esp ? esp.nombre || esp.nombre_e || "Sin especialidad" : "Sin especialidad";
  }

  const timevalue = hora ? (() => {
    const [h,m] = hora.split(":").map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  })() : new Date()


  if (loading) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#9b59b6" />
      <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
    </View>
  )

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      extraScrollHeight={130}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>📅 Nueva Cita</Text>

        {/* Paciente */}
        <Text style={styles.label}>Paciente</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalPacienteVisible(true)}>
          <Text style={styles.selectText}>
            {idPaciente 
          ? `${pacientes.find(p => p.id === idPaciente)?.nombre} ${pacientes.find(p => p.id === idPaciente)?.apellido}` 
          : "Selecciona un paciente"}

          </Text>
          <Ionicons name="chevron-down" size={20} color="#9b59b6" />
        </TouchableOpacity>

        {/* Médico */}
        <Text style={styles.label}>Médico</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalMedicoVisible(true)}>
          <Text style={styles.selectText}>
            {idMedico
              ? `${medicos.find(m => m.id === idMedico)?.nombre_m} ${medicos.find(m => m.id === idMedico)?.apellido_m} -
                ${getEspecialidad (medicos.find((m) => String(m.id) === String(idMedico))?.id_especialidades)}`
              : "Selecciona un médico"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9b59b6" />
        </TouchableOpacity>

        {/* Consultorio */}
        <Text style={styles.label}>Consultorio</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalConsultorioVisible(true)}>
          <Text style={styles.selectText}>
            {idConsultorio ? `Consultorio ${consultorios.find(c => c.id === idConsultorio)?.numero}` : "Selecciona un consultorio"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#9b59b6" />
        </TouchableOpacity>

        {/* Fecha */}
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fecha ? "#333" : "#aaa" }}>{fecha || "Selecciona una fecha"}</Text>
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
        <TouchableOpacity style={styles.input} onPress={() => setshowtimepicker(true)}>
          <Text style={{color: hora ? "#333" : "#aaa"}}>{hora || "Selecciona una hora"}</Text>
        </TouchableOpacity>
        {showtimepicker && (
          <DateTimePicker
            value={timevalue}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handletimechange}
          />
        )}

        {/* Motivo */}
        <Text style={styles.label}>Motivo</Text>
        <TextInput
          style={styles.input}
          placeholder="Motivo de la cita"
          value={motivo}
          onChangeText={setMotivo}
        />

        {/* Estado */}
        <Text style={styles.label}>Estado</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => setModalEstadoVisible(true)}>
          <Text style={styles.selectText}>{estado}</Text>
          <Ionicons name="chevron-down" size={20} color="#9b59b6" />
        </TouchableOpacity>

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Cita</Text>
        </TouchableOpacity>

      </View>
        {/* Modales */}
        <Modal
          transparent
          visible={modalPacienteVisible}
          animationType="fade"
          onRequestClose={() => setModalPacienteVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={pacientes}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      setIdPaciente(item.id);
                      setModalPacienteVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>
                      {item.nombre} {item.apellido}
                    </Text>
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
                    <Text style={styles.optionText}>{item.nombre_m} {item.apellido_m} - {getEspecialidad(item.id_especialidades)}</Text>
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
    flex: 1,
    backgroundColor: "#f3e9f7",
    padding: 20,   // quitamos justifyContent aquí para que no bloquee scroll
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 20, width: "80%" },
  option: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  optionText: { fontSize: 16, color: "#5e0066" },
})
