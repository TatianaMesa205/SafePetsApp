import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  // Campos del usuario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  // Campos del adoptante
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !nombreUsuario ||
      !email ||
      !contrasena ||
      !confirmarContrasena ||
      !nombreCompleto ||
      !cedula ||
      !telefono ||
      !direccion
    ) {
      Alert.alert("⚠️ Error", "Por favor completa todos los campos");
      return;
    }

    // ❌ Validar espacios
    if (/\s/.test(nombreUsuario)) {
      Alert.alert("⚠️ Nombre inválido", "El nombre de usuario no puede contener espacios");
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert("🔒 Contraseña inválida", "Debe tener mínimo 6 caracteres");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert("❌ Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Registrar USUARIO
      const responseUser = await fetch(`${API_BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: nombreUsuario,
          email: email,
          password: contrasena,
          id_roles: 2,
        }),
      });

      const dataUser = await responseUser.json();

      // ❗️ Si hay error desde el BACKEND
      if (!responseUser.ok) {
        setLoading(false);

        // 🔥 Mostrar errores específicos
        if (dataUser.errors) {
          if (dataUser.errors.nombre_usuario) {
            Alert.alert("❌ Error", dataUser.errors.nombre_usuario[0]);
            return;
          }
          if (dataUser.errors.email) {
            Alert.alert("❌ Error", dataUser.errors.email[0]);
            return;
          }
        }

        // fallback genérico
        Alert.alert("❌ Error", dataUser.message || "No se pudo registrar el usuario");
        return;
      }

      // 2️⃣ Registrar ADOPTANTE
      const responseAdoptante = await fetch(`${API_BASE_URL}/registrarAdoptante`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre_completo: nombreCompleto,
          cedula: cedula,
          telefono: telefono,
          direccion: direccion,
          email: email,
        }),
      });

      const dataAdoptante = await responseAdoptante.json();

      if (responseAdoptante.status !== 201) {
        setLoading(false);
        Alert.alert("⚠️ Usuario creado pero datos incompletos", dataAdoptante.message);
        return;
      }

      setLoading(false);
      Alert.alert(
        "🎉 Registro completo",
        "Usuario y formulario del adoptante registrados correctamente."
      );
      navigation.navigate("Login");

    } catch (error) {
      console.error("🚨 Error en el registro:", error);
      Alert.alert("🚨 Error", "Hubo un problema con la conexión al servidor");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gradientBackground}>
          <View style={styles.container}>
            <View style={styles.card}>
              {/* Encabezado */}
              <View style={styles.cardHeader}>
                <Ionicons name="paw" size={40} color="#fff" />
                <Text style={styles.headerTitle}>Crea tu cuenta</Text>
                <Text style={styles.headerSubtitle}>
                  Únete a Safe Pets y completa tu información de adoptante
                </Text>
              </View>

              {/* Cuerpo */}
              <View style={styles.cardBody}>

                {/* --- CAMPOS DEL USUARIO --- */}
                <Text style={styles.sectionTitle}>Información de acceso</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="#bfa48b"
                    value={nombreUsuario}
                    onChangeText={setNombreUsuario}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#bfa48b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#bfa48b"
                    secureTextEntry
                    value={contrasena}
                    onChangeText={setContrasena}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#bfa48b"
                    secureTextEntry
                    value={confirmarContrasena}
                    onChangeText={setConfirmarContrasena}
                  />
                </View>

                {/* --- CAMPOS DEL FORMULARIO DE ADOPTANTE --- */}
                <Text style={styles.sectionTitle}>Datos adicionales</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor="#bfa48b"
                    value={nombreCompleto}
                    onChangeText={setNombreCompleto}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="card-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Cédula"
                    placeholderTextColor="#bfa48b"
                    keyboardType="numeric"
                    value={cedula}
                    onChangeText={setCedula}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    placeholderTextColor="#bfa48b"
                    keyboardType="numeric"
                    value={telefono}
                    onChangeText={setTelefono}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="location-outline" size={22} color="#8b7355" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Dirección"
                    placeholderTextColor="#bfa48b"
                    value={direccion}
                    onChangeText={setDireccion}
                  />
                </View>


                {/* Botón */}
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Registrarme</Text>
                  )}
                </TouchableOpacity>

                {/* Enlaces */}
                <View style={styles.linksContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.linkText}>
                      ¿Ya tienes una cuenta?{" "}
                      <Text style={styles.linkHighlight}>Inicia sesión</Text>
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


/* ======== ESTILOS (SE MANTIENEN IGUALES + CAMPOS NUEVOS) ======== */
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#efd2b7ff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  container: {
    width: "85%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  card: { borderRadius: 20, overflow: "hidden" },
  cardHeader: {
    backgroundColor: "#bfa48b",
    alignItems: "center",
    paddingVertical: 30,
  },
  headerTitle: { fontSize: 28, color: "#fff", fontWeight: "800", marginTop: 8 },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  cardBody: { padding: 30, backgroundColor: "#ffffff" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#5c4b3b",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e6e2dd",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  inputAlone: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 2,
    borderColor: "#e6e2dd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginVertical: 10,
    color: "#5c4b3b",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, paddingVertical: 10, color: "#5c4b3b" },

  button: {
    backgroundColor: "#c4a484",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  linksContainer: { alignItems: "center", marginTop: 25 },
  linkText: { color: "#7a6f67", fontSize: 15 },
  linkHighlight: { color: "#c4a484", fontWeight: "700" },
});
