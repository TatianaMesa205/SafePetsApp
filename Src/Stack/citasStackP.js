// CitasStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarMisCitas from "../../Screen/Citas/listarMisCitas";
import CrearCitaP from "../../Screen/Citas/crearCitaP";
import DetalleCitaP from "../../Screen/Citas/detalleCitaP";
import CrearPacienteP from "../../Screen/Pacientes/crearPacienteP";

const Stack = createStackNavigator();

export default function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarMisCitas" 
        component={ListarMisCitas} 
        options={{ title: "Mis citas" }} 
      />
      <Stack.Screen 
        name="CrearCitaP" 
        component={CrearCitaP} 
        options={{ title: "Agendar Cita" }} 
      />
      <Stack.Screen 
        name="DetalleCitaP" 
        component={DetalleCitaP}
        options={{ title: "Detalle de tu Cita" }} 
      />
      <Stack.Screen 
        name="CrearPacienteP" 
        component={CrearPacienteP}
        options={{ title: "Registrate como paciente" }} 
      />
    </Stack.Navigator>
  );
}
