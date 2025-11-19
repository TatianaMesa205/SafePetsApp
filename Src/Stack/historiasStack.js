
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import listarHistorias from "../../Screen/Historias/historias";

const Stack = createStackNavigator();

export default function HistoriasP() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="listarHistorias" 
        component={listarHistorias} 
        options={{ title: "Historias" }} 
      />
    </Stack.Navigator>
  );
}
