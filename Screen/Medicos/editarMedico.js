import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // 👈 import
import API_BASE_URL from "../../Src/Config";

export default function EditarMedico({ route, navigation }) {
  const { medico } = route.params;

  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idEspecialidad, setIdEspecialidad] = useState(medico?.id_especialidades || "");
  const [nombreM, setNombreM] = useState(medico?.nombre_m || "");
  const [apellidoM, setApellidoM] = useState(medico?.apellido_m || "");
  const [edad, setEdad] = useState(medico?.edad?.toString() || "");
  const [telefono, setTelefono] = useState(medico?.telefono || "");

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarEspecialidades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error cargando medicos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/actualizarMedicos/${medico.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_especialidades: idEspecialidad,
          nombre_m: nombreM,
          apellido_m: apellidoM,
          edad,
          telefono,
        }),
      });
      if (response.ok) {
        alert("✅ Médico actualizado correctamente");
        navigation.navigate("ListarMedicos", { reload: true });
      } else {
        alert("❌ Error al actualizar médico");
      }
    } catch (error) {
      console.error("Error en la actualización", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#a67c52" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Editar Médico</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombreM}
          onChangeText={setNombreM}
          placeholder="Nombre del médico"
          placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={apellidoM}
          onChangeText={setApellidoM}
          placeholder="Apellido del médico"
          placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          placeholder="Edad"
          placeholderTextColor="#b0b0b0"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Teléfono"
          placeholderTextColor="#b0b0b0"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Especialidad</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text style={{ color: idEspecialidad ? "#333" : "#b0b0b0" }}>
            {idEspecialidad
              ? especialidades.find((e) => e.id === idEspecialidad)?.nombre_e || "Seleccionar Especialidad"
              : "Seleccionar Especialidad"}
          </Text>
        </TouchableOpacity>

        {/* Modal Especialidades */}
        <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Selecciona la Especialidad</Text>
              <FlatList
                data={especialidades}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      setIdEspecialidad(item.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.nombre_e}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6", // beige
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a67c52",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d4b483",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#a67c52",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a67c52",
    marginBottom: 15,
    textAlign: "center",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "flex-start",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
