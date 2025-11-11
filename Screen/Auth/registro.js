import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const handleRegister = async () => {
    if (!nombreUsuario || !email || !contrasena || !confirmarContrasena) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos");
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert("🔒 Contraseña inválida", "Debe tener mínimo 6 caracteres");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert("❌ Error", "Las contraseñas no coinciden");
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
          nombre_usuario: nombreUsuario,
          email: email,
          password: contrasena, // el backend la convierte con Hash::make()
          id_roles: 2, // Rol por defecto
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Éxito", "Usuario registrado correctamente 💜");
        navigation.navigate("Login");
      } else {
        console.log("❌ Errores:", data);
        Alert.alert("❌ Error", data.message || "No se pudo registrar el usuario");
      }
    } catch (error) {
      console.error("🚨 Error en el registro:", error);
      Alert.alert("🚨 Error", "Hubo un problema con la conexión al servidor");
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
            <View style={styles.card}>
              {/* Encabezado */}
              <View style={styles.cardHeader}>
                <Ionicons name="paw" size={40} color="#fff" />
                <Text style={styles.headerTitle}>Crea tu cuenta</Text>
                <Text style={styles.headerSubtitle}>
                  Únete a Safe Pets y comienza tu experiencia
                </Text>
              </View>

              {/* Cuerpo del formulario */}
              <View style={styles.cardBody}>
                {/* Nombre de usuario */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#8b7355"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="#bfa48b"
                    value={nombreUsuario}
                    onChangeText={setNombreUsuario}
                  />
                </View>

                {/* Correo */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color="#8b7355"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#bfa48b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Contraseña */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#8b7355"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#bfa48b"
                    secureTextEntry
                    value={contrasena}
                    onChangeText={setContrasena}
                  />
                </View>

                {/* Confirmar Contraseña */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#8b7355"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#bfa48b"
                    secureTextEntry
                    value={confirmarContrasena}
                    onChangeText={setConfirmarContrasena}
                  />
                </View>

                {/* Botón de registro */}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>

                {/* Enlaces */}
                <View style={styles.linksContainer}>
                  <Text style={styles.versionText}>
                    <Ionicons name="heart" size={14} color="#c4a484" /> Safe Pets
                    v1.0.0 - 2025 ©
                  </Text>

                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.linkText}>
                      ¿Ya tienes una cuenta?{" "}
                      <Text style={styles.linkHighlight}>Inicia sesión</Text>
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
    textAlign: "center",
    paddingHorizontal: 10,
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
});
