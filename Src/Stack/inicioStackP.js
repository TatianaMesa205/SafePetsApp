
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import InicioMenuP from "../../Screen/Inicio/inicioP"; 

const Stack = createStackNavigator();

export default function InicioStackP() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioMenuP" 
        component={InicioMenuP} 
        options={{ title: "Inicio de usuarios" }} 
      />
    </Stack.Navigator>
  );
}
