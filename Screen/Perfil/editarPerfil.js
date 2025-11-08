import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../../Src/Config"

export default function EditarPerfil({ route, navigation }) {
  const { user } = route.params

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")

  const handleEditar = async () => {
    if (!name || !email) {
      Alert.alert("⚠️ Error", "Por favor completa los campos obligatorios")
      return
    }

    try {
      const token = await AsyncStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/editarPerfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password: password ? password : undefined,
          password_confirmation: passwordConfirmation ? passwordConfirmation : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        Alert.alert("✅ Éxito", "Perfil actualizado correctamente")
        navigation.navigate("PerfilUsuario", { reload: true })
      } else {
        console.log("❌ Error backend:", data)
        Alert.alert("❌ Error", data.message || "No se pudo actualizar el perfil")
      }
    } catch (error) {
      console.error("🚨 Error de conexión:", error)
      Alert.alert("🚨 Error", "Ocurrió un problema al conectar con el servidor")
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Editar Perfil</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#b0b0b0"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#b0b0b0"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor="#b0b0b0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#b0b0b0"
          secureTextEntry
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />

        <Text style={styles.label}>Rol</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#eee", color: "#777" }]}
          value={user?.role || ""}
          editable={false}
        />

        <TouchableOpacity style={styles.button} onPress={handleEditar}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
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
})
