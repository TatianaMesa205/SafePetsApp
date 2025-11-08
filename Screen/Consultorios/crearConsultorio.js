import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearConsultorio({ navigation }) {
  const [numero, setNumero] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const handleCrear = async () => {
    if (!numero || !ubicacion) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token) {
        Alert.alert("No autenticado", "Debes iniciar sesión para crear consultorios");
        navigation.navigate("Login");
        return;
      }

      if (role !== "admin") {
        Alert.alert("Permisos insuficientes", "Solo usuarios con rol 'admin' pueden crear consultorios");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/crearConsultorios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero,
          ubicacion,
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
        Alert.alert("✅ Éxito", body?.message || "Consultorio creado correctamente");
        navigation.navigate("ListarConsultorios");
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

      Alert.alert("Error", body?.message || "No se pudo crear el consultorio");
    } catch (error) {
      console.error("🚨 Error de conexión:", error);
      Alert.alert("🚨 Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>➕ Nuevo Consultorio</Text>

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 101"
          placeholderTextColor="#b0b0b0"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Piso 2 - Ala B"
          placeholderTextColor="#b0b0b0"
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Consultorio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e9f7", // suave pastel
    justifyContent: "center",
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
