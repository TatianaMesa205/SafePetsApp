import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../Src/Config";

export default function DescripcionMascota({ route }) {
  const { mascota } = route.params;
  const navigation = useNavigation();
  const [vacunas, setVacunas] = useState([]);
  const [loadingVacunas, setLoadingVacunas] = useState(true);


  const handleAdoptar = async () => {
    // Bloquear adopción 
    if (mascota.estado === "En Tratamiento") {
      Alert.alert(
        "Mascota en tratamiento",
        "No puedes adoptar esta mascota ya que se encuentra en tratamiento y está recibiendo cuidados médicos."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const email = await AsyncStorage.getItem("email");

      if (!token || !email) {
        Alert.alert("Error", "Debes iniciar sesión primero.");
        return;
      }

      // Validar si existe adoptante
      const response = await fetch(
        `${API_BASE_URL}/verificarAdoptante/${email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const text = await response.text();
      const existe = text === "true";

      if (existe) {

        // Validar si tiene cita activa
        const validarCita = await fetch(
          `${API_BASE_URL}/validarCitaActiva/${email}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const citaInfo = await validarCita.json();

        if (citaInfo.cita_activa) {
          Alert.alert(
            "Cita activa",
            "Ya tienes una cita pendiente o confirmada. Debes esperar a que finalice o sea cancelada por un administrador antes de solicitar otra."
          );
          return;
        }

        // ✔ Puede solicitar cita
        navigation.navigate("SolicitarCita", { mascota });

      } else {
        navigation.navigate("FormularioP");
      }

    } catch (error) {
      console.error("Error al verificar adoptante", error);
      Alert.alert("Error", "No se pudo verificar el formulario.");
    }
  };



  // 🔹 Cargar vacunas
  useEffect(() => {
    const fetchVacunas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No se encontró el token. Inicia sesión nuevamente.");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/listarVacunas/${mascota.id_mascotas}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const text = await response.text();
        if (text.startsWith("<")) {
          throw new Error("El backend devolvió HTML. Revisa autenticación o CORS.");
        }

        const data = JSON.parse(text);
        setVacunas(data);
      } catch (error) {
        console.error("Error al obtener vacunas:", error);
        Alert.alert("Error", "No se pudieron cargar las vacunas.");
      } finally {
        setLoadingVacunas(false);
      }
    };

    fetchVacunas();
  }, [mascota.id_mascotas]);

  // 🎨 Color del estado
  const getEstadoColor = () => {
    if (mascota.estado === "Disponible") return "#B7D9A8";
    if (mascota.estado === "En Tratamiento") return "#F6E8A6";
    return "#E0E0E0";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: mascota.imagen }} style={styles.imagen} resizeMode="cover" />

      <Text style={styles.nombre}>{mascota.nombre}</Text>

      {/* DATOS GENERALES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis datos</Text>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Especie:</Text>
          <Text style={styles.value}>{mascota.especie}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Raza:</Text>
          <Text style={styles.value}>{mascota.raza || "Desconocida"}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{mascota.edad}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Tamaño:</Text>
          <Text style={styles.value}>{mascota.tamano}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Fecha de ingreso:</Text>
          <Text style={styles.value}>{mascota.fecha_ingreso}</Text>
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.label}>Estado mascota:</Text>
          <Text style={[styles.estadoValue, { backgroundColor: getEstadoColor() }]}>
            {mascota.estado}
          </Text>
        </View>
      </View>

      {/* SALUD */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información adicional de salud</Text>
        <Text style={styles.historia}>{mascota.estado_salud || "Sin información disponible 🐾"}</Text>
      </View>

      {/* VACUNAS */}
      <View style={styles.vacunasCard}>
        <Text style={styles.vacunasTitle}>Carnet de vacunación</Text>

        {loadingVacunas ? (
          <ActivityIndicator size="large" color="#6B8E23" />
        ) : vacunas.length === 0 ? (
          <Text style={styles.value}>No tiene vacunas registradas 🐶</Text>
        ) : (
          vacunas.map((v, index) => (
            <View key={index} style={styles.vacunaItem}>
              <Ionicons name="medkit-outline" size={24} color="#4C6B4F" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.vacunaNombre}>
                  {v.vacuna?.nombre_vacuna || "Vacuna desconocida"}
                </Text>

                <View style={styles.vacunaDetalleRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color="#3E5E4D"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.vacunaDetalle}>Aplicada: {v.fecha_aplicacion}</Text>
                </View>

                <View style={styles.vacunaDetalleRow}>
                  <Ionicons
                    name="refresh-outline"
                    size={14}
                    color="#3E5E4D"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.vacunaDetalle}>
                    Próxima dosis: {v.proxima_dosis || "No registrada"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* HISTORIA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mi historia</Text>
        <Text style={styles.historia}>{mascota.descripcion || "Sin historia disponible 🐾"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdoptar}>
        <Text style={styles.buttonText}>¡Quiero adoptarlo! 🐶💛</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5ecdcff",
  },
  imagen: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 15,
  },
  nombre: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3E5E4D",
    textAlign: "center",
    marginBottom: 15,
  },
  section: {
    backgroundColor: "#FFFDF5",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3E5E4D",
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#4F4F4F",
  },
  value: {
    color: "#555",
  },
  estadoValue: {
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  historia: {
    color: "#555",
    fontStyle: "italic",
    lineHeight: 22,
  },
  vacunasCard: {
    backgroundColor: "#E4E7D5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#6B8E23",
  },
  vacunasTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E5E4D",
    marginBottom: 10,
    textAlign: "center",
  },
  vacunaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#F0F2E6",
    padding: 10,
    borderRadius: 12,
  },
  vacunaNombre: {
    fontWeight: "bold",
    color: "#3E5E4D",
    fontSize: 16,
  },
  vacunaDetalle: {
    color: "#555",
    fontSize: 14,
  },
  vacunaDetalleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#C9C1A8",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#3E5E4D",
    fontSize: 18,
    fontWeight: "bold",
  },
});
