import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";
import { useNavigation } from "@react-navigation/native";

export default function SolicitarCita({ route }) {
  const { mascota } = route.params;
  const navigation = useNavigation();

  const [idAdoptante, setIdAdoptante] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [fechaCita, setFechaCita] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [pickerMode, setPickerMode] = useState(null);
  const estado = "Pendiente";

  // OBTENER ID ADOPTANTE
  useEffect(() => {
    const obtenerAdoptante = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const email = await AsyncStorage.getItem("email");

        if (!token || !email) {
          Alert.alert("Error", "Debes iniciar sesión.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/obtenerAdoptante/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        setIdAdoptante(data.id_adoptantes);
      } catch (e) {
        console.log("Error:", e);
        Alert.alert("Error", "No se pudo verificar tu información.");
      } finally {
        setLoading(false);
      }
    };

    obtenerAdoptante();
  }, []);

  // REGISTRAR LA CITA
  const registrarCita = async () => {
    if (!motivo.trim()) {
      Alert.alert("Error", "Debes escribir un motivo.");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    // Formato para Laravel Y-m-d H:i:s
    const fechaFormateada =
      fechaCita.getFullYear() +
      "-" +
      String(fechaCita.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(fechaCita.getDate()).padStart(2, "0") +
      " " +
      String(fechaCita.getHours()).padStart(2, "0") +
      ":" +
      String(fechaCita.getMinutes()).padStart(2, "0") +
      ":00";

    const body = {
      id_adoptantes: idAdoptante,
      id_mascotas: mascota.id_mascotas,
      fecha_cita: fechaFormateada,
      motivo,
      estado: "Pendiente",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/solicitarCita`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Errores backend:", data);
        Alert.alert("Error", "No se pudo registrar la cita. Recuerda completar la fecha y la hora.");
        return;
      }

      Alert.alert(
        "Cita Registrada",
        "Tu cita fue registrada exitosamente y está actualmente en estado 'Pendiente'."
      );

      navigation.navigate("ListarMascotas");
    } catch (e) {
      console.log("Error al registrar la cita:", e);
      Alert.alert("Error", "Hubo un problema al registrar la cita.");
    }
  };

  // UI
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4a7842" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Solicitar Cita</Text>

        <View style={styles.card}>

          {/* FECHA */}
          <TouchableOpacity style={styles.input} onPress={() => setPickerMode("date")}>
            <Text style={styles.inputText}>{fechaCita.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* HORA */}
          <TouchableOpacity style={styles.input} onPress={() => setPickerMode("time")}>
            <Text style={styles.inputText}>
              {fechaCita.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>

          {pickerMode && (
            <DateTimePicker
              value={fechaCita}
              mode={pickerMode}
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (event.type === "dismissed") {
                  setPickerMode(null);
                  return;
                }

                const nuevaFecha = new Date(fechaCita);

                if (pickerMode === "date") {
                  nuevaFecha.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                  );
                } else {
                  nuevaFecha.setHours(
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                  );
                }

                setFechaCita(nuevaFecha);
                setPickerMode(null);
              }}
            />
          )}

          {/* MOTIVO */}
          <TextInput
            style={styles.textarea}
            placeholder="Motivo de la cita"
            placeholderTextColor="#486b48"
            multiline
            onChangeText={setMotivo}
          />

          {/* ESTADO */}
          <View style={styles.input}>
            <Text style={styles.label}>Estado de la cita</Text>
            <Text style={styles.estado}>{estado}</Text>
          </View>

          {/* BOTÓN */}
          <TouchableOpacity style={styles.button} onPress={registrarCita}>
            <Text style={styles.buttonText}>Registrar Cita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    color: "#2f4f2f",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#eef5ec",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: "#c9d7c5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#9fb49b",
  },
  inputText: {
    color: "#2f4f2f",
    fontSize: 16,
  },
  textarea: {
    backgroundColor: "#c9d7c5",
    padding: 14,
    borderRadius: 12,
    minHeight: 120,
    textAlignVertical: "top",
    color: "#2f4f2f",
    borderWidth: 1,
    borderColor: "#9fb49b",
    marginBottom: 15,
  },
  label: {
    color: "#2f4f2f",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  estado: {
    color: "#2f4f2f",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3e5f3e",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

