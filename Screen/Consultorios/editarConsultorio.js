import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function EditarConsultorio({ route, navigation }) {
  const { id, numeroInicial, ubicacionInicial } = route.params;
  const [numero, setNumero] = useState(numeroInicial || "");
  const [ubicacion, setUbicacion] = useState(ubicacionInicial || "");

  const handleEditar = async () => {
    if (!numero || !ubicacion) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/actualizarConsultorios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ numero, ubicacion }),
      });

      if (response.ok) {
        Alert.alert("✅ Éxito", "Consultorio editado correctamente");
        navigation.navigate("ListarConsultorios", { reload: true });
      } else {
        const errorData = await response.json();
        console.log("❌ Error en backend:", errorData);
        Alert.alert("❌ Error", "No se pudo editar el consultorio");
      }
    } catch (error) {
      console.error("🚨 Error de conexión:", error);
      Alert.alert("🚨 Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Editar Consultorio</Text>

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          placeholder="Número del consultorio"
          placeholderTextColor="#b0b0b0"
          value={numero}
          onChangeText={setNumero}
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ubicación del consultorio"
          placeholderTextColor="#b0b0b0"
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <TouchableOpacity style={styles.button} onPress={handleEditar}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6", // beige
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
