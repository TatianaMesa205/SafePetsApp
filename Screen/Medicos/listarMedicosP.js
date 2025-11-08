import React, { useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../../Src/Config"

export default function ListarMedicos() {
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const url = `${API_BASE_URL}/listarMedicos`
        console.log("👉 fetch listar medicos:", url, "token:", !!token)

        const response = await fetch(url, {
          headers: {
            authorization: token ? `bearer ${token}` : "",
            accept: "application/json",
          },
        })

        const text = await response.text()
        let data
        try { data = JSON.parse(text) } catch (e) { data = text }

        if (!response.ok) {
          console.error("Listar medicos - status:", response.status, data)
        } else {
          setMedicos(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error("Error obteniendo medicos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicos()
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9c27b0" />
        <Text style={{ marginTop: 10, color: "#6a0080" }}>Cargando médicos...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Lista de médicos</Text>

      <FlatList
        data={medicos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Ionicons name="person-circle-outline" size={40} color="#8e24aa" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.nombreM}>
                  {item.nombre_m} {item.apellido_m}
                </Text>
                <View style={styles.infoRow}>
                  <Ionicons name="medkit-outline" size={18} color="#6a0080" />
                  <Text style={styles.infoText}> {item.especialidades?.nombre_e || "Sin especialidad"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color="#6a0080" />
                  <Text style={styles.infoText}> {item.edad} años</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={18} color="#6a0080" />
                  <Text style={styles.infoText}> {item.telefono}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f0ff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#706180",
    marginBottom: 15,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  nombreM: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a148c",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#5e35b1",
    marginLeft: 5,
  },
})
