import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function CrearPaciente({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

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

      if (role !== "admin") {
        Alert.alert("Permisos insuficientes", "Solo usuarios con rol 'admin' pueden crear pacientes");
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
          email,
          fecha_nacimiento: fechaNacimiento,
          direccion,
        }),
      });

      const status = response.status;
      let body;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }

      if (response.ok) {
        Alert.alert("✅ Éxito", body?.message || "Paciente creado correctamente");
        navigation.navigate("ListarPacientes");
        return;
      }

      if (status === 401) {
        Alert.alert("No autorizado", "Token inválido o expirado. Inicia sesión nuevamente.");
        navigation.navigate("Login");
        return;
      }

      if (status === 403) {
        Alert.alert("Prohibido", body?.message || "No tienes permiso para realizar esta acción.");
        return;
      }

      Alert.alert("Error", body?.message || "No se pudo crear el paciente");
    } catch (error) {
      console.error("🚨 Error de conexión:", error);
      Alert.alert("🚨 Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0];
      setFechaNacimiento(isoDate);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid
      extraScrollHeight={50}
    >
      <View style={styles.card}>
        <Text style={styles.title}>➕ Nuevo Paciente</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan"
          placeholderTextColor="#b0b0b0"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pérez"
          placeholderTextColor="#b0b0b0"
          value={apellido}
          onChangeText={setApellido}
        />

        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12345678"
          placeholderTextColor="#b0b0b0"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3001234567"
          placeholderTextColor="#b0b0b0"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: correo@ejemplo.com"
          placeholderTextColor="#b0b0b0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fechaNacimiento ? "#333" : "#b0b0b0" }}>
            {fechaNacimiento || "📅 Seleccione una fecha"}
          </Text>
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
        <TextInput
          style={styles.input}
          placeholder="Ej: Calle 123 #45-67"
          placeholderTextColor="#b0b0b0"
          value={direccion}
          onChangeText={setDireccion}
        />

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
