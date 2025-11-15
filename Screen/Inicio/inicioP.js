import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

export default function Inicio({ navigation }) {
  const imagenes = [
    { id: "1", url: "https://i.pinimg.com/736x/17/f9/91/17f991633ba35be93d1e62ce56db1cda.jpg" },
    { id: "2", url: "https://i.pinimg.com/1200x/28/94/0f/28940f60beea232f6175815376193a93.jpg" },
    { id: "3", url: "https://i.pinimg.com/736x/83/7d/72/837d726caf9f49a7eb9c55c78f25e827.jpg" },
  ];

  const testimonios = [
    {
      id: "1",
      nombre: "María López",
      texto: "Gracias a Safe Pets adopté a Luna, una perrita maravillosa. ¡Cambió mi vida!",
      icon: "heart-outline",
    },
    {
      id: "2",
      nombre: "Carlos Pérez",
      texto: "Adoptar fue fácil y seguro. El equipo me ayudó en cada paso.",
      icon: "paw-outline",
    },
    {
      id: "3",
      nombre: "Laura Gómez",
      texto: "Safe Pets me devolvió la fe en la adopción responsable ❤️",
      icon: "happy-outline",
    },
  ];

  const fundaciones = [
    { 
      id: "1", 
      nombre: "Fundación Natufauna", 
      ubicacion: "Sogamoso, Boyacá",
      img: "https://scontent.feoh2-1.fna.fbcdn.net/v/t39.30808-6/557606103_122220623606041809_3473454671844013231_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFqIRL8OwIAWaUMYn6SsNx3OK1aZ2MKxIk4rVpnYwrEiTZecsUFLDLN3foXmNiwJ8b9MCBV89rsKIoR8kTKwfI5&_nc_ohc=1soGMPIi0FgQ7kNvwHdHons&_nc_oc=AdkhTIcyfOMpBfjwVbbGNLJA26qJ0uxMjOAdzNv6hy5qV16ZWVDVA-Ob38Ah1ns3e4g&_nc_zt=23&_nc_ht=scontent.feoh2-1.fna&_nc_gid=9B3KuYJNAsT7taxbifw8Gg&oh=00_AfhAzLmx4b5icKTxOUmwd2qlKIU_4h8zNcPoZKmFlQHL_Q&oe=6914915B",
      url: "https://www.facebook.com/p/Fundacion-Natufauna-Oficial-61551254278311/?locale=es_LA",
    },
    { 
      id: "2", 
      nombre: "Dejando Huella", 
      ubicacion: "Duitama, Boyacá",
      img: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzpQq2cjbJTBt2Q4Eh8y4L66Nxp3rtZo7fl9TDVdzgZDYeTnvEFAozxRo0X4lZav7sWxkc7L_4NA9W_NIYRqC38ROrON6bPF0A9238ZQ3NYx_hoBxJiqlC3XT8SM8ZE7qnfzN79=s680-w680-h510-rw",
      url: "https://www.facebook.com/gloriatorresacosta/?locale=es_LA",
    },
    { 
      id: "3", 
      nombre: "Refugio Salva", 
      ubicacion: "Tunja, Boyacá",
      img: "https://scontent.feoh2-1.fna.fbcdn.net/v/t51.82787-15/559420661_18525332389032350_7124749980183384047_n.webp?stp=dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG07ySQTaWHJKOLZoD-v_TvEmCbYHJq1eYSYJtgcmrV5sqScbz9QqGBKWZgJwiYU-kZ6rRHB6GIJZ4wx_O8uWLo&_nc_ohc=vdY-2xpJOzYQ7kNvwGBsD6y&_nc_oc=Adkjs1vidqP4jARKJV_j_2Lps11QxyNM-_h76CO9wS2mBGwlsC3GBF7RV3tI-3HauV0&_nc_zt=23&_nc_ht=scontent.feoh2-1.fna&_nc_gid=rajRgQFl9dcX7cdSwD_GRQ&oh=00_AfjaWoVaj7IhDVNQwsAq8O1TIfrrp1CjyqFmMAiTrMYgqA&oe=6914A61E",
      url: "https://www.facebook.com/fundacion.salva/?locale=es_LA",
    },
  ];


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

        <Text style={styles.sectionTitle}>🏡 Fundaciones Cercanas</Text>
        <FlatList
          horizontal
          data={fundaciones}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <View style={styles.fundacionCard}>
                <Image source={{ uri: item.img }} style={styles.fundacionImage} />
                <Text style={styles.fundacionName}>{item.nombre}</Text>

                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color="#a67b5b" />
                  <Text style={styles.locationText}>{item.ubicacion}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={{ marginBottom: 30 }}
        />



        {/* Adopciones destacadas */}
        <Text style={styles.sectionTitle}>🐾 Adopciones Destacadas</Text>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.adopcionContainer}>
          <View style={styles.adopcionCard}>
            <Ionicons name="paw-outline" size={40} color="#a47c48" />
            <Text style={styles.adopcionText}>Conoce a nuestras mascotas</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("MascotasP")}
            >
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Testimonios */}
        <Text style={styles.sectionTitle}>💬 Testimonios</Text>
        {testimonios.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            delay={index * 300}
            style={styles.testimonioCard}
          >
            <Ionicons name={item.icon} size={22} color="#bfa48b" />
            <Text style={styles.testimonioText}>"{item.texto}"</Text>
            <Text style={styles.testimonioAutor}>— {item.nombre}</Text>
          </Animatable.View>
        ))}

        {/* Pie de página */}
        <View style={styles.footer}>
          <Ionicons name="paw" size={20} color="#fff" />
          <Text style={styles.footerText}>
            Safe Pets © 2025 — Fundación de Rescate Animal {"\n"}Hecho con 💛 por amantes de los animales
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
    backgroundColor: "#fff",
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
    color: "#7b6042",
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
    backgroundColor: "#eed8b8ff",
    borderRadius: 15,
    alignItems: "center",
    padding: 18,
    elevation: 2,
  },
  adopcionText: { fontSize: 15, color: "#6b4e2e", marginVertical: 8 },
  button: {
    backgroundColor: "#c4a484",
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
});
