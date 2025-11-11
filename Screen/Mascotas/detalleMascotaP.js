import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

export default function PantallaPrueba() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Encabezado con fondo beige */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={110} color="#5e4634" />
        <Text style={styles.name}>Pantalla de Prueba</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.role}>ROL DEMO</Text>
        </View>
      </View>

      {/* Tarjeta vacía */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contenido de prueba</Text>
        <View style={styles.infoRow}>
          <Ionicons name="paw-outline" size={20} color="#8b6b4b" />
          <Text style={styles.value}>Aquí puedes probar estilos</Text>
        </View>
      </View>

      {/* Botones vacíos */}
      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editText}>Botón de prueba</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Otro botón</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f1e3",
  },
  header: {
    backgroundColor: "#e8d7bd",
    paddingVertical: 50,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 30,
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
    justifyContent: "center",
    marginBottom: 18,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b3a2e",
    marginLeft: 10,
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#c79777ff",
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
    backgroundColor: "#af8c7aff",
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
})
