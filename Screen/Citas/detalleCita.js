import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import API_BASE_URL from "../../Src/Config";

export default function DetalleCita({ route, navigation }) {
  const { cita } = route.params;
  const [loading, setLoading] = useState(false);

  // 👉 Extraer fecha y hora
  const fecha = cita.fecha_cita?.split(" ")[0];
  const hora = cita.fecha_cita?.split(" ")[1]?.substring(0, 5);

  // 👉 Validar si se puede cancelar (mínimo 2 días antes)
  const puedeCancelar = () => {
    const fechaCita = new Date(cita.fecha_cita);
    const hoy = new Date();
    const diferencia = fechaCita - hoy;
    const dias = diferencia / (1000 * 60 * 60 * 24);
    return dias >= 2;
  };

  // -------------------------------------------------------------
  // 🔔 PROGRAMAR NOTIFICACIÓN UN DÍA ANTES A LA MISMA HORA
  // -------------------------------------------------------------
  const programarNotificacion = async () => {
    if ((cita.estado || "").toLowerCase() !== "confirmada") {
      Alert.alert("Solo puedes programar recordatorios para citas CONFIRMADAS.");
      return;
    }

    const permisos = await Notifications.getPermissionsAsync();
    const preferencia = await AsyncStorage.getItem("notificaciones_activas");

    if (permisos.status !== "granted" || preferencia !== "true") {
      Alert.alert("⚠️ No tienes permisos para recibir notificaciones.");
      return;
    }

    try {
      const [year, month, day] = fecha.split("-").map(Number);
      const [hour, minute] = hora.split(":").map(Number);

      const fechaCita = new Date(year, month - 1, day, hour, minute);
      const fechaNotificacion = new Date(
        fechaCita.getTime() - 24 * 60 * 60 * 1000
      );

      if (fechaNotificacion < new Date()) {
        Alert.alert(
          "⚠️ La cita es muy pronto para programar recordatorio un día antes."
        );
        return;
      }

      const fechaStr = fechaCita.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const horaStr = fechaCita.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Recordatorio de cita veterinaria",
          body: `Mañana tienes una cita para ${cita.mascota?.nombre}. (${fechaStr} - ${horaStr})`,
        },
        trigger: fechaNotificacion,
      });

      Alert.alert("✅ Notificación programada con éxito.");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error al programar la notificación.");
    }
  };

  // -------------------------------------------------------------
  // ❌ CANCELAR CITA
  // -------------------------------------------------------------
  const handleCancelar = async () => {
    try {
      if (!puedeCancelar()) {
        Alert.alert(
          "No es posible cancelar",
          "Solo puedes cancelar la cita con mínimo 2 días de anticipación."
        );
        return;
      }

      Alert.alert("Confirmar", "¿Deseas cancelar esta cita?", [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              setLoading(true);

              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert("Error", "No se encontró token de acceso.");
                setLoading(false);
                return;
              }

              const resp = await fetch(
                `${API_BASE_URL}/citas/${cita.id_citas}/cancelar`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                }
              );

              const json = await resp.json();

              if (!resp.ok) {
                Alert.alert("Error", json.message || "No se pudo cancelar.");
              } else {
                Alert.alert("Éxito", json.message);
                navigation.navigate("HistorialCitas");
              }

              setLoading(false);
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Ocurrió un error al cancelar.");
              setLoading(false);
            }
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    }
  };

  // -------------------------------------------------------------
  // 🎨 COLORES DE ESTADO
  // -------------------------------------------------------------
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Confirmada":
        return "#c6f6d5";
      case "Pendiente":
        return "#fff4b3";
      case "Cancelada":
        return "#feb2b2";
      case "Completada":
        return "#a0d8ff";
      default:
        return "#e0e0e0";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🐾 Detalle de la Cita</Text>

      <View style={styles.card}>
        {/* Mascota */}
        <View style={styles.row}>
          <Ionicons name="paw-outline" size={24} color="#6d4c41" />
          <Text style={styles.info}>Mascota: {cita.mascota?.nombre}</Text>
        </View>

        {/* Fecha */}
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={24} color="#6d4c41" />
          <Text style={styles.info}>Fecha: {fecha}</Text>
        </View>

        {/* Hora */}
        <View style={styles.row}>
          <Ionicons name="time-outline" size={24} color="#6d4c41" />
          <Text style={styles.info}>Hora: {hora}</Text>
        </View>

        {/* Estado */}
        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#6d4c41" />
          <Text style={styles.info}>Estado: </Text>

          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: getEstadoColor(cita.estado) },
            ]}
          >
            <Text style={styles.estadoText}>{cita.estado}</Text>
          </View>
        </View>

        {/* Motivo */}
        {cita.motivo ? (
          <View style={styles.row}>
            <Ionicons name="document-text-outline" size={24} color="#6d4c41" />
            <Text style={styles.info}>Motivo: {cita.motivo}</Text>
          </View>
        ) : null}
      </View>

      {/* 🔔 BOTÓN DE NOTIFICACIÓN SOLO SI ESTÁ CONFIRMADA */}
      {cita.estado === "Confirmada" && (
        <TouchableOpacity style={styles.notifBtn} onPress={programarNotificacion}>
          <Ionicons name="notifications-outline" size={20} color="white" />
          <Text style={styles.notifText}>Recordarme un día antes</Text>
        </TouchableOpacity>
      )}

      {/* ❌ CANCELAR CITA */}
      {(cita.estado === "Pendiente" || cita.estado === "Confirmada") && (
        <TouchableOpacity
          style={[styles.cancelBtn, loading && { opacity: 0.5 }]}
          disabled={loading}
          onPress={handleCancelar}
        >
          <Text style={styles.cancelText}>
            {loading ? "Cancelando..." : "Cancelar cita"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: "#f7f1e3",
    flex: 1,
  },
  title: {
    fontSize: 26,
    color: "#5e4634",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  info: {
    fontSize: 18,
    marginLeft: 10,
    color: "#4b3a2e",
    fontWeight: "600",
  },
  estadoBadge: {
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  estadoText: {
    fontWeight: "bold",
    color: "#333",
  },
  notifBtn: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#9b80be",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  notifText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelBtn: {
    backgroundColor: "#c0504d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
