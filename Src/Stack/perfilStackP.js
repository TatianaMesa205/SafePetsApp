import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Perfil from "../../Screen/Perfil/perfilP";
import EditarPerfil from "../../Screen/Perfil/editarPerfilP"

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
    </Stack.Navigator>
    
  );
}
