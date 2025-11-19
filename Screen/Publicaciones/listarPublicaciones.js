import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.92;

export default function ListarPublicaciones() {
  const navigation = useNavigation();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // ver más / ver menos

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Debes iniciar sesión nuevamente.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/listarPublicaciones`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const text = await response.text();
        if (text.startsWith("<")) {
          throw new Error("El backend devolvió HTML");
        }

        const data = JSON.parse(text);
        setPublicaciones(data);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#567d65" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📢 Publicaciones</Text>

      <TouchableOpacity
        style={styles.btnCrear}
        onPress={() => navigation.navigate("CrearPublicacion")}
      >
        <Text style={styles.btnCrearTexto}>➕ Crear Publicación</Text>
      </TouchableOpacity>

      <View style={{ width: "100%", alignItems: "center" }}>
        {publicaciones.map((pub, index) => {
          const isExpanded = expanded[pub.id];
          const descripcionCorta =
            pub.descripcion && pub.descripcion.length > 120
              ? pub.descripcion.substring(0, 120) + "..."
              : pub.descripcion;

          return (
            <Animatable.View
              key={pub.id}
              animation="fadeInUp"
              duration={500}
              delay={index * 80}
              style={styles.card}
            >
              {/* FECHA */}
              <View style={styles.header}>
                <Text style={styles.headerText}>
                  {new Date(pub.fecha_publicacion).toLocaleDateString()}
                </Text>
              </View>

              {/* FILA 1: IMAGEN + INFO */}
              <View style={styles.row}>
                {/* Imagen */}
                <Image
                  source={{ uri: pub.foto }}
                  style={styles.imagen}
                />

                {/* Tipo y contacto */}
                <View style={styles.infoBox}>
                  <Text style={styles.tipoTitulo}>{pub.tipo}</Text>


                  <Text style={styles.label}>Contacto</Text>
                  <Text style={styles.value}>{pub.contacto}</Text>
                </View>
              </View>

              {/* FILA 2: DESCRIPCIÓN COMPLETA */}
              <View style={styles.descripcionFullWidth}>
                <Text style={styles.label}>Descripción</Text>

                <Text style={styles.descripcionTexto}>
                  {isExpanded ? pub.descripcion : descripcionCorta}
                </Text>

                {pub.descripcion && pub.descripcion.length > 120 && (
                  <TouchableOpacity onPress={() => toggleExpand(pub.id)}>
                    <Text style={styles.verMas}>
                      {isExpanded ? "Ver menos ▲" : "Ver más ▼"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animatable.View>
          );
        })}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#e0ddd4ff",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f1f7f2",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#305c3b",
    textAlign: "center",
    marginBottom: 15,
  },
  btnCrear: {
    backgroundColor: "#5b7565ff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
    width: "60%",
    alignSelf: "center",
  },
  btnCrearTexto: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#faf8f5ff",
    borderRadius: 18,
    marginBottom: 22,
    paddingBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#9eafa2ff",
    paddingVertical: 8,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  /* FILA 1 */
  row: {
    flexDirection: "row",
    padding: 12,
  },

  imagen: {
    width: 170,
    height: 150,
    borderRadius: 20,
    marginRight: 15,
  },

  infoBox: {
    flex: 1,
    justifyContent: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4d6b52",
    marginTop: 5,
  },

  value: {
    fontSize: 14,
    color: "#37473f",
    marginBottom: 10,
  },

  /* FILA 2 - descripción full width */
  descripcionFullWidth: {
    paddingHorizontal: 12,
    marginTop: 5,
  },

  descripcionTexto: {
    fontSize: 14,
    color: "#37473f",
    marginBottom: 5,
    textAlign: "left",
  },

  verMas: {
    color: "#4b775c",
    fontWeight: "700",
  },
    tipoTitulo: {
    fontSize: 19,
    fontWeight: "800",
    color: "#a68b6d", // beige oscuro
    marginBottom: 10,
    },
});
