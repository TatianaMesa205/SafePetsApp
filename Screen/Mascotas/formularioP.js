import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function FormularioP() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailLogueado, setEmailLogueado] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    obtenerEmail();
  }, []);

  const obtenerEmail = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      if (email) setEmailLogueado(email);
    } catch (error) {
      console.log("Error obteniendo email:", error);
    }
  };

  const guardarFormulario = async () => {
    if (!nombreCompleto || !cedula || !telefono || !direccion) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/registrarAdoptante`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_completo: nombreCompleto,
          cedula: cedula,
          telefono: telefono,
          direccion: direccion,
          email: emailLogueado,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert("Éxito", "Formulario guardado correctamente");

        setNombreCompleto("");
        setCedula("");
        setTelefono("");
        setDireccion("");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message || "No se pudo guardar.");
      }
    } catch (error) {
      console.log("Error enviando formulario:", error);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#E8F5E9" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>

          {/* Tarjeta */}
          <View style={styles.card}>
            <Text style={styles.title}>Formulario de Adoptante</Text>

            <Text style={styles.label}>Email (automático)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#dfe6dc" }]}
              value={emailLogueado}
              editable={false}
            />

            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre completo"
              value={nombreCompleto}
              onChangeText={setNombreCompleto}
            />

            <Text style={styles.label}>Cédula</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu número de cédula"
              value={cedula}
              onChangeText={setCedula}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu número de teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu dirección"
              value={direccion}
              onChangeText={setDireccion}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={guardarFormulario}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#1B5E20",
  },

  input: {
    backgroundColor: "#F1F8E9",
    padding: 12,
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#C5E1A5",
  },

  button: {
    backgroundColor: "#77ac7aff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  }
});
