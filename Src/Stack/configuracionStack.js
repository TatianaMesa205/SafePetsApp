import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Configuracion from "../../Screen/Configuracion/configuracion";
import InfoAdmin from "../../Screen/Configuracion/infoAdmin";

const Stack = createStackNavigator();

export default function ConfiguracionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Configuracion" 
        component={Configuracion} 
        options={{ title: "Configuracion admin" }} 
      />
      <Stack.Screen 
        name="InfoAdmin" 
        component={InfoAdmin} 
        options={{ title: "Informacion admins" }} 
      />
    </Stack.Navigator>
  );
}