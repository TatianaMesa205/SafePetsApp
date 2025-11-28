import React from "react";
import { View, Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

export default function DonacionesP() {

    // ACTUALIZADO CON REDIRECCIONES Y CUENTAS FALSAS

    const abrirNequi = () => {
    Linking.openURL("nequi://app");
    };

    const abrirBancolombia = () => {
    Linking.openURL("bancolombia://");
    };

    const abrirDavivienda = () => {
    Linking.openURL("davivienda://");
    };

    const abrirNu = () => {
    Linking.openURL("nubank://");
    };

    // Banco Popular → no tiene deep link, no abrimos nada
    // solo copiar número

    // COPIAR TEXTO
    const copiarTexto = async (texto) => {
    await Clipboard.setStringAsync(texto);
    Alert.alert("Número copiado", "El número fue copiado con éxito ✔️");
    };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Encabezado */}
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <Ionicons name="heart-outline" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Donaciones</Text>
          <Text style={styles.headerSubtitle}>
            Tu ayuda transforma vidas 🐾💚
          </Text>
        </Animatable.View>

        {/* Mensaje motivacional */}
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.messageBox}>
          <Text style={styles.messageText}>
            Cada aporte, sin importar el tamaño, cambia el destino de un animal 
            que solo necesita una oportunidad. 💛{"\n"}{"\n"} 
            ¡Gracias por hacer parte de esta misión!
          </Text>
        </Animatable.View>

        {/* Sección de métodos */}
        <Text style={styles.sectionTitle}>Métodos de donación</Text>

        {/* NEQUI */}
        <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
        <Image
            source={{ uri: "https://i.pinimg.com/736x/c9/9d/14/c99d1437635da2d96561a8e37f0d4d4e.jpg" }}
            style={styles.logo}
        />

        <Text style={styles.cardTitle}>Nequi</Text>
        <Text style={styles.cardPhone}>314 2301295</Text>

        <View style={styles.row}>
            <TouchableOpacity
            style={styles.cardButton}
            onPress={() => copiarTexto("3142301295")}
            >
            <Text style={styles.cardButtonText}>Copiar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardButton} onPress={abrirNequi}>
            <Text style={styles.cardButtonText}>Abrir App</Text>
            </TouchableOpacity>
        </View>
        </Animatable.View>



        {/* Otros métodos (solo visuales) */}
        <Text style={styles.sectionSubtitle}>Otros bancos</Text>

        <View style={styles.grid}>

{/* Bancolombia */}
<Animatable.View animation="fadeInUp" duration={800} style={styles.bankCard}>
  <Image
    source={{ uri: "https://i.pinimg.com/736x/b8/cd/c1/b8cdc1ad498fe080bc21bb5a03c24f83.jpg" }}
    style={styles.bankLogo}
  />
  <Text style={styles.bankName}>Bancolombia</Text>
  <Text style={styles.bankInfo}>Ahorros • 03258965412</Text>

  <TouchableOpacity
    style={styles.bankButton}
    onPress={() => copiarTexto("03258965412")}
  >
    <Text style={styles.bankButtonText}>Copiar</Text>
  </TouchableOpacity>
</Animatable.View>

{/* Davivienda */}
<Animatable.View animation="fadeInUp" duration={850} style={styles.bankCard}>
  <Image
    source={{ uri: "https://i.pinimg.com/736x/5e/44/1b/5e441bd3b9e7fbc0fd5f8ed3d3d130e2.jpg" }}
    style={styles.bankLogo}
  />
  <Text style={styles.bankName}>Davivienda</Text>
  <Text style={styles.bankInfo}>Corriente • 556789003</Text>

  <TouchableOpacity
    style={styles.bankButton}
    onPress={() => copiarTexto("556789003")}
  >
    <Text style={styles.bankButtonText}>Copiar</Text>
  </TouchableOpacity>
</Animatable.View>

