import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API_BASE_URL from "../../Src/Config";

export default function CrearPacienteP({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState(""); // email desde AsyncStorage
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Traer el email guardado en AsyncStorage
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        if (storedEmail) {
          setEmail(storedEmail);
          console.log("📧 Email cargado desde AsyncStorage:", storedEmail);
        }
      } catch (error) {
        console.error("Error al obtener el email:", error);
      }
    };
    fetchEmail();
  }, []);

  const handleCrear = async () => {
    if (!nombre || !apellido || !documento || !telefono || !email || !fechaNacimiento || !direccion) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token) {
        Alert.alert("No autenticado", "Debes iniciar sesión para crear pacientes");
        navigation.navigate("Login");
        return;
      }

      if (role !== "admin" && role !== "paciente") {
        Alert.alert("Permisos insuficientes", "Solo usuarios con rol 'admin' o 'paciente' pueden crear pacientes");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/crearPacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          documento,
          telefono,
          email, // Se envía el email desde AsyncStorage
          fecha_nacimiento: fechaNacimiento,
          direccion,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        Alert.alert("✅ Éxito", body.message || "Paciente creado correctamente");

        if (body.data?.id) {
          await AsyncStorage.setItem("id_paciente", body.data.id.toString());
          console.log("✅ id_paciente guardado:", body.data.id);
        }

        navigation.navigate("ListarMisCitas", { paciente: body.data });
        return;
      }

      Alert.alert("Error", body.message || "No se pudo crear el paciente");

    } catch (error) {
      console.error("🚨 Error de conexión:", error);
      Alert.alert("🚨 Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaNacimiento(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      extraScrollHeight={25}
    >
      <View style={styles.card}>
        <Text style={styles.title}>➕ Formulario citas</Text>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} placeholder="Ej: Juan" value={nombre} onChangeText={setNombre} placeholderTextColor="#b0b0b0"/>
        <Text style={styles.label}>Apellido</Text>
        <TextInput style={styles.input} placeholder="Ej: Pérez" value={apellido} onChangeText={setApellido} placeholderTextColor="#b0b0b0"/>
        <Text style={styles.label}>Documento</Text>
        <TextInput style={styles.input} placeholder="Ej: 12345678" value={documento} onChangeText={setDocumento} keyboardType="numeric" placeholderTextColor="#b0b0b0"/>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} placeholder="Ej: 3001234567" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholderTextColor="#b0b0b0"/>
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fechaNacimiento ? "#333" : "#b0b0b0" }}>{fechaNacimiento || "📅 Seleccione una fecha"}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento ? new Date(fechaNacimiento) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.label}>Dirección</Text>
        <TextInput style={styles.input} placeholder="Ej: Calle 123 #45-67" value={direccion} onChangeText={setDireccion} placeholderTextColor="#b0b0b0"/>
        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Paciente</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e9f7",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    marginVertical: 30,
    marginHorizontal: 10,
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
});
