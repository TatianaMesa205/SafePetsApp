
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import InicioStackP from "./Stack/inicioStackP";
import PerfilStackP from "./Stack/perfilStackP";
import MascotasStackP from "./Stack/mascotasStackP";
import PublicacionesP from "./Stack/publicacionesStack";
import HistoriasP from "./Stack/historiasStack";
import DonacionesStackP from "./Stack/donacionesStack";

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
          else if (route.name === "DonacionesP") iconName = "heart-outline";
          else if (route.name === "PerfilP") iconName = "person-outline";
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
        name="DonacionesP" 
        component={DonacionesStackP} 
        options={{ headerShown: false, 
        title: "Donaciones" }} 
      />
      <Tab.Screen 
        name="PerfilP" 
        component={PerfilStackP} 
        options={{ headerShown: false, 
        title: "Perfil" }} 
      />
    </Tab.Navigator>
  );
}
