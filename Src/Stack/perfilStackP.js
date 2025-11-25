import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Perfil from "../../Screen/Perfil/perfilP";
import EditarPerfil from "../../Screen/Perfil/editarPerfil";
import DetalleCita from "../../Screen/Citas/detalleCita";
import HistorialCitas from "../../Screen/Citas/historialCitas";

const Stack = createStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PerfilUsuarioP" 
        component={Perfil} 
        options={{ title: "Perfil de Usuario" }} 
      />
      <Stack.Screen 
        name="EditarPerfilP" 
        component={EditarPerfil} 
        options={{ title: "Edita tu perfil" }} 
      />
      <Stack.Screen 
        name="HistorialCitas" 
        component={HistorialCitas} 
        options={{ title: "Historial de tus citas" }}
      />
      <Stack.Screen 
        name="DetalleCita" 
        component={DetalleCita} 
        options={{ title: "Detalle de tu cita" }} 
      />

    </Stack.Navigator>
    
  );
}
