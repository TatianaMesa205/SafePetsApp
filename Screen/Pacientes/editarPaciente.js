import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import API_BASE_URL from "../../Src/Config";

export default function EditarPaciente({ route, navigation }) {
  const { paciente } = route.params;
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre);
      setApellido(paciente.apellido);
      setDocumento(paciente.documento);
      setTelefono(paciente.telefono);
      setEmail(paciente.email);
      setFechaNacimiento(paciente.fecha_nacimiento);
      setDireccion(paciente.direccion);
    }
  }, [paciente]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0];
      setFechaNacimiento(isoDate);
    }
  };

  const handleEditar = async () => {
    if (!nombre || !apellido || !documento || !telefono || !email || !fechaNacimiento || !direccion) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/actualizarPacientes/${paciente.id}`, {
        method: "PUT",
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

      if (response.ok) {
        Alert.alert("✅ Éxito", "Paciente editado correctamente");
        navigation.navigate("ListarPacientes", { reload: true });
      } else {
        const errorData = await response.json();
        console.log("❌ Error en backend:", errorData);
        Alert.alert("❌ Error", "No se pudo editar el paciente");
      }
    } catch (error) {
      console.error("🚨 Error de conexión:", error);
      Alert.alert("🚨 Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      extraScrollHeight={100}   // 🔹 mueve más arriba al abrir teclado
      enableOnAndroid={true}
    >
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Editar Paciente</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#b0b0b0"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor="#b0b0b0"
          value={apellido}
          onChangeText={setApellido}
        />

        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
          placeholder="Documento"
          placeholderTextColor="#b0b0b0"
          value={documento}
          onChangeText={setDocumento}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#b0b0b0"
          value={telefono}
          onChangeText={setTelefono}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b0b0b0"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fechaNacimiento ? "#333" : "#b0b0b0" }}>
            {fechaNacimiento || "Seleccione fecha de nacimiento"}
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
          placeholder="Dirección"
          placeholderTextColor="#b0b0b0"
          value={direccion}
          onChangeText={setDireccion}
        />

        <TouchableOpacity style={styles.button} onPress={handleEditar}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f0e6", // beige
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
});