{/* Banco Popular */}
<Animatable.View animation="fadeInUp" duration={900} style={styles.bankCard}>
  <Image
    source={{
      uri: "https://www.bancopopular.com.co/BuscadordePuntosPopular/images/popularIconBancoCuadrado.png",
    }}
    style={styles.bankLogo}
  />
  <Text style={styles.bankName}>Banco Popular</Text>
  <Text style={styles.bankInfo}>Ahorros • 908123456</Text>

  <TouchableOpacity
    style={styles.bankButton}
    onPress={() => copiarTexto("908123456")}
  >
    <Text style={styles.bankButtonText}>Copiar</Text>
  </TouchableOpacity>
</Animatable.View>

{/* Nu */}
<Animatable.View animation="fadeInUp" duration={950} style={styles.bankCard}>
  <Image
    source={{
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrsmBKR1dvSvZnigTXt7HWQNWIr-O2tiJ23iOahKyQLuZL4LBTPNQYKllvY8IfyFlXvsc&usqp=CAU",
    }}
    style={styles.bankLogo}
  />
  <Text style={styles.bankName}>Nu</Text>
  <Text style={styles.bankInfo}>Digital • 778900112233</Text>

  <TouchableOpacity
    style={styles.bankButton}
    onPress={() => copiarTexto("778900112233")}
  >
    <Text style={styles.bankButtonText}>Copiar</Text>
  </TouchableOpacity>
</Animatable.View>


        </View>

        {/* Mensaje final */}
        <Animatable.View animation="fadeInUp" duration={1200} style={styles.thanksBox}>
          <Ionicons name="sparkles-outline" size={28} color="#4d6b52" />
          <Text style={styles.thanksText}>
            “Tu gesto ayuda a sanar, alimentar y cambiar una vida para siempre.” 💚🐶
          </Text>
        </Animatable.View>

      </ScrollView>
    </View>
  );
}


// -----------------------------------------
//               ESTILOS
// -----------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f2f7f3", // verde suave clarito
    padding: 20,
  },

  header: {
    backgroundColor: "#8bc6ac", // verde pastel
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    elevation: 3,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 5,
  },

  headerSubtitle: {
    color: "#fff",
    opacity: 0.9,
    marginTop: 4,
    fontSize: 14,
  },

  messageBox: {
    backgroundColor: "#ffe8d6", 
    padding: 18,
    borderRadius: 15,
    marginBottom: 25,
    borderLeftWidth: 6,
    borderLeftColor: "#ffb98a",
  },

  messageText: {
    fontSize: 15,
    color: "#5b4a3b",
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4d6b52",
    marginBottom: 12,
  },

  sectionSubtitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6b4e2e",
    marginTop: 20,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4d6b52",
    marginBottom: 5,
  },

  cardText: {
    color: "#6b4e2e",
    fontSize: 14,
  },

  cardPhone: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4d6b52",
    marginTop: 4,
    marginBottom: 12,
  },


  cardButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },



  bankName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4d6b52",
  },

  bankInfo: {
    fontSize: 12,
    color: "#6b4e2e",
    marginTop: 3,
  },

  thanksBox: {
    backgroundColor: "#d6eadf",
    padding: 18,
    borderRadius: 15,
    marginVertical: 25,
    alignItems: "center",
  },

  thanksText: {
    marginTop: 8,
    color: "#4d6b52",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

card: {
  backgroundColor: "#fff",
  padding: 15,
  borderRadius: 15,
  marginBottom: 15,
  alignItems: "center",
  elevation: 2,
  borderWidth: 1,
  borderColor: "#dfe7e2",
},

logo: {
  width: 60,
  height: 60,
  marginBottom: 8,
  borderRadius: 12,
},

cardTitle: {
  fontSize: 18,
  fontWeight: "800",
  color: "#4d6b52",
},

cardPhone: {
  fontSize: 15,
  fontWeight: "700",
  color: "#4d6b52",
  marginBottom: 10,
},

row: {
  flexDirection: "row",
  gap: 10,
},

cardButton: {
  backgroundColor: "#4d6b52",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 15,
},

cardButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13,
},

grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

bankCard: {
  width: "48%",
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 12,
  elevation: 2,
  borderWidth: 1,
  borderColor: "#dfe7e2",
},

bankLogo: {
  width: 50,
  height: 50,
  marginBottom: 6,
  resizeMode: "contain",
},

bankButton: {
  marginTop: 8,
  backgroundColor: "#4d6b52",
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 15,
},

bankButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13,
},

});
