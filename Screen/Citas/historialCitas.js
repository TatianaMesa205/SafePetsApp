import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function HistorialCitas({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCitas = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const email = await AsyncStorage.getItem("email");
      if (!email) {
        Alert.alert("Error", "No se encontró el correo del adoptante.");
        setLoading(false);
        return;
      }

      const resp = await fetch(`${API_BASE_URL}/historialCitasPorEmail/${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (resp.status === 404) {
        Alert.alert("Info", "No existe un adoptante con este email o no tiene citas.");
        setCitas([]);
        setLoading(false);
        return;
      }

      if (!resp.ok) {
        console.error("hist por email status:", resp.status);
        Alert.alert("Error", "No se pudo cargar el historial de citas.");
        setLoading(false);
        return;
      }

      const data = await resp.json();
      setCitas(data.citas || []);
    } catch (error) {
      console.error("Error hist por email:", error);
      Alert.alert("Error", "No se pudo obtener el historial de citas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Confirmada": return "#B7D9A8";
      case "Pendiente": return "#F6E8A6";
      case "Cancelada": return "#E7A6A6";
      case "Completada": return "#A6C8E7";
      default: return "#E0E0E0";
    }
  };

  // 👉 Filtrar citas según estado
  const citasProceso = citas.filter(c => c.estado === "Pendiente" || c.estado === "Confirmada");
  const citasPasadas = citas.filter(c => c.estado === "Cancelada" || c.estado === "Completada");

  const renderCita = (cita) => (
    <TouchableOpacity
      key={cita.id_citas}
      style={styles.card}
      onPress={() => navigation.navigate("DetalleCita", { cita })}
    >
      <View style={styles.row}>
        <Ionicons name="paw-outline" size={22} color="#5e4634" />
        <Text style={styles.mascota}>{cita.mascota?.nombre || "Mascota sin nombre"}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={18} color="#6B6B6B" />
        <Text style={styles.text}>{cita.fecha_cita?.split(" ")[0]}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={18} color="#6B6B6B" />
        <Text style={styles.text}>
          {cita.fecha_cita?.split(" ")[1]?.substring(0, 5)}
        </Text>
      </View>

      <View style={[styles.estado, { backgroundColor: getEstadoColor(cita.estado) }]}>
        <Text style={styles.estadoText}>{cita.estado}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historial de Citas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8b6b4b" />
      ) : (
        <>
          {/* 📌 Citas en proceso */}
          <Text style={styles.sectionTitle}>Citas en proceso</Text>
          {citasProceso.length === 0 ? (
            <Text style={styles.noCitas}>No tienes citas pendientes o confirmadas.</Text>
          ) : (
            citasProceso.map(renderCita)
          )}

          {/* 📌 Citas pasadas */}
          <Text style={styles.sectionTitle}>Citas pasadas</Text>
          {citasPasadas.length === 0 ? (
            <Text style={styles.noCitas}>No tienes citas completadas o canceladas.</Text>
          ) : (
            citasPasadas.map(renderCita)
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f7f1e3", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#5e4634", textAlign: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#4b3a2e", marginTop: 20, marginBottom: 10 },
  noCitas: { textAlign: "center", fontSize: 15, color: "#6b5a4a", marginBottom: 10 },
  card: { backgroundColor: "#fffaf2", padding: 18, borderRadius: 15, marginBottom: 15, elevation: 3 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  mascota: { marginLeft: 10, fontWeight: "bold", color: "#4b3a2e", fontSize: 17 },
  text: { marginLeft: 8, color: "#4b3a2e" },
  estado: { marginTop: 10, paddingVertical: 6, borderRadius: 12, alignItems: "center" },
  estadoText: { fontWeight: "bold", color: "#333" },
});
