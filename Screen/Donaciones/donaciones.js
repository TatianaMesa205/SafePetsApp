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

// Paleta de Colores Terrosos/Opacos
const COLORS = {
  background: "#c0ccbbff", // Beige claro para el fondo de la pantalla
  darkCoffee: "#4b3832", // Café oscuro para títulos y texto principal
  mediumGreen: "#98a17cff", // Verde opaco para el encabezado y botones secundarios
  lightBeige: "#e7e0d5ff", // Beige medio para cajas de mensaje y pie de página
  deepGreen: "#67774aff", // Verde militar/profundo para botones primarios y acentos
  white: "#ffffff",
  alertBorder: "#978a7aff", // Tono de borde para cajas de mensaje
};

export default function DonacionesP() {
  const abrirNequi = () => {
    Linking.openURL("nequi://app");
  };

  const copiarTexto = async (texto) => {
    await Clipboard.setStringAsync(texto);
    Alert.alert("Número copiado", "El número fue copiado con éxito ✔");
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ENCABEZADO */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <Ionicons name="heart" size={55} color={COLORS.white} />
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
          <Ionicons name="information-circle-outline" size={22} color={COLORS.darkCoffee} />
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
    backgroundColor: COLORS.background, // Fondo Beige Claro
    padding: 20,
  },

  header: {
    backgroundColor: COLORS.mediumGreen, // Verde Opaco
    padding: 30,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 25,
    elevation: 5,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },

  headerSubtitle: {
    color: COLORS.white,
    opacity: 0.95,
    marginTop: 6,
    fontSize: 16,
  },

  messageBox: {
    backgroundColor: COLORS.lightBeige, // Beige medio
    padding: 20,
    borderRadius: 18,
    marginBottom: 25,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.alertBorder, // Borde más suave
  },

  messageText: {
    fontSize: 16,
    color: COLORS.darkCoffee, // Café Oscuro
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.darkCoffee, // Café Oscuro
    marginBottom: 15,
  },

  /* CARD PRINCIPAL NEQUI */
  cardNequi: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.lightBeige, // Borde sutil
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
    color: COLORS.deepGreen, // Verde Profundo
    marginBottom: 5,
  },

  nequiNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.darkCoffee, // Café Oscuro
    marginBottom: 15,
  },

  buttonPrimary: {
    backgroundColor: COLORS.deepGreen, // Verde Profundo
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },

  buttonSecondary: {
    backgroundColor: COLORS.mediumGreen, // Verde Opaco
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },

  footer: {
    backgroundColor: COLORS.lightBeige, // Beige Medio
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.alertBorder, // Borde más suave
  },

  footerText: {
    textAlign: "center",
    color: COLORS.darkCoffee, // Café Oscuro
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600",
  },
});