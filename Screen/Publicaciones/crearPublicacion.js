import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../Src/Config";

export default function CrearPublicacion() {
  const navigation = useNavigation();

  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contacto, setContacto] = useState("");
  const [fecha] = useState(new Date());
  const [foto, setFoto] = useState(null);

  const elegirImagen = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!res.canceled) {
      setFoto(res.assets[0]);
    }
  };

  const crear = async () => {
    if (!tipo.trim() || !contacto.trim()) {
      Alert.alert("Error", "Completa todos los campos obligatorios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      let formData = new FormData();
      formData.append("tipo", tipo);
      formData.append("descripcion", descripcion);
      formData.append("contacto", contacto);

      const fechaFormateada =
        fecha.getFullYear() +
        "-" +
        String(fecha.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(fecha.getDate()).padStart(2, "0");

      formData.append("fecha_publicacion", fechaFormateada);

      if (foto) {
        formData.append("foto", {
          uri: foto.uri,
          name: "publicacion.jpg",
          type: "image/jpeg",
        });
      }

      const resp = await fetch(`${API_BASE_URL}/crearPublicacion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.log(data);
        Alert.alert("Error", "No se pudo crear la publicación.");
        return;
      }

      Alert.alert("Éxito", "Publicación creada correctamente.");
      navigation.navigate("ListarPublicaciones");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Hubo un problema al crear la publicación.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Crear Publicación</Text>

        <View style={styles.card}>
          {/* FECHA NO EDITABLE */}
          <Text style={styles.label}>Fecha publicación</Text>
          <View style={styles.fechaBox}>
            <Text style={styles.fechaTxt}>{fecha.toLocaleDateString()}</Text>
          </View>

          <Text style={styles.label}>Tipo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mascota perdida"
            onChangeText={setTipo}
            returnKeyType="next"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Escribe una descripción..."
            multiline
            onChangeText={setDescripcion}
            returnKeyType="next"
          />

          <Text style={styles.label}>Contacto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Teléfono o correo"
            onChangeText={setContacto}
            keyboardType="email-address"
            returnKeyType="done"
          />

          {/* FOTO */}
          <TouchableOpacity style={styles.btnImagen} onPress={elegirImagen}>
            <Text style={styles.btnImagenTxt}>Seleccionar Imagen</Text>
          </TouchableOpacity>

          {foto && (
            <Image
              source={{ uri: foto.uri }}
              style={{ width: "100%", height: 220, borderRadius: 12, marginTop: 15 }}
            />
          )}

          <TouchableOpacity style={styles.btnCrear} onPress={crear}>
            <Text style={styles.btnCrearTxt}>Crear Publicación</Text>
          </TouchableOpacity>
        </View>

        {/* pequeño espacio extra (igual que en tu SolicitarCita) */}
        <View style={{ height: 10 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 20,
    color: "#6A4B82",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#6A4B82",
    fontWeight: "700",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#E7DDF3",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  textarea: {
    backgroundColor: "#E7DDF3",
    padding: 14,
    borderRadius: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  fechaBox: {
    backgroundColor: "#E7DDF3",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  fechaTxt: {
    fontSize: 16,
    color: "#6A4B82",
  },
  btnImagen: {
    backgroundColor: "#6B4FA8",
    padding: 15,
    borderRadius: 12,
    marginTop: 4,
  },
  btnImagenTxt: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
  },
  btnCrear: {
    backgroundColor: "#9A7BB5",
    padding: 15,
    borderRadius: 14,
    marginTop: 20,
  },
  btnCrearTxt: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
});
