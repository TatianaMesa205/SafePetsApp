import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SolicitarCita() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Solicitud de Cita</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    color: "#555",
  },
});
