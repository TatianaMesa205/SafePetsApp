
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import InicioMenu from "../../Screen/Inicio/inicio"; 
import RegistroStack from "../../Screen/RegistroA/registroA"
import MascotasAdminStack from "../../Screen/Mascotas/mascotasAdmin"

const Stack = createStackNavigator();

export default function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioMenu" 
        component={InicioMenu} 
        options={{ title: "Inicio" }} 
      />
      <Stack.Screen 
        name="RegistroA" 
        component={RegistroStack} 
        options={{ title: "Registro de administradores" }} 
      />
      <Stack.Screen 
        name="MascotasAdmin" 
        component={MascotasAdminStack} 
        options={{ title: "Agregar mascotas" }} 
      />
    </Stack.Navigator>
  );
}
