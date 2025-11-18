
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import InicioStackP from "./Stack/inicioStackP";
import PerfilStackP from "./Stack/perfilStackP";
import MascotasStackP from "./Stack/mascotasStackP";
import ConfiguracionP from "./Stack/configuracionStackP";
import PublicacionesP from "./Stack/publicacionesStack";
import HistoriasP from "./Stack/historiasStack";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "InicioP") iconName = "home-outline";
          else if (route.name === "MascotasP") iconName = "paw-outline";
          else if (route.name === "PublicacionesP") iconName = "newspaper-outline";
          else if (route.name === "HistoriasP") iconName = "book-outline";
          else if (route.name === "PerfilP") iconName = "person-outline";
          else if (route.name === "ConfiguracionP") iconName = "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#bd6a33ff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen 
        name="InicioP" 
        component={InicioStackP} 
        options={{ headerShown: false, 
        title: "Inicio" }} 
      />

      <Tab.Screen 
        name="MascotasP" 
        component={MascotasStackP} 
        options={{ headerShown: false, 
        title: "Mascotas" }} 
      />
      <Tab.Screen 
        name="PublicacionesP" 
        component={PublicacionesP} 
        options={{ headerShown: false, 
        title: "Publicaciones" }} 
      />
      <Tab.Screen 
        name="HistoriasP" 
        component={HistoriasP} 
        options={{ headerShown: false, 
        title: "Historias" }} 
      />
      <Tab.Screen 
        name="PerfilP" 
        component={PerfilStackP} 
        options={{ headerShown: false, 
        title: "Perfil" }} 
      />
      <Tab.Screen 
        name="ConfiguracionP" 
        component={ConfiguracionP} 
        options={{ headerShown: false, 
        title: "Configuracion" }} 
      />
    </Tab.Navigator>
  );
}
