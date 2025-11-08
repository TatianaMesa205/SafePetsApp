import React, { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../../Src/Config"

export default function EditarPerfil({ navigation }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const getRoleName = (id_roles) => {
    switch (id_roles) {
      case 1:
        return "admin"
      case 2:
        return "adoptante"
      default:
        return "usuario"
    }
  }

  // 🔄 Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const data = await response.json()
        console.log("📥 Respuesta del /me en EditarPerfil:", data)

        if (response.ok && data.success) {
          const usuario = data.usuario
          setUser(usuario)
          setName(usuario.nombre_usuario)
          setEmail(usuario.email)
        } else {
          Alert.alert("Error", "No se pudieron cargar los datos del usuario.")
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // 💾 Actualizar perfil
  const handleEditar = async () => {
    if (!name.trim()) {
      Alert.alert("⚠️ Error", "El nombre es obligatorio")
      return
    }

    if (password && password.length < 8) {
      Alert.alert("⚠️ Error", "La contraseña debe tener al menos 8 caracteres")
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
        nombre_usuario: name,
        password: password ? password : null, // 👈 usa "password"
      }),
    })


      const data = await response.json()
      console.log("📤 Respuesta editarPerfil:", data)

      if (response.ok && data.success) {
        Alert.alert("✅ Éxito", "Perfil actualizado correctamente")
        navigation.navigate("PerfilUsuarioP", { reload: true })
      } else if (data.errors) {
        // 👀 Mostrar errores de validación del backend
        const errores = Object.values(data.errors).flat().join("\n")
        Alert.alert("❌ Error de validación", errores)
      } else {
        Alert.alert("❌ Error", data.message || "No se pudo actualizar el perfil")
      }
    } catch (error) {
      console.error("🚨 Error de conexión:", error)
      Alert.alert("🚨 Error", "Ocurrió un problema al conectar con el servidor")
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b38b59" />
        <Text style={styles.loadingText}>Cargando datos del perfil...</Text>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid
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
          style={[styles.input, { backgroundColor: "#eee", color: "#777" }]}
          placeholder="Correo electrónico"
          placeholderTextColor="#b0b0b0"
          keyboardType="email-address"
          value={email}
          editable={false}
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

        <Text style={styles.label}>Rol</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#eee", color: "#777" }]}
          value={getRoleName(user?.id_roles)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f1e3",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#5e4634",
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
