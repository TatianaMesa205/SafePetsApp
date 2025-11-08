import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function Configuracion({ navigation }) {
  const [permisoNotificaciones, setPermisoNotificaciones] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Verifica permisos y preferencias guardadas
  const checkPermisos = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    const preferencia = await AsyncStorage.getItem("notificaciones_activas");
    const modo = await AsyncStorage.getItem("modo_oscuro");

    setPermisoNotificaciones(status === "granted" && preferencia === "true");
    setModoOscuro(modo === "true");
    setLoading(false);
  };

  useEffect(() => {
    checkPermisos();
  }, []);

  // ✅ Activa o desactiva las notificaciones
  const toggleNotificaciones = async (valor) => {
    if (valor) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        await AsyncStorage.setItem("notificaciones_activas", "true");
        setPermisoNotificaciones(true);
        Alert.alert("✅ Notificaciones activadas", "Recibirás avisos importantes.");
      } else {
        Alert.alert("🚫 Permiso denegado", "No se concedieron permisos de notificación.");
      }
    } else {
      await AsyncStorage.setItem("notificaciones_activas", "false");
      setPermisoNotificaciones(false);
      Alert.alert("🔕 Notificaciones desactivadas", "Ya no recibirás alertas.");
    }
  };

  // 🌙 Modo oscuro
  const toggleModoOscuro = async (valor) => {
    setModoOscuro(valor);
    await AsyncStorage.setItem("modo_oscuro", valor.toString());
    Alert.alert(
      valor ? "🌙 Modo oscuro activado" : "☀️ Modo claro activado",
      "Los cambios ya han sido aplicados."
    );
  };

  // 🗑️ Eliminar cuenta del backend y limpiar sesión
  const eliminarCuenta = async () => {
    Alert.alert(
      "⚠️ Confirmar eliminación",
      "¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert("Error", "No se encontró la sesión del usuario.");
                return;
              }

              const response = await fetch(`${API_BASE_URL}/eliminarCuenta`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (response.ok) {
                await AsyncStorage.removeItem("token");
                Alert.alert("💔 Cuenta eliminada", data.message);
                navigation.navigate("Login");
              } else {
                Alert.alert("Error", data.message || "No se pudo eliminar la cuenta");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Hubo un problema con la conexión al servidor.");
            }
          },
        },
      ]
    );
  };

  // 🎨 Estilos dinámicos según modo
  const theme = modoOscuro ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>⚙️ Configuración</Text>

      {/* 🔔 Notificaciones */}
      <View style={[styles.optionCard, { backgroundColor: theme.card }]}>
        <View style={styles.optionLeft}>
          <Ionicons name="notifications-outline" size={22} color={theme.icon} />
          <Text style={[styles.optionText, { color: theme.text }]}>Notificaciones</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={theme.icon} />
        ) : (
          <Switch
            value={permisoNotificaciones}
            onValueChange={toggleNotificaciones}
            trackColor={{ false: "#d1c4e9", true: "#b39ddb" }}
            thumbColor={permisoNotificaciones ? "#6f42c1" : "#f4f3f4"}
          />
        )}
      </View>

      {/* 🌙 Modo Oscuro */}
      <View style={[styles.optionCard, { backgroundColor: theme.card }]}>
        <View style={styles.optionLeft}>
          <Ionicons name="moon-outline" size={22} color={theme.icon} />
          <Text style={[styles.optionText, { color: theme.text }]}>Modo oscuro</Text>
        </View>
        <Switch
          value={modoOscuro}
          onValueChange={toggleModoOscuro}
          trackColor={{ false: "#d1c4e9", true: "#6f42c1" }}
          thumbColor={modoOscuro ? "#fff" : "#f4f3f4"}
        />
      </View>

      {/* 🌍 Idioma */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: theme.card }]}
        onPress={() =>
          Alert.alert(
            "🌍 Idioma",
            "Funcionalidad próximamente disponible.\nPor ahora, el idioma actual es Español 🇪🇸."
          )
        }
      >
        <View style={styles.optionLeft}>
          <Ionicons name="language-outline" size={22} color={theme.icon} />
          <Text style={[styles.optionText, { color: theme.text }]}>Idioma</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.icon} />
      </TouchableOpacity>

      {/* NUEVA OPCIÓN: Ver mi información de paciente */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate("InfoPaciente")}
      >
        <View style={styles.optionLeft}>
          <Ionicons name="person-circle-outline" size={22} color={theme.icon} />
          <Text style={[styles.optionText, { color: theme.text }]}>
            Ver mi información de paciente
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={theme.icon} />
      </TouchableOpacity>

      {/* ℹ️ Información */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: theme.card }]}
        onPress={() =>
          Alert.alert(
            "ℹ️ Información de la App",
            "Versión: 1.0.0\n\nDesarrollada por: Tatiana Blanco 💜\nPropósito: Facilitar la gestión de citas, comunicacion entre pacientes y medicos."
          )
        }
      >
        <View style={styles.optionLeft}>
          <Ionicons name="information-circle-outline" size={22} color={theme.icon} />
          <Text style={[styles.optionText, { color: theme.text }]}>Información</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.icon} />
      </TouchableOpacity>

      {/* 💔 Eliminar cuenta */}
      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.delete }]} onPress={eliminarCuenta}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteText}>Eliminar cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 35,
  },
  optionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

// 🎨 Temas
const lightTheme = {
  background: "#f6edff",
  card: "#fff",
  text: "#5a4d78",
  icon: "#6f42c1",
  title: "#6f42c1",
  delete: "#b55b7d",
};

const darkTheme = {
  background: "#1e1b26",
  card: "#2c2835",
  text: "#e0d7f8",
  icon: "#bba4f9",
  title: "#cbb7ff",
  delete: "#a34766",
};
