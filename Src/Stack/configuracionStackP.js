import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ConfiguracionP from "../../Screen/Configuracion/configuracionP";
import InfoPaciente from "../../Screen/Configuracion/infoPaciente";

const Stack = createStackNavigator();

export default function ConfiguracionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Configuracion" 
        component={ConfiguracionP} 
        options={{ title: "Configuracion del usuario" }} 
      />
      <Stack.Screen 
        name="InfoPaciente" 
        component={InfoPaciente} 
        options={{ title: "Informacion adicional personal" }} 
      />
    </Stack.Navigator>
  );
}