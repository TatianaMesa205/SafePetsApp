
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import InicioMenuP from "../../Screen/Inicio/inicioP"; 

// Importa los stacks de cada módulo
import MedicosStackP from "./medicosStack";
import EspecialidadesStackP from "./especialidadesStack";

const Stack = createStackNavigator();

export default function InicioStackP() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioMenuP" 
        component={InicioMenuP} 
        options={{ title: "Inicio de usuarios" }} 
      />
      <Stack.Screen 
        name="MedicosP" 
        component={MedicosStackP} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EspecialidadesP" 
        component={EspecialidadesStackP} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
