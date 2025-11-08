import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "admin", // Rol fijo: administrador
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Administrador registrado correctamente 💜");
        navigation.navigate("InicioMenu");
      } else {
        console.log("Errores:", data);
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Hubo un problema con la conexión al servidor");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>💜 Registro de Administrador</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#9c88baff"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#9c88baff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#9c88baff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar Administrador</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#ede7f6",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#faf5ff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#6a5c93",
  },
  input: {
    borderWidth: 1,
    borderColor: "#c5b8e0",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 16,
    color: "#4b3b73",
  },
  button: {
    backgroundColor: "#a68cb0",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 15,
    alignItems: "center",
  },
  secondaryText: {
    color: "#6a5c93",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
