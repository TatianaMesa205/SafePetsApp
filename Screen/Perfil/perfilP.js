import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Ionicons from "react-native-vector-icons/Ionicons"
import * as Notifications from "expo-notifications"
import API_BASE_URL from "../../Src/Config"

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adoptante, setAdoptante] = useState(null)

  // 🔔 Estado de notificaciones
  const [notificacionesActivas, setNotificacionesActivas] = useState(false)
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(true)

  useEffect(() => {
    fetchUser()
    checkNotificationStatus()
  }, [])

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

      if (response.ok && data.success) {

        const usuarioData = {
          nombre: data.usuario.nombre_usuario,
          email: data.usuario.email,
          rol: data.rol,
        }

        setUser(usuarioData)

        // 🔍 VALIDAR SI TIENE REGISTRO EN ADOPTANTES (NUEVO ENDPOINT)
        const adoptanteResponse = await fetch(
          `${API_BASE_URL}/adoptanteInfo/${usuarioData.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )

        const adoptanteJson = await adoptanteResponse.json()

        if (adoptanteJson.success) {
          setAdoptante(adoptanteJson.adoptante)
        } else {
          setAdoptante(null)
        }

      } else {
        Alert.alert("Error", "No se pudieron cargar los datos del usuario.")
      }
    } catch (error) {
      console.error("Error obteniendo usuario:", error)
    } finally {
      setLoading(false)
    }
  }



  // 🔔 Verificar permisos y preferencia guardada
  const checkNotificationStatus = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync()
      const preferencia = await AsyncStorage.getItem("notificaciones_activas")

      setNotificacionesActivas(status === "granted" && preferencia === "true")
    } catch (e) {
      console.log("Error verificando notificaciones:", e)
    } finally {
      setCargandoNotificaciones(false)
    }
  }

  // 🔄 Alternar notificaciones desde la campana
  const toggleNotificaciones = async () => {
    if (!notificacionesActivas) {
      // Activar
      const { status } = await Notifications.requestPermissionsAsync()
      if (status === "granted") {
        await AsyncStorage.setItem("notificaciones_activas", "true")
        setNotificacionesActivas(true)
        Alert.alert("🔔 Notificaciones activadas", "Recibirás avisos importantes.")
      } else {
        Alert.alert("🚫 No se concedieron permisos", "No podremos enviarte notificaciones.")
      }
    } else {
      // Desactivar
      await AsyncStorage.setItem("notificaciones_activas", "false")
      setNotificacionesActivas(false)
      Alert.alert("🔕 Notificaciones desactivadas", "Ya no recibirás alertas.")
    }
  }

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (response.ok) {
        await AsyncStorage.removeItem("token")
        Alert.alert("👋 Hasta pronto", data.message)
        navigation.replace("Login")
      } else {
        Alert.alert("Error", data.message || "No se pudo cerrar sesión")
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Ocurrió un problema al cerrar sesión")
    }
  }

  const handleEditProfile = () => {
    if (adoptante) {
      navigation.navigate("EditarPerfilCompleto", { user, adoptante })
    } else {
      navigation.navigate("EditarPerfilP", { user })
    }
  }


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b38b59" />
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>


      {user ? (
        <>
          <View style={styles.header}>

            {/* Campana en la esquina superior derecha */}
            <View style={styles.notificationIconContainer}>
              {cargandoNotificaciones ? (
                <ActivityIndicator size="small" color="#5e4634" />
              ) : (
                <TouchableOpacity onPress={toggleNotificaciones}>
                  <Ionicons
                    name={notificacionesActivas ? "notifications" : "notifications-off-outline"}
                    size={32}
                    color="#5e4634"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Avatar centrado */}
            <View style={{ alignItems: "center" }}>
              <Ionicons name="person-circle-outline" size={110} color="#5e4634" />
              <Text style={styles.name}>{user.nombre}</Text>

              <View style={styles.roleContainer}>
                <Text style={styles.role}>{user.rol.toUpperCase()}</Text>
              </View>
            </View>

          </View>


          {/* Tarjeta de información */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos de inicio de sesion</Text>

            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#8b6b4b" />
              <View style={styles.infoText}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <Text style={styles.value}>{user.nombre}</Text>
              </View>
            </View>

            <View className="infoRow">
              <View className="infoText"></View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#8b6b4b" />
              <View style={styles.infoText}>
                <Text style={styles.label}>Correo</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="shield-outline" size={20} color="#8b6b4b" />
              <View style={styles.infoText}>
                <Text style={styles.label}>Rol</Text>
                <Text style={styles.value}>{user.rol}</Text>
              </View>
            </View>
          </View>

          {/* Tarjeta DATOS DE ADOPTANTE (solo si existe) */}
          {adoptante && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Datos de Adoptante</Text>

              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#8b6b4b" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <Text style={styles.value}>{adoptante.nombre_completo}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="id-card-outline" size={20} color="#8b6b4b" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Cédula</Text>
                  <Text style={styles.value}>{adoptante.cedula}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#8b6b4b" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Teléfono</Text>
                  <Text style={styles.value}>{adoptante.telefono}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="home-outline" size={20} color="#8b6b4b" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Dirección</Text>
                  <Text style={styles.value}>{adoptante.direccion}</Text>
                </View>
              </View>
            </View>
          )}


          {/* Botones */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: "#8ba27cff" }]}
            onPress={() => navigation.navigate("HistorialCitas")}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.editText}>Historial de citas</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>No se pudieron cargar los datos.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f1e3",
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
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5e4634",
    marginTop: 8,
  },
  roleContainer: {
    marginTop: 10,
    backgroundColor: "#d6bfa2",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },
  role: {
    color: "#5e4634",
    fontWeight: "700",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#fffaf2",
    marginHorizontal: 25,
    padding: 22,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8b6b4b",
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  infoText: {
    marginLeft: 10,
  },
  label: {
    fontSize: 13,
    color: "#9a8566",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b3a2e",
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#c2a490ff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 15,
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#b46d65ff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#8b6b4b",
  },
  header: {
    backgroundColor: "#e8d7bd",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 30,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // <--- Centramos contenido principal
    position: "relative",     // <--- Permite posicionar la campana arriba derecha
  },
  notificationIconContainer: {
    position: "absolute",
    right: 20,   // <--- lo mueve al borde derecho
    top: 20,     // <--- lo sube al borde superior
    zIndex: 10,
  },



})
