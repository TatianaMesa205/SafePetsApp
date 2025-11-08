import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegistroA from "../../Screen/RegistroA/registroA";

const Stack = createStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RegistroA" 
        component={RegistroA} 
        options={{ title: "Registro de administradores" }} 
      />
    </Stack.Navigator>
  );
}