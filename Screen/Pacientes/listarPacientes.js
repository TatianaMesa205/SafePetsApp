import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_BASE_URL from "../../Src/Config"

export default function ListarPacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const response = await fetch(`${API_BASE_URL}/listarPacientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        const data = await response.json()
        if (response.ok) {
          setPacientes(data)
        } else {
          console.error("Error en la respuesta:", data)
        }
      } catch (error) {
        console.error("Error obteniendo pacientes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPacientes()
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#706180ff" />
        <Text style={{ marginTop: 10, color: "#706180ff" }}>Cargando pacientes...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🩺 Lista de Pacientes</Text>

      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetallePaciente", { paciente: item })}
          >
            <View style={styles.cardContent}>
              <Ionicons name="person-outline" size={28} color="#b2a3c0ff" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.nombre}>{item.nombre} {item.apellido} - {item.telefono}</Text>
                <Text style={styles.info}>Documento: {item.documento}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#706180ff" />
          </TouchableOpacity>
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
    color: "#706180ff",
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
    justifyContent: "space-between",
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
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#776985ff",
  },
  info: {
    fontSize: 14,
    color: "#675285ff",
  },
})
