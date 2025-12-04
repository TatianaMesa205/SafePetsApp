import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function Login({ navigation }) {
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [identificador, setIdentificador] = useState("");

  const handleLogin = async () => {
    if (!identificador || !contrasena) {
      Alert.alert("Atención", "Por favor ingresa los datos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          identificador: identificador,
          password: contrasena,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem("token", data.access_token);
        await AsyncStorage.setItem("role", data.rol);
        await AsyncStorage.setItem("email", data.usuario.email);

        Alert.alert("Bienvenido", data.message);

        if (data.rol === "adoptante") {
          navigation.navigate("InicioP");
        } else if (data.rol === "admin") {
          navigation.navigate("Inicio");
        } else {
          Alert.alert("Error", "Rol no reconocido");
        }
      } else {
        Alert.alert("Error", data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gradientBackground}>
          <View style={styles.container}>
            {/* Tarjeta principal */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="paw" size={40} color="#fff" />
                <Text style={styles.headerTitle}>Safe Pets</Text>
                <Text style={styles.headerSubtitle}>
                  Fundación de Adopción de Animales
                </Text>
              </View>

              <View style={styles.cardBody}>
                {/* Campo de usuario */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#8b7355"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email o nombre de usuario"
                    placeholderTextColor="#bfa48b"
                    value={identificador}
                    onChangeText={setIdentificador}
                    autoCapitalize="none"
                  />
                </View>

                {/* Campo de contraseña */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#8b7355"
                    style={styles.icon}
                  />

                  <TextInput
                    style={[styles.input, { paddingRight: 40 }]}
                    placeholder="Contraseña"
                    placeholderTextColor="#bfa48b"
                    secureTextEntry={!mostrarContrasena}
                    value={contrasena}
                    onChangeText={setContrasena}
                  />

                  <TouchableOpacity
                    onPress={() => setMostrarContrasena(!mostrarContrasena)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={mostrarContrasena ? "eye" : "eye-off"}
                      size={22}
                      color="#8b7355"
                    />
                  </TouchableOpacity>
                </View>


                {/* Botón de inicio */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                {/* Enlaces */}
                <View style={styles.linksContainer}>
                  <Text style={styles.versionText}>
                    <Ionicons name="heart" size={14} color="#c4a484" /> Safe Pets
                    v1.0.0 - 2025 ©
                  </Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Registro")}
                  >
                    <Text style={styles.linkText}>
                      ¿No estás registrado?{" "}
                      <Text style={styles.linkHighlight}>Crear cuenta</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#efd2b7ff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  container: {
    width: "85%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#bfa48b",
    alignItems: "center",
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "800",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  cardBody: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e6e2dd",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#5c4b3b",
  },
  button: {
    backgroundColor: "#c4a484",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  linksContainer: {
    alignItems: "center",
    marginTop: 25,
  },
  versionText: {
    color: "#8d7b6b",
    fontSize: 13,
    marginBottom: 10,
  },
  linkText: {
    color: "#7a6f67",
    fontSize: 15,
  },
  linkHighlight: {
    color: "#c4a484",
    fontWeight: "700",
  },
  secondaryLink: {
    color: "#bfa48b",
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: "underline",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    padding: 2,
  }
});
