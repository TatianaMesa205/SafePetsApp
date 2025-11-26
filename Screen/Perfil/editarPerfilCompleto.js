import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from "react-native-vector-icons/Ionicons"
import API_BASE_URL from "../../Src/Config"

export default function EditarPerfilCompleto({ route, navigation }) {
  const { user, adoptante } = route.params

  const [nombreUsuario, setNombreUsuario] = useState(user.nombre)
  const [nombreCompleto, setNombreCompleto] = useState(adoptante.nombre_completo)
  const [cedula, setCedula] = useState(adoptante.cedula)
  const [telefono, setTelefono] = useState(adoptante.telefono)
  const [direccion, setDireccion] = useState(adoptante.direccion)
  const [password, setPassword] = useState("")

  // 💾 Guardar cambios
  const handleGuardar = async () => {
    if (password && password.length < 6) {
      Alert.alert("⚠ Error", "La contraseña debe tener mínimo 6 caracteres")
      return
    }

    try {
      const token = await AsyncStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/actualizarPerfilCompleto`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_usuario: nombreUsuario,
          nombre_completo: nombreCompleto,
          cedula,
          telefono,
          direccion,
          password: password || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        Alert.alert("✔ Éxito", "Datos actualizados correctamente")
        navigation.navigate("PerfilUsuarioP")
      } else {
        Alert.alert("Error", data.message || "No se pudo actualizar el perfil")
      }
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Ocurrió un problema al guardar los datos")
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      enableOnAndroid
      extraScrollHeight={20}
    >


      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Editar Perfil</Text>

        {/* Email */}
        <Text style={styles.label}>Correo electrónico (no editable)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#eee", color: "#777" }]}
          value={user.email}
          editable={false}
        />

        {/* Nombre usuario */}
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          value={nombreUsuario}
          onChangeText={setNombreUsuario}
        />

        {/* Nombre completo */}
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
        />

        {/* Cedula */}
        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
        />

        {/* Teléfono */}
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
        />

        {/* Dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={setDireccion}
        />

        {/* Contraseña */}
        <Text style={styles.label}>Contraseña (opcional)</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Nueva contraseña"
          placeholderTextColor="#b0b0b0"
          value={password}
          onChangeText={setPassword}
        />

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
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
