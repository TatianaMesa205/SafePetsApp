import React, { useState } from "react";
import { View, Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function RegistrarMascota() {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("Macho");
  const [tamano, setTamano] = useState("Mediano");
  const [fechaIngreso, setFechaIngreso] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [estadoSalud, setEstadoSalud] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  // 📸 Seleccionar imagen
  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "No se puede acceder a la galería sin permiso.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setImagen({
        uri: img.uri,
        name: `foto_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }
  };

  // 📅 Manejar fecha
  const cambiarFecha = (event, selectedDate) => {
    const currentDate = selectedDate || fechaIngreso;
    setMostrarFecha(Platform.OS === "ios");
    setFechaIngreso(currentDate);
  };

  // 🚀 Registrar mascota
  const registrarMascota = async () => {
    if (!nombre || !especie || !edad || !tamano || !estadoSalud) {
      Alert.alert("Campos requeridos", "Por favor completa todos los campos obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("especie", especie);
    formData.append("raza", raza);
    formData.append("edad", edad);
    formData.append("sexo", sexo);
    formData.append("tamano", tamano);
    formData.append("fecha_ingreso", fechaIngreso.toISOString().split("T")[0]);
    formData.append("estado_salud", estadoSalud);
    formData.append("estado", estado);
    formData.append("descripcion", descripcion);

    if (imagen) {
      formData.append("imagen", {
        uri: Platform.OS === "android" ? imagen.uri : imagen.uri.replace("file://", ""),
        type: imagen.type,
        name: imagen.name,
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crearMascota`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Éxito", "Mascota registrada correctamente");
        setNombre("");
        setEspecie("");
        setRaza("");
        setEdad("");
        setSexo("Macho");
        setTamano("Mediano");
        setFechaIngreso(new Date());
        setEstadoSalud("");
        setEstado("Disponible");
        setDescripcion("");
        setImagen(null);
      } else {
        Alert.alert("❌ Error", data.message || JSON.stringify(data));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar la mascota");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🐶 Registro de Mascota</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Especie"
        value={especie}
        onChangeText={setEspecie}
      />
      <TextInput style={styles.input} placeholder="Raza" value={raza} onChangeText={setRaza} />
      <TextInput
        style={styles.input}
        placeholder="Edad (en años)"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      {/* 🔽 Selector Sexo */}
      <View style={styles.selectBox}>
        <Text style={styles.label}>Sexo:</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setSexo(sexo === "Macho" ? "Hembra" : "Macho")}
        >
          <Text style={styles.selectorText}>{sexo}</Text>
        </TouchableOpacity>
      </View>

      {/* 🔽 Selector Tamaño */}
      <View style={styles.selectBox}>
        <Text style={styles.label}>Tamaño:</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => {
            const opciones = ["Pequeño", "Mediano", "Grande"];
            const siguiente = opciones[(opciones.indexOf(tamano) + 1) % opciones.length];
            setTamano(siguiente);
          }}
        >
          <Text style={styles.selectorText}>{tamano}</Text>
        </TouchableOpacity>
      </View>

      {/* 📅 Fecha dinámica */}
      <View style={styles.selectBox}>
        <Text style={styles.label}>Fecha de ingreso:</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setMostrarFecha(true)}>
          <Text style={styles.selectorText}>
            {fechaIngreso.toISOString().split("T")[0]}
          </Text>
        </TouchableOpacity>
      </View>
      {mostrarFecha && (
        <DateTimePicker
          value={fechaIngreso}
          mode="date"
          display="default"
          onChange={cambiarFecha}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Estado de salud"
        value={estadoSalud}
        onChangeText={setEstadoSalud}
      />

      {/* 🔽 Estado */}
      <View style={styles.selectBox}>
        <Text style={styles.label}>Estado:</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => {
            const estados = ["Disponible", "Adoptado", "En Tratamiento"];
            const siguiente = estados[(estados.indexOf(estado) + 1) % estados.length];
            setEstado(siguiente);
          }}
        >
          <Text style={styles.selectorText}>{estado}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      {/* 📸 Vista previa */}
      {imagen && (
        <Image
          source={{ uri: imagen.uri }}
          style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity style={styles.btnSecundario} onPress={seleccionarImagen}>
        <Text style={styles.btnTexto}>Seleccionar imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnPrincipal} onPress={registrarMascota}>
        <Text style={styles.btnTexto}>Registrar Mascota</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f7ff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6c63ff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#444",
  },
  selector: {
    backgroundColor: "#eae6ff",
    borderRadius: 10,
    padding: 10,
    minWidth: "50%",
    alignItems: "center",
  },
  selectorText: {
    color: "#6c63ff",
    fontWeight: "bold",
  },
  btnPrincipal: {
    backgroundColor: "#6c63ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnSecundario: {
    backgroundColor: "#9c27b0",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnTexto: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
