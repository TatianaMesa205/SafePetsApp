import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function InfoPaciente() {
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);

  // 🌙 Cargar preferencia de modo oscuro
  useEffect(() => {
    const cargarModoOscuro = async () => {
      const modo = await AsyncStorage.getItem("modo_oscuro");
      setModoOscuro(modo === "true");
    };
    cargarModoOscuro();
  }, []);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        if (!email) {
          Alert.alert("Error", "No se encontró el email en la sesión.");
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No se encontró el token de sesión.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/pacientePorEmail/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPaciente(data.paciente);
        } else {
          Alert.alert("Atención", data.message || "No se encontró información del paciente.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Hubo un problema al cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, []);

  // 🎨 Temas
  const theme = modoOscuro ? darkTheme : lightTheme;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.primary }]}>
          Cargando información del paciente...
        </Text>
      </View>
    );
  }

  if (!paciente) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={50} color={theme.accent} />
        <Text style={[styles.errorText, { color: theme.accent }]}>
          No se encontró información del paciente.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <Ionicons name="person-circle-outline" size={100} color={theme.headerIcon} />
        <Text style={[styles.name, { color: theme.headerText }]}>{paciente.nombre}</Text>
        <Text style={[styles.subText, { color: theme.headerSub }]}>Paciente registrado</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.cardTitle, { color: theme.primary }]}>
          📋 Información del Paciente
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.label }]}>Nombre completo</Text>
          <Text style={[styles.value, { color: theme.value }]}>
            {paciente.nombre} {paciente.apellido}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.label }]}>Correo electrónico</Text>
          <Text style={[styles.value, { color: theme.value }]}>{paciente.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.label }]}>Teléfono</Text>
          <Text style={[styles.value, { color: theme.value }]}>
            {paciente.telefono || "No registrado"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.label }]}>Dirección</Text>
          <Text style={[styles.value, { color: theme.value }]}>
            {paciente.direccion || "No disponible"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.label }]}>Fecha de registro</Text>
          <Text style={[styles.value, { color: theme.value }]}>
            {paciente.created_at
              ? new Date(paciente.created_at).toLocaleDateString("es-CO")
              : "No disponible"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
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
  subText: { fontSize: 14, marginTop: 5 },
  card: {
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  label: { fontSize: 14 },
  value: { fontSize: 16, fontWeight: "600" },
});

// 🎨 Temas
const lightTheme = {
  background: "#f6edff",
  headerBg: "#b39ddb",
  headerIcon: "#fff",
  headerText: "#fff",
  headerSub: "#ede7f6",
  cardBg: "#fff",
  primary: "#6f42c1",
  label: "#6c757d",
  value: "#212529",
  accent: "#b55b7d",
};

const darkTheme = {
  background: "#1e1b26",
  headerBg: "#3b3054",
  headerIcon: "#bba4f9",
  headerText: "#eae1ff",
  headerSub: "#cfc4f0",
  cardBg: "#2c2835",
  primary: "#bba4f9",
  label: "#aaa0c0",
  value: "#f3eaff",
  accent: "#d37fa2",
};
