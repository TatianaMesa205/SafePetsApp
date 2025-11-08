import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function CrearCitaP({ route, navigation }) {
  const { idPaciente } = route.params;

  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [idMedico, setIdMedico] = useState("");
  const [idConsultorio, setIdConsultorio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showMedicos, setShowMedicos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const [medRes, conRes, espRes] = await Promise.all([
          fetch(`${API_BASE_URL}/listarMedicos`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/listarConsultorios`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/listarEspecialidades`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
        ]);

        const [medJson, conJson, espJson] = await Promise.all([
          medRes.json(),
          conRes.json(),
          espRes.json(),
        ]);

        setMedicos(Array.isArray(medJson) ? medJson : []);
        setEspecialidades(Array.isArray(espJson) ? espJson : []);

        if (Array.isArray(conJson) && conJson.length > 0) {
          setConsultorios(conJson);
          const randomConsultorio =
            conJson[Math.floor(Math.random() * conJson.length)];
          setIdConsultorio(randomConsultorio.id);
        } else {
          setConsultorios([]);
        }

        setEstado("pendiente");
      } catch (e) {
        console.error("Error cargando datos:", e);
        Alert.alert("Error", "No se pudieron cargar médicos o consultorios");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getEspecialidad = (idEsp) => {
    const esp = especialidades.find((e) => String(e.id) === String(idEsp));
    return esp ? esp.nombre || esp.nombre_e || "Sin especialidad" : "Sin especialidad";
  };

  const handleCrear = async () => {
    if (!idMedico || !idConsultorio || !fecha || !hora) {
      Alert.alert("⚠️ Completa todos los campos");
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem("token");

      let email = await AsyncStorage.getItem("email");
      if (!email) {
        try {
          const meRes = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          if (meRes.ok) {
            const meJson = await meRes.json();
            if (meJson?.email) {
              email = meJson.email;
              await AsyncStorage.setItem("email", email);
            }
          }
        } catch (err) {
          console.warn("No se pudo obtener /me para el email:", err);
        }
      }

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
          email,
        }),
      });

      const body = await response.json();
      if (response.ok) {
        Alert.alert("✅ Cita creada correctamente");
        navigation.navigate("ListarMisCitas");
      } else {
        Alert.alert("Error", body.message || "Error creando cita");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hh = String(selectedTime.getHours()).padStart(2, "0");
      const mm = String(selectedTime.getMinutes()).padStart(2, "0");
      setHora(`${hh}:${mm}`);
    }
  };

  const timeValue = hora
    ? (() => {
        const [h, m] = hora.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      })()
    : new Date();

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#9b59b6" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={80} // 👈 más espacio para que no tape el teclado
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>📅 Nueva Cita</Text>

        {/* Médico */}
        <Text style={styles.label}>Selecciona un médico</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => setShowMedicos(true)}
        >
          <Text style={{ color: idMedico ? "#333" : "#aaa", flex: 1 }}>
            {idMedico
              ? `${medicos.find((m) => String(m.id) === String(idMedico))?.nombre_m || ""} ${
                  medicos.find((m) => String(m.id) === String(idMedico))?.apellido_m || ""
                } - ${getEspecialidad(
                  medicos.find((m) => String(m.id) === String(idMedico))?.id_especialidades
                )}`
              : "Elige un médico"}
          </Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        {/* Modal lista médicos */}
        <Modal visible={showMedicos} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Elige un médico</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {medicos.length === 0 && <Text>No hay médicos disponibles.</Text>}
                {medicos.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.option}
                    onPress={() => {
                      setIdMedico(m.id);
                      setShowMedicos(false);
                    }}
                  >
                    <Text>
                      {m.nombre_m} {m.apellido_m} -{" "}
                      {getEspecialidad(m.id_especialidades)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowMedicos(false)}
              >
                <Text style={{ color: "#fff" }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Consultorio aleatorio */}
        <Text style={styles.label}>Consultorio asignado</Text>
        <View style={styles.input}>
          <Text style={{ color: "#333" }}>
            {idConsultorio
              ? `Consultorio ${
                  consultorios.find((c) => String(c.id) === String(idConsultorio))?.numero || ""
                }`
              : "No hay consultorios disponibles"}
          </Text>
        </View>

        {/* Fecha */}
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: fecha ? "#333" : "#aaa" }}>
            {fecha || "Selecciona una fecha"}
          </Text>
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
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: hora ? "#333" : "#aaa" }}>
            {hora || "Selecciona una hora"}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={timeValue}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
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
        <View style={styles.selectButton}>
          <Text style={styles.selectText}>{estado}</Text>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[styles.button, submitting && { opacity: 0.7 }]}
          onPress={handleCrear}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Creando..." : "Crear Cita"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3e9f7",
    padding: 20,
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
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#444" },
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
  inputRow: {
    borderWidth: 1,
    borderColor: "#d1b3ff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    color: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#a564d3",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#9b59b6" },
  option: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#a564d3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
