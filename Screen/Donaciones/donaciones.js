import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import * as Clipboard from "expo-clipboard";

export default function DonacionesP() {
  const abrirNequi = () => {
    Linking.openURL("nequi://app");
  };

  const copiarTexto = async (texto) => {
    await Clipboard.setStringAsync(texto);
    Alert.alert("Número copiado", "El número fue copiado con éxito ✔️");
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ENCABEZADO */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Ionicons name="heart" size={55} color="#fff" />
          <Text style={styles.headerTitle}>Donaciones</Text>
          <Text style={styles.headerSubtitle}>
            Tu ayuda transforma vidas 🐾💚
          </Text>
        </Animatable.View>

        {/* MENSAJE MOTIVACIONAL */}
        <Animatable.View animation="fadeInUp" duration={900} style={styles.messageBox}>
          <Text style={styles.messageText}>
            Cada aporte, sin importar el tamaño, cambia el destino de un animal 
            que solo necesita una oportunidad. 💛{"\n"}{"\n"} 
            ¡Gracias por hacer parte de esta misión!
          </Text>
        </Animatable.View>

        {/* SECCIÓN PRINCIPAL — SOLO NEQUI */}
        <Text style={styles.sectionTitle}>Método de Donación</Text>

        <Animatable.View animation="zoomIn" duration={900} style={styles.cardNequi}>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/c9/9d/14/c99d1437635da2d96561a8e37f0d4d4e.jpg",
            }}
            style={styles.logoNequi}
          />

          <Text style={styles.nequiTitle}>Nequi</Text>
          <Text style={styles.nequiNumber}>314 2301295</Text>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => copiarTexto("3142301295")}
          >
            <Text style={styles.buttonText}>Copiar Número</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={abrirNequi}>
            <Text style={styles.buttonText}>Abrir Nequi</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* PIE DE PÁGINA ACLARATORIO */}
        <Animatable.View animation="fadeInUp" duration={1200} style={styles.footer}>
          <Ionicons name="information-circle-outline" size={22} color="#4d6b52" />
          <Text style={styles.footerText}>
            Las donaciones se realizan exclusivamente a través de nuestra página web oficial.  
          </Text>
        </Animatable.View>

      </ScrollView>
    </View>
  );
}

/* ============================
            ESTILOS
============================ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef7f1",
    padding: 20,
  },

  header: {
    backgroundColor: "#6fbf97",
    padding: 30,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 25,
    elevation: 5,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },

  headerSubtitle: {
    color: "#fff",
    opacity: 0.95,
    marginTop: 6,
    fontSize: 16,
  },

  messageBox: {
    backgroundColor: "#ffe8d6",
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    borderLeftWidth: 6,
    borderLeftColor: "#ffb98a",
  },

  messageText: {
    fontSize: 16,
    color: "#5b4a3b",
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4d6b52",
    marginBottom: 15,
  },

  /* CARD PRINCIPAL NEQUI */
  cardNequi: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#c9e8d2",
  },

  logoNequi: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 10,
  },

  nequiTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4d6b52",
    marginBottom: 5,
  },

  nequiNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4d6b52",
    marginBottom: 15,
  },

  buttonPrimary: {
    backgroundColor: "#4d6b52",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },

  buttonSecondary: {
    backgroundColor: "#7aad81",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  footer: {
    backgroundColor: "#d6eadf",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#b8d7c8",
  },

  footerText: {
    textAlign: "center",
    color: "#4d6b52",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600",
  },
});
