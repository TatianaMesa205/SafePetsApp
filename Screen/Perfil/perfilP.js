import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from "react-native-vector-icons/Ionicons"
import API_BASE_URL from "../../Src/Config"

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modoOscuro, setModoOscuro] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) return

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        })
        const data = await response.json()
        if (response.ok) setUser(data.user)
      } catch (error) {
        console.error("Error obteniendo usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    const checkTheme = async () => {
      const modo = await AsyncStorage.getItem("modo_oscuro")
      setModoOscuro(modo === "true")
    }

    fetchUser()
    checkTheme()
  }, [])

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        await AsyncStorage.removeItem("token")
        Alert.alert("👋 Hasta pronto", data.message)
        navigation.replace("Login")
      } else Alert.alert("Error", data.message || "No se pudo cerrar sesión")
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Ocurrió un problema al cerrar sesión")
    }
  }

  const handleEditProfile = () => {
    navigation.navigate("EditarPerfilP", { user })
  }

  const theme = modoOscuro ? darkTheme : lightTheme

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.icon} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Cargando tu perfil...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      {user ? (
        <>
          <View style={[styles.header, { backgroundColor: theme.header }]}>
            <Ionicons name="person-circle" size={100} color="#fff" />
            <Text style={[styles.name, { color: theme.headerText }]}>{user.name}</Text>
            <View style={[styles.roleContainer, { backgroundColor: theme.roleBackground }]}>
              <Text style={[styles.role, { color: theme.roleText }]}>{user.role}</Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.title }]}>Información del Usuario</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre</Text>
              <Text style={[styles.value, { color: theme.text }]}>{user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
              <Text style={[styles.value, { color: theme.text }]}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Rol</Text>
              <Text style={[styles.value, { color: theme.text }]}>{user.role}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.button }]} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.logout }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={[styles.errorText, { color: theme.error }]}>No se pudieron cargar los datos.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  header: {
    paddingVertical: 50,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  roleContainer: {
    marginTop: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
  },
  role: { fontSize: 14, fontWeight: "600" },
  card: {
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 30,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  infoRow: { marginBottom: 15 },
  label: { fontSize: 14 },
  value: { fontSize: 16, fontWeight: "600" },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 15,
  },
  editText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 16 },
})

// 🎨 Temas
const lightTheme = {
  background: "#f0f0f5",
  header: "#b2a4dbff",
  headerText: "#fff",
  roleBackground: "#93b6ddff",
  roleText: "#fff",
  card: "#fff",
  title: "#343a40",
  text: "#212529",
  textSecondary: "#6c757d",
  button: "#a387d4",
  logout: "#6a74ceff",
  icon: "#6f42c1",
  error: "#904f4f",
}

const darkTheme = {
  background: "#1e1b26",
  header: "#2c2835",
  headerText: "#e0d7f8",
  roleBackground: "#4a3b6f",
  roleText: "#fff",
  card: "#2c2835",
  title: "#cbb7ff",
  text: "#f4eefe",
  textSecondary: "#bdaed9",
  button: "#6f42c1",
  logout: "#a34766",
  icon: "#bba4f9",
  error: "#ffb3c1",
}
