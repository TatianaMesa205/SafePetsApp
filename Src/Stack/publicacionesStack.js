
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarPublicaciones from "../../Screen/Publicaciones/listarPublicaciones";
import CrearPublicacion from "../../Screen/Publicaciones/crearPublicacion";

const Stack = createStackNavigator();

export default function PublicacionesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarPublicaciones" 
        component={ListarPublicaciones} 
        options={{ title: "Publicaciones" }} 
      />
      <Stack.Screen 
        name="CrearPublicacion" 
        component={CrearPublicacion}
        options={{ title: "Crea tu publicacion" }} 
      />
    </Stack.Navigator>
  );
}
