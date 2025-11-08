import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import * as Notifications from "expo-notifications"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function DetalleCitaP({ route, navigation }) {
  const { cita } = route.params

  const programarNotificacion = async () => {
    // ✅ Validar que la cita esté confirmada antes de continuar
    if ((cita.estado || "").toLowerCase() !== "confirmada") {
      Alert.alert("No se puede programar una notificación si la cita no ha sido confirmada")
      return
    }

    const { status } = await Notifications.getPermissionsAsync()
    const preferencia = await AsyncStorage.getItem("notificaciones_activas")

    if (status !== "granted" || preferencia !== "true") {
      Alert.alert("⚠️ No tienes permisos para recibir notificaciones")
      return
    }

    try {
      // 🔹 Convertir fecha y hora de la cita a un objeto Date
      const [year, month, day] = cita.fecha.split("-").map(Number)
      const [hour, minute] = cita.hora.split(":").map(Number)

      const fechaCita = new Date(year, month - 1, day, hour, minute)
      const fechaNotificacion = new Date(fechaCita.getTime() - 24 * 60 * 60 * 1000) // 1 día antes

      // Si la fecha de notificación ya pasó
      if (fechaNotificacion < new Date()) {
        Alert.alert("⚠️ La cita es muy pronto, no se puede programar la notificación un día antes.")
        return
      }

      // 🔹 Formatear fecha y hora de la cita para mostrar en el mensaje
      const opcionesFecha = { year: "numeric", month: "long", day: "numeric" }
      const fechaFormateada = fechaCita.toLocaleDateString("es-ES", opcionesFecha)
      const horaFormateada = fechaCita.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Recordatorio de cita médica",
          body: `Tienes una cita mañana, el ${fechaFormateada} a las ${horaFormateada}. No olvides asistir.`,
        },
        trigger: fechaNotificacion,
      })

      Alert.alert("✅ Notificación programada un día antes de la cita a la misma hora.")
    } catch (error) {
      console.error(error)
      Alert.alert("❌ Error al programar la notificación")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Detalle de la Cita</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Fecha: {cita.fecha}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Hora: {cita.hora}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>
            Médico: {cita.medico ? `${cita.medico.nombre_m} ${cita.medico.apellido_m}` : "No asignado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="business-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>
            Consultorio: {cita.consultorio ? cita.consultorio.numero : "No asignado"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#0097A7" />
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 6 }}>
            <Text style={styles.info}>Estado:</Text>
            <View
              style={[
                styles.estadoBadge,
                (cita.estado || "pendiente") === "pendiente"
                  ? { backgroundColor: "#fff4b3" }
                  : (cita.estado || "pendiente") === "confirmada"
                  ? { backgroundColor: "#c6f6d5" }
                  : { backgroundColor: "#feb2b2" },
              ]}
            >
              <Text style={styles.estadoText}>{(cita.estado || "pendiente").toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="document-text-outline" size={24} color="#0097A7" />
          <Text style={styles.info}>Motivo: {cita.motivo || "No especificado"}</Text>
        </View>
      </View>

      {/* Botón para programar notificación */}
      <TouchableOpacity style={styles.notifyButton} onPress={programarNotificacion}>
        <Ionicons name="notifications-outline" size={20} color="#fff" />
        <Text style={styles.notifyText}>Programar notificación un día antes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F7FA", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#006064" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  info: { fontSize: 16, marginLeft: 10, color: "#004D40" },
  notifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9b80be",
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 10,
  },
  notifyText: { color: "white", fontSize: 15, fontWeight: "600", marginLeft: 8 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0097A7",
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    marginTop: 12,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  estadoBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginLeft: 6,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
})
