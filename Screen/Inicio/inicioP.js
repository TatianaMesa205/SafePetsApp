import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Linking } from "react-native";
import API_BASE_URL from "../../Src/Config";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Animatable from "react-native-animatable";

export default function Inicio({ navigation }) {

  const [adopciones, setAdopciones] = useState([]);
  const [loadingAdopciones, setLoadingAdopciones] = useState(true);

  const imagenes = [
    { id: "1", url: "https://i.pinimg.com/1200x/3d/ce/04/3dce04787730b68fb823b1ee1c21c07c.jpg" },
    { id: "2", url: "https://i.pinimg.com/736x/01/d9/d0/01d9d00db1f443edfb69a02766aa0b0e.jpg" },
    { id: "3", url: "https://i.pinimg.com/736x/3a/37/d7/3a37d717e8ab60f23f5d34048dd4791a.jpg" },
  ];

  useEffect(() => {
    const fetchAdopciones = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/listarMascotas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const text = await response.text();
        if (text.startsWith("<")) throw new Error("HTML no válido");

        const data = JSON.parse(text);

        const adoptadas = data
          .filter(m =>
            m.estado &&
            m.estado.toString().trim().toLowerCase().includes("adopt")
          )
          .sort(() => Math.random() - 0.5) // MEZCLA ALEATORIA
          .slice(0, 3); // TOMA 3 AL AZAR

        setAdopciones(adoptadas);
      } catch (error) {
        console.log("Error al cargar adopciones:", error);
      } finally {
        setLoadingAdopciones(false);
      }
    };

    fetchAdopciones();
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Encabezado */}
        <Animatable.View animation="fadeInDown" duration={1200} style={styles.header}>
          <Ionicons name="paw" size={45} color="#fff" />
          <Text style={styles.title}>Safe Pets</Text>
          <Text style={styles.subtitle}>Fundación de Rescate y Adopción Animal</Text>
        </Animatable.View>

        {/* Carrusel de imágenes */}
        <Animatable.View animation="fadeIn" duration={1200}>
          <FlatList
            data={imagenes}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Animatable.Image
                animation="zoomIn"
                duration={900}
                source={{ uri: item.url }}
                style={styles.carouselImage}
              />
            )}
            style={{ marginBottom: 25 }}
          />
        </Animatable.View>

        {/* Introducción */}
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.section}>
          <Text style={styles.sectionTitle}>🐶 Bienvenidos a Safe Pets</Text>
          <Text style={styles.sectionText}>
            Somos una fundación dedicada al rescate, rehabilitación y adopción de animales en situación de abandono.
            Nuestra misión es darles una segunda oportunidad y promover la adopción responsable.
          </Text>
        </Animatable.View>

        {/* Misión */}
        <Animatable.View animation="fadeInLeft" duration={1000} style={styles.card}>
          <Ionicons name="sparkles-outline" size={30} color="#8b7355" />
          <Text style={styles.cardTitle}>Misión</Text>
          <Text style={styles.cardText}>
            Rescatar, cuidar y encontrar hogares amorosos para los animales desprotegidos, fomentando el respeto y
            la empatía hacia todos los seres vivos.
          </Text>
        </Animatable.View>

        {/* Visión */}
        <Animatable.View animation="fadeInRight" duration={1000} style={styles.card}>
          <Ionicons name="eye-outline" size={30} color="#8b7355" />
          <Text style={styles.cardTitle}>Visión</Text>
          <Text style={styles.cardText}>
            Ser una organización líder en rescate animal, reconocida por su impacto positivo en la sociedad y por
            promover una cultura de adopción y bienestar animal en todo el país.
          </Text>
        </Animatable.View>

        {/* Adopciones destacadas */}
        <Text style={styles.sectionTitle}>🐾 Mascotas</Text>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.adopcionContainer}>
          <View style={styles.adopcionCard}>
            <Ionicons name="paw-outline" size={40} color="#5b7558ff" />
            <Text style={styles.adopcionText}>Conoce a nuestras mascotas</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("MascotasP")}
            >
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Adopciones recientes */}
        <Text style={styles.sectionTitle}>🐾 Adopciones</Text>

        {loadingAdopciones ? (
          <Text style={{ textAlign: "center", color: "#6b4e2e", marginBottom: 20 }}>
            Cargando adopciones...
          </Text>
        ) : (

          adopciones.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#6b4e2e", marginBottom: 20 }}>
              No hay adopciones aún
            </Text>
          ) : (

            adopciones.map((item, index) => (
              <Animatable.View
                key={item.id}
                animation="fadeInUp"
                delay={index * 300}
                style={styles.adopcionMiniCard}
              >
                <TouchableOpacity onPress={() => navigation.navigate("HistoriasP")}>
                  <Text style={styles.adopcionMiniNombre}>{item.nombre}</Text>

                  <Text style={styles.adopcionMiniDescripcion}>
                    {item.descripcion
                      ? item.descripcion.slice(0, 60) + "..."
                      : "Sin descripción."}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            ))
          )
        )}

        {/* Pie de página */}
        <View style={styles.footer}>
          <Ionicons name="paw" size={26} color="#fff" style={{ marginBottom: 8 }} />

          <Text style={styles.footerTitle}>Safe Pets</Text>

          <Text style={styles.footerDescription}>
            Fundación dedicada al rescate, rehabilitación y adopción de animales en situación de vulnerabilidad.
          </Text>

          {/* Contacto */}
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text style={styles.contactText}>314 2301295</Text>
          </View>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("mailto:paulatatianamesa@gmail.com")}
          >
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text style={styles.contactText}>paulatatianamesa@gmail.com</Text>
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("https://wa.me/573142301295")}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.contactText}>WhatsApp</Text>
          </TouchableOpacity>

          <Text style={styles.footerCopy}>
            © 2025 Safe Pets — Todos los derechos reservados
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f3ed" },
  container: { flex: 1, padding: 20 },
  header: {
    backgroundColor: "#c0a994ff",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 25,
    marginBottom: 25,
    elevation: 3,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#fff", marginTop: 5 },
  subtitle: { fontSize: 14, color: "#fff", opacity: 0.9 },
  carouselImage: {
    width: 280,
    height: 160,
    borderRadius: 15,
    marginRight: 12,
  },
  section: {
    backgroundColor: "#dce4d9ff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4d6b52",
    marginBottom: 10,
  },
  sectionText: { fontSize: 15, color: "#5b4a3b", lineHeight: 22 },
  card: {
    backgroundColor: "#f2e6d8",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#6b4e2e", marginVertical: 5 },
  cardText: { fontSize: 14, color: "#5c4b3b" },
  fundacionCard: {
    backgroundColor: "#ffffffff", // beige claro
    borderRadius: 15,
    marginRight: 15,
    padding: 10,
    width: 180,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  fundacionImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  fundacionName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7b5e3b",
    marginBottom: 4,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#9a7b5f",
    marginLeft: 4,
  },

  adopcionContainer: { 
    flexDirection: "row",
    justifyContent: "center",   // ✔ Centra el card
    marginBottom: 30,
  },

  adopcionCard: {
    width: "70%",
    backgroundColor: "#c1cfc1ff",
    borderRadius: 15,
    alignItems: "center",
    padding: 18,
    elevation: 2,
  },
  adopcionText: { fontSize: 15, color: "#6b4e2e", marginVertical: 8 },
  button: {
    backgroundColor: "#4d6b52",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  testimonioCard: {
    backgroundColor: "#fffaf3",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0e2c4",
  },
  testimonioText: { fontSize: 14, color: "#5b4a3b", fontStyle: "italic", marginVertical: 6 },
  testimonioAutor: { fontSize: 13, color: "#9c7a56", textAlign: "right" },
  footer: {
    backgroundColor: "#bfa48b",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 25,
  },
  footerText: { color: "#fff", fontSize: 13, textAlign: "center", marginTop: 5 },
  adopcionMiniCard: {
    backgroundColor: "#fffaf3",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0e2c4",
  },

  adopcionMiniNombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6b4e2e",
    marginBottom: 4,
  },

  adopcionMiniDescripcion: {
    fontSize: 14,
    color: "#5b4a3b",
    fontStyle: "italic",
  },

  footerTitle: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "800",
  marginBottom: 6,
},

footerDescription: {
  color: "#fff",
  fontSize: 13,
  textAlign: "center",
  marginBottom: 12,
  opacity: 0.9,
  lineHeight: 18,
},

contactRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},

contactText: {
  color: "#fff",
  fontSize: 14,
  marginLeft: 6,
},

footerCopy: {
  color: "#fff",
  fontSize: 12,
  marginTop: 12,
  textAlign: "center",
  opacity: 0.8,
},


});
