import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetallePaciente({ route, navigation }) {
  const { paciente } = route.params;

  const handleEliminar = async () => {
  Alert.alert(
    "Confirmar eliminación",
    "¿Seguro que deseas eliminar este paciente?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/eliminarPacientes/${paciente.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });

            if (response.ok) {
              Alert.alert("Éxito", "El paciente ha sido eliminado");
              navigation.navigate("ListarPacientes");
            } else {
              const err = await response.json();
              Alert.alert("Error", err.message || "No se pudo eliminar el paciente");
            }
          } catch (error) {
            console.error("Error eliminando paciente:", error);
            Alert.alert("Error", "Ocurrió un problema al eliminar el paciente");
          }
        },
      },
    ]
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del paciente</Text>

      <View style={styles.card}>

        <View style={styles.row}>
            <Ionicons name="person-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Nombre: {paciente.nombre}</Text>
        </View>

        <View style={styles.row}>
            <Ionicons name="people-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Apellido: {paciente.apellido}</Text>
        </View>
        
        <View style={styles.row}>
            <Ionicons name="layers-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Documento: {paciente.documento}</Text>
        </View>

        <View style={styles.row}>
            <Ionicons name="call-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Teléfono: {paciente.telefono}</Text>
        </View>

        <View style={styles.row}>
            <Ionicons name="hourglass-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Email: {paciente.email}</Text>
        </View>

        <View style={styles.row}>
            <Ionicons name="calendar-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Fecha de nacimiento: {paciente.fecha_nacimiento}</Text>
        </View>

        <View style={styles.row}>
            <Ionicons name="location-outline" size={24} color="#0097A7" />
            <Text style={styles.info}>Direccion: {paciente.direccion}</Text>
        </View>




      </View>

      {/* Botón editar */}
      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() => navigation.navigate("EditarPaciente", { paciente })}
      >
        <Ionicons name="create-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Editar paciente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleEliminar}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Eliminar Paciente</Text>
      </TouchableOpacity>


      {/* Botón regresar */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#E0F7FA", 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#006064" 
  },
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginLeft: 10,
    color: "#004D40", 
  },
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
  editButton: {
    backgroundColor: "#c2b485ff", 
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  deleteButton: { backgroundColor: "#e57373" },

});
