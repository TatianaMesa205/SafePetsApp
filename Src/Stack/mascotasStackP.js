// CitasStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarMascotas from "../../Screen/Mascotas/listarMascotasP";
import DetalleMascotaP from "../../Screen/Mascotas/detalleMascotaP";
import FormularioP from "../../Screen/Mascotas/formularioP";
import SolicitarCita from "../../Screen/Citas/solicitarCita";

const Stack = createStackNavigator();

export default function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarMascotas" 
        component={ListarMascotas} 
        options={{ title: "Mascotas disponibles" }} 
      />
      <Stack.Screen 
        name="DetalleMascotaP" 
        component={DetalleMascotaP}
        options={{ title: "Detalle de la mascota" }} 
      />
      <Stack.Screen 
        name="FormularioP" 
        component={FormularioP}
        options={{ title: "Formulario" }} 
      />
      <Stack.Screen 
        name="SolicitarCita" 
        component={SolicitarCita}
        options={{ title: "Solicitar cita" }} 
      />

    </Stack.Navigator>
  );
}
