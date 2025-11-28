
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import Donaciones from "../../Screen/Donaciones/donaciones"; 

const Stack = createStackNavigator();

export default function InicioStackP() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Donaciones" 
        component={Donaciones} 
        options={{ title: "Donaciones" }} 
      />
    </Stack.Navigator>
  );
}
