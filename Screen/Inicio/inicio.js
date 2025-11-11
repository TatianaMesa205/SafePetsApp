import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";
import * as Animatable from "react-native-animatable";

export default function Inicio({ navigation }) {
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        const data = await response.json();
        if (response.ok) setUserName(data.user?.name || "Usuario");
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("🌅 Buenos días");
    else if (hour < 18) setGreeting("☀️ Buenas tardes");
    else setGreeting("🌙 Buenas noches");

    fetchUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/b1/8f/2a/b18f2a67b1b38d7df5cc49d9c8ad9151.jpg",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Bienvenido 💖 {userName}</Text>
        </View>
      </Animatable.View>

      {/* Panel principal */}
      <Animatable.View animation="fadeInUp" delay={100} style={styles.hero}>
        <Image
          source={{
            uri: "https://i.pinimg.com/originals/52/11/1a/52111a22d803e70097cbcd3c20a6405a.gif",
          }}
          style={styles.heroImage}
        />
        <Text style={styles.heroText}>
          🐾 ¡Cuidemos, adoptemos y protejamos a nuestros amigos peludos!
        </Text>
      </Animatable.View>

      {/* Paneles de opciones */}
      <View style={styles.dashboard}>
        {/* 🐶 Mascotas */}
        <Animatable.View animation="zoomIn" delay={200} style={[styles.panel, { backgroundColor: "#9fc9b2" }]}>
          <Ionicons name="paw-outline" size={45} color="#fff" />
          <Text style={styles.panelTitle}>Gestión de Mascotas</Text>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => navigation.navigate("MascotasAdmin")}
          >
            <Text style={styles.panelButtonText}>Ir a Mascotas</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* 🏠 Refugios */}
        <Animatable.View animation="zoomIn" delay={300} style={[styles.panel, { backgroundColor: "#a2b9ee" }]}>
          <Ionicons name="home-outline" size={42} color="#fff" />
          <Text style={styles.panelTitle}>Refugios</Text>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonText}>Ver Refugios</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* 💉 Vacunación */}
        <Animatable.View animation="zoomIn" delay={400} style={[styles.panel, { backgroundColor: "#f6b4b0" }]}>
          <Ionicons name="medkit-outline" size={42} color="#fff" />
          <Text style={styles.panelTitle}>Vacunación</Text>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonText}>Ver Vacunas</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* ❤️ Adopciones */}
        <Animatable.View animation="zoomIn" delay={500} style={[styles.panel, { backgroundColor: "#f8d77b" }]}>
          <Ionicons name="heart-outline" size={42} color="#fff" />
          <Text style={styles.panelTitle}>Adopciones</Text>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonText}>Ver Adopciones</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* 🎁 Donaciones */}
        <Animatable.View animation="zoomIn" delay={600} style={[styles.panel, { backgroundColor: "#a88ccf" }]}>
          <Ionicons name="gift-outline" size={42} color="#fff" />
          <Text style={styles.panelTitle}>Donaciones</Text>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonText}>Apoyar Refugios</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* 🧡 Voluntariado */}
        <Animatable.View animation="zoomIn" delay={700} style={[styles.panel, { backgroundColor: "#f2a65a" }]}>
          <Ionicons name="people-outline" size={42} color="#fff" />
          <Text style={styles.panelTitle}>Voluntariado</Text>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonText}>Unirse</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {/* Frase inspiradora */}
      <Animatable.Text animation="fadeInUp" delay={800} style={styles.footer}>
        🐕 “Los animales no hablan, pero saben amar mejor que nadie.” 🐾
      </Animatable.Text>

      {/* Botón Registro Administrativo */}
      <Animatable.View animation="fadeInUp" delay={900} style={styles.registerContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("RegistroA")}
        >
          <Ionicons name="person-add-outline" size={22} color="#fff" />
          <Text style={styles.registerText}>Ir a Registro Administrativo</Text>
        </TouchableOpacity>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9fb", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  greeting: { fontSize: 16, color: "#444" },
  title: { fontSize: 20, fontWeight: "bold", color: "#3b5b6f" },
  hero: {
    backgroundColor: "#e7f4ef",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: 160,
    borderRadius: 15,
    marginBottom: 10,
  },
  heroText: {
    fontSize: 15,
    color: "#3b5b6f",
    textAlign: "center",
    fontStyle: "italic",
  },
  dashboard: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  panel: {
    width: "47%",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  panelTitle: { fontSize: 16, fontWeight: "bold", color: "#fff", marginVertical: 8, textAlign: "center" },
  panelButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 5,
  },
  panelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
    color: "#444",
    fontSize: 14,
  },
  registerContainer: { alignItems: "center", marginTop: 25, marginBottom: 35 },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4b6584",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
});
